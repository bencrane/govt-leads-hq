/**
 * Feedback primitives — Banner (inline alert).
 *
 * `Banner` is a static, non-overlay alert primitive; the overlay-class
 * primitives (Modal, Drawer, Tooltip, Toast) live in their own files so
 * each Radix root is co-located with one cohesive primitive:
 *
 *   `dialog.tsx`  — Modal, Drawer (both wrap @radix-ui/react-dialog)
 *   `tooltip.tsx` — Tooltip (wraps @radix-ui/react-tooltip)
 *   `toast.tsx`   — Toast + useToastQueue (wraps @radix-ui/react-toast)
 *
 * Banner shares its tone-style table with the toast surface — exported
 * from this file so callers needing the tone vocabulary find it in one
 * place.
 */

import type { ReactNode } from "react";
import { cx, textColor } from "./utils";

// ─────────────────────── shared tone vocabulary ───────────────────────

export type BannerTone = "info" | "success" | "warn" | "error";

/** Tone → border + bg + text class string. Exported so `toast.tsx` reuses
 *  the same table without duplicating it. */
export const bannerStyle: Record<BannerTone, string> = {
  info: cx(
    "border-[color:var(--color-state-info)]/40",
    "bg-[color:var(--color-state-info)]/8",
    "text-[color:var(--color-state-info)]",
  ),
  success: cx(
    "border-[color:var(--color-border-accent)]",
    "bg-[color:var(--color-state-successSoft)]",
    "text-[color:var(--color-state-success)]",
  ),
  warn: cx(
    "border-[color:var(--color-state-warn)]/40",
    "bg-[color:var(--color-state-warnSoft)]",
    "text-[color:var(--color-state-warn)]",
  ),
  error: cx(
    "border-[color:var(--color-state-error)]",
    "bg-[color:var(--color-state-errorSoft)]",
    "text-[color:var(--color-state-error)]",
  ),
};

// ─────────────────────── Banner ───────────────────────

export interface BannerProps {
  tone?: BannerTone;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  onDismiss?: () => void;
}

export function Banner({ tone = "info", title, children, actions, onDismiss }: BannerProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx("block rounded-none border px-4 py-3", bannerStyle[tone])}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {title ? <div className="mb-1 font-mono text-mono-xs uppercase">{title}</div> : null}
          {children ? (
            <div className={cx("text-body-sm", textColor.default)}>{children}</div>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className={cx("text-mono-sm", textColor.muted)}
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
