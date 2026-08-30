import type {
  HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';
import type { JSX } from 'react';

/**
 * Composable data table: Table > THead/TBody > Tr > Th/Td. Tokens only — typo caption
 * for headers, 1px --border rows. Empty state: render EmptyState INSTEAD of the table.
 * `framed` gives the table its own contour — no Card wrapper needed. All four flags compose.
 */
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Even rows get a muted wash. */
  striped?: boolean;
  /** Rows tint to --accent on hover. */
  hoverable?: boolean;
  /** Self-contained frame: 1px --border contour, radius-lg, --card fill, header on --background. */
  framed?: boolean;
  /** Vertical 1px --border dividers between columns. */
  columns?: boolean;
}

export function Table({
  striped = false, hoverable = false, framed = false, columns = false, className = '', children, ...rest
}: TableProps): JSX.Element {
  return (
    <table
      className={cn(
        'ds-table',
        striped && 'ds-table--striped',
        hoverable && 'ds-table--hoverable',
        framed && 'ds-table--framed',
        columns && 'ds-table--columns',
        className,
      )}
      {...rest}
    >
      {children}
    </table>
  );
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>): JSX.Element { return <thead {...props} />; }
export function TBody(props: HTMLAttributes<HTMLTableSectionElement>): JSX.Element { return <tbody {...props} />; }
export function Tr(props: HTMLAttributes<HTMLTableRowElement>): JSX.Element { return <tr {...props} />; }
export function Th(props: ThHTMLAttributes<HTMLTableCellElement>): JSX.Element { return <th {...props} />; }
export function Td(props: TdHTMLAttributes<HTMLTableCellElement>): JSX.Element { return <td {...props} />; }
