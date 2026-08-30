import type { HTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';

/** Loading placeholder on --muted with a 1.4s shimmer. Sizes are rem strings. */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** CSS length — rem or %. */
  width?: string;
  height?: string;
  radius?: string;
}

export function Skeleton({
  width = '100%', height = '0.75rem', radius = 'var(--radius-sm)', className = '', style, ...rest
}: SkeletonProps): JSX.Element {
  return (
    <span
      className={cn('ds-skel', className)}
      aria-hidden="true"
      style={{ display: 'block', width, height, borderRadius: radius, ...style }}
      {...rest}
    />
  );
}
