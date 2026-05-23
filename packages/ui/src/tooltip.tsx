/**
 * Tooltip primitive — wraps `@radix-ui/react-tooltip`.
 *
 * Hover + focus reveal; Radix owns the role=tooltip ARIA contract,
 * keyboard focus open/close, and the delay-on-hover semantics. We
 * provide the visual surface.
 *
 * Storybook portal escape: pass `portalContainer` to render inside the
 * iframe instead of the document body.
 */

import * as Tooltip$ from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { cx, textColor } from "./utils";

export interface TooltipProps {
  /** Text content of the tip. */
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  children: ReactNode;
  /** Delay before opening (ms). */
  delayDuration?: number;
  portalContainer?: HTMLElement | null;
}

export function Tooltip({
  label,
  side = "top",
  children,
  delayDuration = 200,
  portalContainer,
}: TooltipProps) {
  return (
    <Tooltip$.Provider delayDuration={delayDuration}>
      <Tooltip$.Root>
        <Tooltip$.Trigger asChild>{children}</Tooltip$.Trigger>
        <Tooltip$.Portal container={portalContainer}>
          <Tooltip$.Content
            side={side}
            sideOffset={6}
            className={cx(
              "z-50 max-w-xs rounded-none border px-2 py-1",
              "font-mono text-mono-xs uppercase",
              "border-[color:var(--color-border-default)]",
              "bg-[color:var(--color-surface-raised)]",
              textColor.strong,
              "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in",
            )}
          >
            {label}
            <Tooltip$.Arrow className="fill-[color:var(--color-border-default)]" />
          </Tooltip$.Content>
        </Tooltip$.Portal>
      </Tooltip$.Root>
    </Tooltip$.Provider>
  );
}
