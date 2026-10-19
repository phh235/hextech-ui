'use client';
import {
  useId,
  useMemo,
  useState,
  useCallback,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { Chart, type ChartProps } from '@tanstack/charts/react';
import { lineY, areaY, barY, barX, group, defineChart, type ChartMark } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
import { scaleBand } from '@tanstack/charts/scales/band';
import { tooltip } from '@tanstack/charts/tooltip';
import { cn } from '@/lib/cn';
import {
  chartSeriesColor,
  chartCurve,
  hextechChartTheme,
  type ChartCurveName,
} from '@/lib/chart-utils';

export interface ChartFrameProps extends Omit<ComponentPropsWithoutRef<'figure'>, 'title'> {
  title: string;
  description?: string;
  actions?: ReactNode;
}
export function ChartFrame({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: ChartFrameProps) {
  return (
    <figure
      {...props}
      className={cn(
        'hx-chart-frame relative m-0 flex min-w-0 flex-col gap-3 border border-transparent px-[1.125rem] pt-4 pb-[1.125rem] font-sans',
        className,
      )}
    >
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={`hx-chart-corner hx-chart-corner-${corner}`}
        />
      ))}
      <figcaption className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="m-0 font-display text-[1.1667rem] font-bold uppercase leading-6 tracking-[0.075em] text-foreground">
            {title}
          </p>
          {description && (
            <p className="m-0 mt-0.5 text-sm leading-[1.1025rem] tracking-[0.02em] text-[var(--hextech-ui-gold-300)]">
              {description}
            </p>
          )}
        </div>
        {actions}
      </figcaption>
      <div className="hx-chart-rule" aria-hidden="true">
        <span />
        <hr />
        <span />
      </div>
      {children}
    </figure>
  );
}
export interface ChartLegendItem {
  id: string;
  label: string;
  color?: string;
  hidden?: boolean;
}
export function ChartLegend({
  items,
  onToggle,
  className,
}: {
  items: readonly ChartLegendItem[];
  onToggle?: (id: string) => void;
  className?: string;
}) {
  return (
    <ul
      aria-label="Chart legend"
      className={cn(
        'm-0 flex list-none flex-wrap gap-x-5 gap-y-1.5 p-0 text-sm leading-[1.1025rem] tracking-[0.02em] text-[var(--hextech-ui-gold-300)]',
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={item.id}>
          {onToggle ? (
            <button
              type="button"
              aria-pressed={!item.hidden}
              onClick={() => onToggle(item.id)}
              className="flex items-center gap-2 border-0 bg-transparent p-0 outline-offset-2 focus-visible:outline-1 focus-visible:outline-focus"
            >
              <span
                aria-hidden="true"
                className="size-2 rotate-45"
                style={{
                  background: item.color || chartSeriesColor(index),
                  opacity: item.hidden ? 0.3 : 1,
                }}
              />
              {item.label}
              <span className="sr-only"> series</span>
            </button>
          ) : (
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2.5"
                style={{ background: item.color || chartSeriesColor(index) }}
              />
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
export function HextechChart<
  T,
  X extends string | number | Date = string | number | Date,
  Y extends string | number | Date = string | number | Date,
>({ className, onRender, ...props }: ChartProps<T, X, Y>) {
  const [ready, setReady] = useState(false);
  const definition = useMemo<ChartProps<T, X, Y>['definition']>(() => {
    const original = props.definition;
    if ('chart' in original)
      return {
        ...original,
        chart: (context) => {
          const spec = original.chart(context);
          return { ...spec, theme: { ...hextechChartTheme, ...spec.theme } };
        },
      };
    return { ...original, theme: { ...hextechChartTheme, ...original.theme } };
  }, [props.definition]);
  const rendered = useCallback<NonNullable<ChartProps<T, X, Y>['onRender']>>(
    (context) => {
      setReady(true);
      onRender?.(context);
    },
    [onRender],
  );
  return (
    <div data-hextech-chart-ready={ready ? 'true' : 'false'} aria-busy={!ready} inert={!ready}>
      <Chart
        {...props}
        definition={definition}
        onRender={rendered}
        className={cn(
          'min-w-0 max-w-full font-sans [&_svg]:max-w-full [&_svg]:outline-offset-2 [&_svg]:focus-visible:outline-2 [&_svg]:focus-visible:outline-focus',
          className,
        )}
      />
    </div>
  );
}
export interface ChartSeries<T> {
  id: string;
  label: string;
  value: (row: T) => number | null | undefined;
  color?: string;
}
export interface CartesianChartProps<T> {
  title: string;
  description?: string;
  data: readonly T[];
  x: (row: T) => string | number;
  series: readonly ChartSeries<T>[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  curve?: ChartCurveName;
  points?: boolean;
  legend?: boolean;
  className?: string;
  onSelect?: (row: T, seriesId: string) => void;
}
interface PlotRow<T> {
  source: T;
  x: string;
  y: number | null;
  series: string;
  color: string;
}
function Cartesian<T>({
  title,
  description,
  data,
  x,
  series,
  height = 260,
  xLabel,
  yLabel,
  curve = 'linear',
  points = true,
  legend = true,
  className,
  onSelect,
  kind,
}: CartesianChartProps<T> & { kind: 'line' | 'area' | 'bar' }) {
  const id = useId();
  const [hidden, setHidden] = useState<string[]>([]);
  const visible = series.filter((item) => !hidden.includes(item.id));
  const definition = useMemo(() => {
    const records: PlotRow<T>[] = series.flatMap((entry, index) =>
      hidden.includes(entry.id)
        ? []
        : data.map((source) => {
            const value = entry.value(source);
            return {
              source,
              x: String(x(source)),
              y: value != null && Number.isFinite(value) ? value : null,
              series: entry.id,
              color: entry.color || chartSeriesColor(index),
            };
          }),
    );
    const marks: ChartMark<PlotRow<T>, string, number>[] =
      kind === 'bar'
        ? [
            barY(records, {
              x: 'x',
              y: 'y',
              z: 'series',
              fill: (row) => row.color,
              layout: group({ padding: 0.15 }),
              inset: 2,
            }),
          ]
        : kind === 'area'
          ? [
              areaY(records, {
                x: 'x',
                y: 'y',
                z: 'series',
                fill: (row) => row.color,
                fillOpacity: 0.16,
                y1: 0,
                curve: chartCurve(curve),
              }),
              lineY(records, {
                x: 'x',
                y: 'y',
                z: 'series',
                stroke: (row) => row.color,
                strokeWidth: 2,
                points,
                curve: chartCurve(curve),
              }),
            ]
          : [
              lineY(records, {
                x: 'x',
                y: 'y',
                z: 'series',
                stroke: (row) => row.color,
                strokeWidth: 2,
                points,
                curve: chartCurve(curve),
              }),
            ];
    return defineChart({
      marks,
      scales: {
        x: {
          scale:
            kind === 'bar'
              ? () => scaleBand<string>().padding(0.15)
              : () => scalePoint<string>().padding(0.35),
          axis: { label: xLabel || '' },
        },
        y: { scale: scaleLinear, nice: true, grid: true, axis: { label: yLabel || '' } },
      },
      theme: hextechChartTheme,
      tooltip,
      keyboard: true,
      svgAnimation: false,
      margin: { left: 46, right: 16, top: 16, bottom: 44 },
    });
  }, [series, data, hidden, x, kind, points, curve, xLabel, yLabel]);
  return (
    <ChartFrame
      title={title}
      {...(description && { description })}
      {...(className && { className })}
    >
      {data.length && visible.length ? (
        <HextechChart
          definition={definition}
          ariaLabel={title}
          ariaDescription={
            description ||
            'Use arrow keys to explore readings. The data table contains equivalent values.'
          }
          height={height}
          initialWidth={600}
          onSelect={(point) => {
            if (point) onSelect?.(point.datum.source, point.datum.series);
          }}
        />
      ) : (
        <p className="m-0 p-6 text-center text-sm text-muted-foreground">
          {data.length ? 'All series are hidden.' : 'No chart data.'}
        </p>
      )}
      {legend && (
        <ChartLegend
          items={series.map((entry, index) => ({
            id: entry.id,
            label: entry.label,
            color: entry.color || chartSeriesColor(index),
            hidden: hidden.includes(entry.id),
          }))}
          onToggle={(key) =>
            setHidden((current) =>
              current.includes(key) ? current.filter((value) => value !== key) : [...current, key],
            )
          }
        />
      )}
      <details className="min-w-0 text-xs text-muted-foreground">
        <summary className="cursor-pointer py-2 text-foreground">View chart data</summary>
        <div className="overflow-x-auto">
          <table id={`${id}-data`} className="w-full border-collapse text-start">
            <caption className="sr-only">{title} readings</caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-border p-2 text-start">
                  {xLabel || 'Position'}
                </th>
                {series.map((entry) => (
                  <th key={entry.id} scope="col" className="border-b border-border p-2 text-start">
                    {entry.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <th scope="row" className="border-b border-border p-2 text-start">
                    {x(row)}
                  </th>
                  {series.map((entry) => (
                    <td key={entry.id} className="border-b border-border p-2">
                      {entry.value(row) ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </ChartFrame>
  );
}
export function LineChart<T>(props: CartesianChartProps<T>) {
  return <Cartesian {...props} kind="line" />;
}
export function AreaChart<T>(props: CartesianChartProps<T>) {
  return <Cartesian {...props} kind="area" />;
}
export function BarChart<T>(props: CartesianChartProps<T>) {
  return <Cartesian {...props} kind="bar" />;
}
export interface RankingChartProps<T> {
  title: string;
  description?: string;
  data: readonly T[];
  label: (row: T) => string;
  value: (row: T) => number;
  height?: number;
  className?: string;
  onSelect?: (row: T) => void;
}
export function RankingChart<T>({
  title,
  description,
  data,
  label,
  value,
  height = 260,
  className,
  onSelect,
}: RankingChartProps<T>) {
  const ranked = useMemo(
    () =>
      data
        .map((source) => ({ source, label: label(source), value: value(source) }))
        .filter((row) => Number.isFinite(row.value))
        .sort((a, b) => b.value - a.value),
    [data, label, value],
  );
  const definition = useMemo(
    () =>
      defineChart({
        marks: [barX(ranked, { y: 'label', x: 'value', fill: chartSeriesColor(0), inset: 4 })],
        scales: {
          x: { scale: scaleLinear, grid: true, nice: true },
          y: { scale: () => scaleBand<string>().padding(0.2) },
        },
        theme: hextechChartTheme,
        keyboard: true,
        svgAnimation: false,
        tooltip,
        margin: { left: 86, right: 22, top: 12, bottom: 30 },
      }),
    [ranked],
  );
  return (
    <ChartFrame
      title={title}
      {...(description && { description })}
      {...(className && { className })}
    >
      {ranked.length ? (
        <HextechChart
          definition={definition}
          ariaLabel={title}
          height={height}
          initialWidth={600}
          onSelect={(point) => {
            if (point) onSelect?.(point.datum.source);
          }}
        />
      ) : (
        <p className="m-0 p-6 text-center text-sm text-muted-foreground">No ranking data.</p>
      )}
      <ol
        className="m-0 grid gap-1 pl-5 text-xs text-muted-foreground"
        aria-label={`${title} values`}
      >
        {ranked.map((row, index) => (
          <li key={index}>
            {row.label}: {row.value}
          </li>
        ))}
      </ol>
    </ChartFrame>
  );
}
export {
  chartPalette,
  chartSeriesColor,
  hextechChartTheme,
  linearCurve,
  smoothCurve,
  stepCurve,
} from '@/lib/chart-utils';
export type { ChartCurveName } from '@/lib/chart-utils';
export {
  areaY,
  barX,
  barY,
  crosshair,
  d3Curve,
  defineChart,
  dot,
  group,
  lineX,
  lineY,
  rect,
  ruleX,
  ruleY,
  stack,
  text,
  tickX,
  tickY,
} from '@tanstack/charts';
export { scaleBand } from '@tanstack/charts/scales/band';
export { scaleLinear } from '@tanstack/charts/scales/linear';
export { scaleOrdinal } from '@tanstack/charts/scales/ordinal';
export { scalePoint } from '@tanstack/charts/scales/point';
export { tooltip } from '@tanstack/charts/tooltip';
export type {
  ChartDefinition,
  ChartPoint,
  ChartTheme,
  ChartValue,
  DomChartDefinition,
} from '@tanstack/charts';
