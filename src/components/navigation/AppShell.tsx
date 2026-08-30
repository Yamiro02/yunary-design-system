import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Tool-app skeleton: grid [Sidebar | content]. Under 64rem the sidebar becomes a
 * drawer (Sidebar's `open`/`onClose`); `responsive={false}` pins the desktop layout.
 */
export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** A <Sidebar> element. */
  sidebar?: ReactNode;
  /** Default true. False disables the drawer breakpoint (fixed two-column layout). */
  responsive?: boolean;
  children?: ReactNode;
}

export function AppShell({
  sidebar, responsive = true, className = '', children, ...rest
}: AppShellProps): JSX.Element {
  return (
    <div className={cn('ds-appshell', !responsive && 'ds-appshell--static', className)} {...rest}>
      {sidebar}
      <main className="ds-appshell__main">{children}</main>
    </div>
  );
}
