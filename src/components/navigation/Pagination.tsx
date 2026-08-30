import type { HTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Controlled pagination on a --secondary bar (same treatment as Tabs). Numbered pages
 * + prev/next; ellipsis beyond 7 pages; current page styled like the active tab.
 */
export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /** Current page, 1-based. */
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}

function pages(pageCount: number, page: number): (number | string)[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const out: (number | string)[] = [1];
  const lo = Math.max(2, page - 1), hi = Math.min(pageCount - 1, page + 1);
  if (lo > 2) out.push('gap-l');
  for (let p = lo; p <= hi; p++) out.push(p);
  if (hi < pageCount - 1) out.push('gap-r');
  out.push(pageCount);
  return out;
}

export function Pagination({
  page = 1, pageCount = 1, onPageChange, className = '', ...rest
}: PaginationProps): JSX.Element {
  const go = (p: number) => { if (p >= 1 && p <= pageCount && p !== page) onPageChange && onPageChange(p); };
  return (
    <nav aria-label="Pagination" className={cn('ds-pagination', className)} {...rest}>
      <button type="button" className="ds-page" disabled={page <= 1} aria-label="Page précédente" onClick={() => go(page - 1)}>
        <Icon name="chevron-left" size="1rem" />
      </button>
      {pages(pageCount, page).map(p => typeof p === 'string'
        ? <span key={p} className="ds-page ds-page--ellipsis" aria-hidden="true"><Icon name="ellipsis" size="1rem" /></span>
        : (
          <button key={p} type="button" className="ds-page" aria-current={p === page ? 'page' : undefined} onClick={() => go(p)}>
            {p}
          </button>
        ))}
      <button type="button" className="ds-page" disabled={page >= pageCount} aria-label="Page suivante" onClick={() => go(page + 1)}>
        <Icon name="chevron-right" size="1rem" />
      </button>
    </nav>
  );
}
