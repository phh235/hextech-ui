import type { ChartCurve, ChartTheme } from '@tanstack/charts';
export const chartPalette = [
  'var(--hextech-ui-chart-series-1)',
  'var(--hextech-ui-chart-series-2)',
  'var(--hextech-ui-chart-series-3)',
  'var(--hextech-ui-chart-series-4)',
  'var(--hextech-ui-chart-series-5)',
  'var(--hextech-ui-chart-series-6)',
] as const;
export const hextechChartTheme: ChartTheme = {
  foreground: 'var(--hextech-ui-foreground)',
  muted: 'var(--hextech-ui-gold-300)',
  grid: 'var(--hextech-ui-gold-200)',
  background: 'var(--hextech-ui-background)',
  palette: chartPalette,
  focusRing: {
    fill: 'var(--hextech-ui-background)',
    stroke: 'var(--hextech-ui-focus)',
    strokeWidth: 2,
  },
};
export function chartSeriesColor(index: number): string {
  return chartPalette[
    ((Math.trunc(index) % chartPalette.length) + chartPalette.length) % chartPalette.length
  ]!;
}
type Point = readonly [number, number];
function path(points: readonly Point[], kind: 'linear' | 'smooth' | 'step'): string {
  const first = points[0];
  if (!first) return '';
  let result = `M${first[0]},${first[1]}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    if (kind === 'step') result += `H${(a[0] + b[0]) / 2}V${b[1]}H${b[0]}`;
    else if (kind === 'smooth') {
      const previous = points[i - 2] || a;
      const next = points[i + 1] || b;
      result += `C${a[0] + (b[0] - previous[0]) / 6},${a[1] + (b[1] - previous[1]) / 6} ${b[0] - (next[0] - a[0]) / 6},${b[1] - (next[1] - a[1]) / 6} ${b[0]},${b[1]}`;
    } else result += `L${b[0]},${b[1]}`;
  }
  return result;
}
function curve(kind: 'linear' | 'smooth' | 'step'): ChartCurve {
  return {
    line: (points) => path(points, kind),
    area: (top, bottom) => {
      const a = path(top, kind);
      const b = path([...bottom].reverse(), kind);
      return a && b ? a + b.replace(/^M/, 'L') + 'Z' : '';
    },
  };
}
export const linearCurve = curve('linear');
export const smoothCurve = curve('smooth');
export const stepCurve = curve('step');
export type ChartCurveName = 'linear' | 'smooth' | 'step';
export function chartCurve(name: ChartCurveName): ChartCurve {
  return name === 'smooth' ? smoothCurve : name === 'step' ? stepCurve : linearCurve;
}
