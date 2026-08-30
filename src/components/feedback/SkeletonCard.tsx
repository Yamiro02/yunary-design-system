import type { HTMLAttributes, JSX } from 'react';
import { Card } from '../data-display/Card';
import { Skeleton } from './Skeleton';

/** A media-card-shaped skeleton — use one per grid slot while a card grid loads. */
export interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Renders the 16/9 media block. Default true. */
  media?: boolean;
  lines?: number;
}

export function SkeletonCard({
  media = true, lines = 2, className = '', ...rest
}: SkeletonCardProps): JSX.Element {
  return (
    <Card flush className={className} {...rest}>
      {media ? (
        <Skeleton height="0" style={{ height: 'auto', aspectRatio: '16 / 9', borderRadius: 0 }} />
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4375rem', padding: '0.6875rem' }}>
        <Skeleton width="5.5rem" height="1.125rem" radius="var(--radius-pill)" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} width={i === lines - 1 ? '50%' : '80%'} height="0.6875rem" />
        ))}
      </div>
    </Card>
  );
}
