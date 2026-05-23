/**
 * Interactive primitives — Tabs, TabList, Tab, TabPanel.
 *
 * All built on `@radix-ui/react-tabs` so keyboard navigation (arrow keys
 * for tablist, Home/End, automatic activation toggle via `activationMode`)
 * comes for free. The hand-rolled tab pattern that lived in ae-hq's
 * `interactive.tsx` is deliberately not ported — this is the upgrade.
 */

import * as Tabs$ from "@radix-ui/react-tabs";
import type { ReactNode } from "react";
import { cx, textColor } from "./utils";

// ─────────────────────── Tabs root ───────────────────────

export interface TabsProps {
  /** Currently-active tab value. */
  value: string;
  onValueChange: (next: string) => void;
  children?: ReactNode;
  /** Manual activation requires Enter/Space; automatic activates on focus. */
  activationMode?: "automatic" | "manual";
  unsafe_className?: string;
}

export function Tabs({
  value,
  onValueChange,
  children,
  activationMode = "automatic",
  unsafe_className,
}: TabsProps) {
  return (
    <Tabs$.Root
      value={value}
      onValueChange={onValueChange}
      activationMode={activationMode}
      className={cx("flex flex-col gap-6", unsafe_className)}
    >
      {children}
    </Tabs$.Root>
  );
}

// ─────────────────────── TabList ───────────────────────

export interface TabListProps {
  /** Accessible label for the tablist. */
  "aria-label": string;
  children: ReactNode;
  unsafe_className?: string;
}

export function TabList({ "aria-label": ariaLabel, children, unsafe_className }: TabListProps) {
  return (
    <Tabs$.List
      aria-label={ariaLabel}
      className={cx(
        "flex flex-wrap items-center gap-1 border-b",
        "border-[color:var(--color-border-subtle)]",
        unsafe_className,
      )}
    >
      {children}
    </Tabs$.List>
  );
}

// ─────────────────────── Tab ───────────────────────

export interface TabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  /** Optional count badge after the label. */
  count?: number;
}

export function Tab({ value, children, disabled, count }: TabProps) {
  return (
    <Tabs$.Trigger
      value={value}
      disabled={disabled}
      className={cx(
        "-mb-px border-b-2 border-transparent px-4 py-2.5",
        "font-mono text-mono-xs uppercase tracking-wider",
        "transition-colors",
        textColor.muted,
        "hover:border-[color:var(--color-border-default)]",
        "data-[state=active]:border-[color:var(--color-accent-primary)]",
        "data-[state=active]:text-[color:var(--color-text-accent)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent-primary)]",
      )}
    >
      {children}
      {typeof count === "number" ? <span className="ml-2 tabular-nums">{count}</span> : null}
    </Tabs$.Trigger>
  );
}

// ─────────────────────── TabPanel ───────────────────────

export interface TabPanelProps {
  value: string;
  children?: ReactNode;
  /** If true the panel stays mounted while inactive (state preservation). */
  keepMounted?: boolean;
}

export function TabPanel({ value, children, keepMounted }: TabPanelProps) {
  return (
    <Tabs$.Content
      value={value}
      forceMount={keepMounted || undefined}
      className={cx("outline-none", keepMounted && "data-[state=inactive]:hidden")}
    >
      {children}
    </Tabs$.Content>
  );
}
