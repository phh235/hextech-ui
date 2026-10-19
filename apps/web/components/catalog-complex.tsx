'use client';
import { useState } from 'react';
import { ToastExample } from './toast-example';
import {
  SearchField,
  Spinner,
  Breadcrumbs,
  Breadcrumb,
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  VerticalTable,
  Calendar,
  RangeCalendar,
  DateField,
  TimeField,
  DatePicker,
  DateRangePicker,
  type DateRange,
} from '@hextech-ui/react';
export function ComplexExample({ name, disabled = false }: { name: string; disabled?: boolean }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [date, setDate] = useState('2026-10-17');
  const [range, setRange] = useState<DateRange | null>({ start: '2026-10-14', end: '2026-10-17' });
  switch (name) {
    case 'search-field':
      return (
        <div className="grid w-full max-w-sm gap-3">
          <SearchField
            label="Search builds"
            value={query}
            onValueChange={setQuery}
            onSearch={setFilter}
            debounceMs={300}
            placeholder="Type a name…"
            disabled={disabled}
          />
          <p role="status" className="text-xs text-muted-foreground">
            {filter ? `Filtering by ${filter}` : 'Showing all local builds'}
          </p>
        </div>
      );
    case 'spinner':
      return <Spinner label="Loading" />;
    case 'breadcrumbs':
      return (
        <Breadcrumbs>
          <Breadcrumb href="/docs">Docs</Breadcrumb>
          <Breadcrumb href="/docs/components">Components</Breadcrumb>
          <Breadcrumb current>Breadcrumbs</Breadcrumb>
        </Breadcrumbs>
      );
    case 'toast':
      return <ToastExample disabled={disabled} />;
    case 'preview-card':
      return (
        <PreviewCard>
          <PreviewCardTrigger href="/docs/theming">Explore the Hextech theme</PreviewCardTrigger>
          <PreviewCardContent>
            <h4 className="mb-2 font-display text-lg text-primary">One visual language.</h4>
            <p>Semantic CSS variables let you change the details without duplicating behavior.</p>
          </PreviewCardContent>
        </PreviewCard>
      );
    case 'table':
      return (
        <Table>
          <TableCaption>Local party roster</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Avery</TableCell>
              <TableCell>Support</TableCell>
              <TableCell>Ready</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rowan</TableCell>
              <TableCell>Jungle</TableCell>
              <TableCell>Preparing</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>2 local demo players</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
    case 'vertical-table':
      return (
        <VerticalTable
          label="Build comparison"
          records={[
            { id: 'balanced', name: 'Balanced', power: 65, defense: 72 },
            { id: 'focused', name: 'Focused', power: 82, defense: 48 },
          ]}
          recordKey={(record) => record.id}
          recordLabel={(record) => record.name}
          fields={[
            { id: 'power', label: 'Power', render: (record) => record.power, align: 'center' },
            {
              id: 'defense',
              label: 'Defense',
              render: (record) => record.defense,
              align: 'center',
            },
          ]}
        />
      );
    case 'calendar':
      return (
        <div className="grid gap-6">
          <Calendar
            label="Session date"
            value={date}
            onValueChange={setDate}
            referenceDate="2026-10-17"
            defaultMonth="2026-10-01"
            disabled={disabled}
          />
          <RangeCalendar
            label="Training window"
            value={range}
            onValueChange={setRange}
            referenceDate="2026-10-17"
            defaultMonth="2026-10-01"
            disabled={disabled}
          />
        </div>
      );
    case 'date-field':
      return (
        <div className="grid w-full max-w-sm gap-5">
          <DateField
            label="Session date"
            defaultValue="2026-10-17"
            description="Browser-native date segments, ISO value."
            disabled={disabled}
          />
          <TimeField label="Start time" defaultValue="19:30" disabled={disabled} />
        </div>
      );
    case 'date-picker':
      return (
        <div className="grid w-full max-w-sm gap-6">
          <DatePicker
            label="Session date"
            value={date}
            onValueChange={setDate}
            referenceDate="2026-10-17"
            min="2026-10-01"
            max="2027-12-31"
            disabled={disabled}
          />
          <DateRangePicker
            label="Training"
            value={range}
            onValueChange={setRange}
            referenceDate="2026-10-17"
            disabled={disabled}
          />
        </div>
      );
    default:
      return null;
  }
}
