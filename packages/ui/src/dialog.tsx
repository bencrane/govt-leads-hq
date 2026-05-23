/**
 * Dialog primitives — Modal, Drawer.
 *
 * Both wrap `@radix-ui/react-dialog`. Modal is centered; Drawer is a side
 * panel (right by default; left available). Radix provides focus trap,
 * ESC handling, scroll lock, and ARIA-modal contract.
 *
 * Storybook portal escape: every overlay accepts an optional
 * `portalContainer` — pass a story-local div so the portaled content
 * renders inside the iframe instead of the document body.
 */

import * as Dialog$ from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cx, textColor } from "./utils";

// ─────────────────────── Modal ───────────────────────

export type ModalSize = "sm" | "md" | "lg";

const modalSize: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export interface ModalProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  size?: ModalSize;
  /** Accessible name when `title` is absent. */
  "aria-label"?: string;
  /** Override the portal container — pass a story-local div for Storybook. */
  portalContainer?: HTMLElement | null;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  size = "md",
  "aria-label": ariaLabel,
  portalContainer,
}: ModalProps) {
  return (
    <Dialog$.Root open={open} onOpenChange={onOpenChange}>
      <Dialog$.Portal container={portalContainer}>
        <Dialog$.Overlay
          className={cx(
            "fixed inset-0 z-40",
            "bg-[color:var(--color-surface-overlay)] backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out",
          )}
        />
        <Dialog$.Content
          aria-label={!title ? (ariaLabel ?? "Dialog") : undefined}
          className={cx(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
            "rounded-none border",
            "bg-[color:var(--color-surface-raised)]",
            "border-[color:var(--color-border-default)]",
            modalSize[size],
          )}
        >
          {title ? (
            <header
              className={cx("border-b px-6 py-4", "border-[color:var(--color-border-subtle)]")}
            >
              <Dialog$.Title className={cx("font-display text-display-sm", textColor.strong)}>
                {title}
              </Dialog$.Title>
              {description ? (
                <Dialog$.Description className={cx("mt-1 text-body-sm", textColor.muted)}>
                  {description}
                </Dialog$.Description>
              ) : null}
            </header>
          ) : (
            <Dialog$.Title className="sr-only">{ariaLabel ?? "Dialog"}</Dialog$.Title>
          )}
          <div className="px-6 py-5">{children}</div>
          {actions ? (
            <footer
              className={cx(
                "flex items-center justify-end gap-2 border-t px-6 py-4",
                "border-[color:var(--color-border-subtle)]",
              )}
            >
              {actions}
            </footer>
          ) : null}
        </Dialog$.Content>
      </Dialog$.Portal>
    </Dialog$.Root>
  );
}

// ─────────────────────── Drawer ───────────────────────

export type DrawerSide = "left" | "right";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  side?: DrawerSide;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Width of the drawer panel. CSS length. */
  width?: string;
  "aria-label"?: string;
  portalContainer?: HTMLElement | null;
}

export function Drawer({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  width = "420px",
  "aria-label": ariaLabel,
  portalContainer,
}: DrawerProps) {
  return (
    <Dialog$.Root open={open} onOpenChange={onOpenChange}>
      <Dialog$.Portal container={portalContainer}>
        <Dialog$.Overlay
          className={cx(
            "fixed inset-0 z-40",
            "bg-[color:var(--color-surface-overlay)]",
            "data-[state=open]:animate-in data-[state=open]:fade-in",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out",
          )}
        />
        <Dialog$.Content
          aria-label={!title ? (ariaLabel ?? "Drawer") : undefined}
          style={{ width }}
          className={cx(
            "fixed top-0 z-50 h-full border",
            "bg-[color:var(--color-surface-raised)]",
            "border-[color:var(--color-border-default)]",
            side === "right" ? "right-0 border-l" : "left-0 border-r",
          )}
        >
          {title ? (
            <header
              className={cx(
                "flex items-center justify-between border-b px-6 py-4",
                "border-[color:var(--color-border-subtle)]",
              )}
            >
              <Dialog$.Title className={cx("font-display text-display-sm", textColor.strong)}>
                {title}
              </Dialog$.Title>
              <Dialog$.Close
                aria-label="Close"
                className={cx("font-mono text-mono-md", textColor.muted)}
              >
                ×
              </Dialog$.Close>
            </header>
          ) : (
            <Dialog$.Title className="sr-only">{ariaLabel ?? "Drawer"}</Dialog$.Title>
          )}
          {description ? (
            <Dialog$.Description className="sr-only">{description}</Dialog$.Description>
          ) : null}
          <div className="px-6 py-5">{children}</div>
        </Dialog$.Content>
      </Dialog$.Portal>
    </Dialog$.Root>
  );
}
