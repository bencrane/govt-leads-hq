/**
 * Display primitives — Avatar, Stat, KVTable, DataTable, Pagination, Spinner,
 * SectionLabel, ScrollArea, CompanyLogo.
 *
 * `ScrollArea` wraps `@radix-ui/react-scroll-area` — every scrollable surface
 * in the product chrome goes through it so the scrollbars are consistent
 * (zinc-900 track, zinc-700 thumb, fade-on-idle). `DataTable` uses it for the
 * row-overflow region so wide tables don't fall back to the OS default that
 * looks "cheap" on a true-black surface.
 *
 * Sharp-edge house style: `rounded-none` everywhere. Tabular numerals on stat
 * values + table numeric columns.
 */

import * as ScrollArea$ from "@radix-ui/react-scroll-area";
import { type HTMLAttributes, type ReactNode, forwardRef, useState } from "react";
import { cx, textColor } from "./utils";
import { Button } from "./visual";

// ─────────────────────── shared ───────────────────────

type AvatarSize = "sm" | "md" | "lg";
const avatarSize: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-mono-xs",
  md: "h-9 w-9 text-mono-sm",
  lg: "h-12 w-12 text-mono-md",
};

// ─────────────────────── Avatar ───────────────────────

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  /** Render with rounded corners. House default is sharp-edge `rounded-none`. */
  rounded?: boolean;
}

export function Avatar({ src, alt, initials, size = "md", rounded }: AvatarProps) {
  const shape = rounded ? "rounded-full" : "rounded-none";
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? ""}
        className={cx(
          shape,
          "border object-cover",
          "border-[color:var(--color-border-default)]",
          avatarSize[size],
        )}
      />
    );
  }
  const label = (initials ?? "??").slice(0, 2).toUpperCase();
  return (
    <div
      role={alt ? "img" : "presentation"}
      aria-label={alt}
      className={cx(
        "flex items-center justify-center border font-mono font-semibold",
        shape,
        "border-[color:var(--color-border-accent)] bg-[color:var(--color-accent-soft)]",
        textColor.accent,
        avatarSize[size],
      )}
    >
      {label}
    </div>
  );
}

// ─────────────────────── CompanyLogo ───────────────────────

export interface CompanyLogoProps {
  /** Company name — drives the monogram fallback initials and aria-label. */
  name: string;
  /** Logo URL. May be absent, or present-but-unreachable (a 404). */
  logoUrl?: string | null;
  size?: AvatarSize;
}

/**
 * A company logo with a monogram fallback.
 *
 * Renders the logo image when a URL is present AND it loads. If the URL is
 * absent — or present but fails to load (a dead logo-CDN entry) — falls back
 * to a monogram tile (the company's initials). On load failure the broken
 * `<img>` is removed from the DOM entirely, so a lead row never shows a
 * broken-image box.
 */
export function CompanyLogo({ name, logoUrl, size = "md" }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const initials = name.slice(0, 2).toUpperCase();
  if (logoUrl && !failed) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        onError={() => setFailed(true)}
        className={cx(
          "shrink-0 rounded-none border bg-[color:var(--color-surface-base)] object-contain",
          "border-[color:var(--color-border-default)]",
          avatarSize[size],
        )}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${name} logo`}
      className={cx(
        "flex shrink-0 items-center justify-center rounded-none border font-mono font-semibold",
        "border-[color:var(--color-border-default)] bg-[color:var(--color-surface-raised)]",
        textColor.muted,
        avatarSize[size],
      )}
    >
      {initials}
    </div>
  );
}

// ─────────────────────── Stat ───────────────────────

export interface StatProps {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: { value: string; tone?: "default" | "positive" | "negative" };
}

const deltaTone = {
  default: cx("border-[color:var(--color-border-default)]", textColor.muted),
  positive: cx(
    "border-[color:var(--color-border-accent)]",
    "text-[color:var(--color-state-success)]",
  ),
  negative: cx("border-[color:var(--color-state-error)]", "text-[color:var(--color-state-error)]"),
} as const;

export function Stat({ label, value, unit, delta }: StatProps) {
  return (
    <div className="flex flex-col">
      <span className={cx("font-mono text-mono-xs uppercase", textColor.muted)}>{label}</span>
      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={cx("font-mono text-display-md font-semibold tabular-nums", textColor.strong)}
        >
          {value}
        </span>
        {unit ? (
          <span className={cx("font-mono text-body-sm", textColor.muted)}>{unit}</span>
        ) : null}
        {delta ? (
          <span
            className={cx(
              "inline-flex items-center rounded-none border px-2 py-0.5",
              "font-mono text-mono-xs uppercase",
              deltaTone[delta.tone ?? "default"],
            )}
          >
            {delta.value}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// ─────────────────────── KVTable ───────────────────────

export interface KVRow {
  label: string;
  value: ReactNode;
}

export interface KVTableProps {
  rows: ReadonlyArray<KVRow>;
}

export function KVTable({ rows }: KVTableProps) {
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3">
      {rows.map((r, i) => (
        <div key={`${r.label}-${i}`} className="contents">
          <dt className={cx("font-mono text-mono-xs uppercase", textColor.muted)}>{r.label}</dt>
          <dd className={cx("text-body-sm", textColor.default)}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ─────────────────────── ScrollArea (Radix) ───────────────────────

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir"> {
  /** Maximum height before the scrollbar appears. Pass any CSS length string. */
  maxHeight?: string;
  /** Horizontal scrollbar? */
  horizontal?: boolean;
  dir?: "ltr" | "rtl";
}

/**
 * Custom-styled scroll surface. The track is a faint zinc-900 strip; the thumb
 * is a zinc-700 bar that fades in on hover. This replaces the OS-default
 * scrollbars that look cheap on the true-black surface.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { maxHeight, horizontal, className, children, style, ...rest },
  ref,
) {
  return (
    <ScrollArea$.Root
      type="hover"
      className={cx("relative overflow-hidden", className)}
      style={{ maxHeight, ...style }}
      {...rest}
    >
      <ScrollArea$.Viewport ref={ref} className="h-full w-full">
        {children}
      </ScrollArea$.Viewport>
      <ScrollArea$.Scrollbar
        orientation="vertical"
        className={cx(
          "flex w-2 touch-none select-none border-l p-0.5",
          "border-[color:var(--color-border-subtle)]",
          "bg-[color:var(--color-surface-sunken)]",
          "transition-opacity",
        )}
      >
        <ScrollArea$.Thumb
          className={cx(
            "relative flex-1 rounded-none",
            "bg-[color:var(--color-border-strong)]",
            "before:absolute before:left-1/2 before:top-1/2 before:h-full before:w-full",
            "before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
          )}
        />
      </ScrollArea$.Scrollbar>
      {horizontal ? (
        <ScrollArea$.Scrollbar
          orientation="horizontal"
          className={cx(
            "flex h-2 touch-none select-none border-t p-0.5",
            "border-[color:var(--color-border-subtle)]",
            "bg-[color:var(--color-surface-sunken)]",
          )}
        >
          <ScrollArea$.Thumb
            className={cx("relative flex-1 rounded-none", "bg-[color:var(--color-border-strong)]")}
          />
        </ScrollArea$.Scrollbar>
      ) : null}
      <ScrollArea$.Corner className="bg-[color:var(--color-surface-sunken)]" />
    </ScrollArea$.Root>
  );
});

// ─────────────────────── DataTable ───────────────────────

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  /** Render the cell in monospace + tabular-nums (use for numeric IDs, dates). */
  mono?: boolean;
  /** Override the column width. CSS length string. */
  width?: string;
}

export interface DataTableProps<T> {
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: readonly T[];
  rowKey: (row: T, i: number) => string;
  empty?: ReactNode;
  /** Max body height — when set, the header sticks and the body scrolls. */
  maxBodyHeight?: string;
  /** Click handler — opt-in. When set, rows are keyboard-focusable. */
  onRowClick?: (row: T, i: number) => void;
  /** Optional caption for SR users. */
  caption?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  empty,
  maxBodyHeight,
  onRowClick,
  caption,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <div className={cx("border", "border-[color:var(--color-border-subtle)]")}>{empty}</div>;
  }
  const table = (
    <table className="w-full border-collapse">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead
        className={cx(
          "sticky top-0 z-10",
          "bg-[color:var(--color-surface-raised)]",
          "border-b",
          "border-[color:var(--color-border-default)]",
        )}
      >
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              scope="col"
              style={c.width ? { width: c.width } : undefined}
              className={cx(
                "px-4 py-3 text-left font-mono text-mono-xs uppercase",
                textColor.muted,
                c.align === "right" && "text-right",
                c.align === "center" && "text-center",
              )}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const interactive = !!onRowClick;
          return (
            <tr
              key={rowKey(row, i)}
              onClick={interactive ? () => onRowClick(row, i) : undefined}
              onKeyDown={
                interactive
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(row, i);
                      }
                    }
                  : undefined
              }
              tabIndex={interactive ? 0 : undefined}
              role={interactive ? "button" : undefined}
              className={cx(
                "border-b last:border-b-0",
                "border-[color:var(--color-border-subtle)]",
                interactive &&
                  "cursor-pointer hover:bg-[color:var(--color-surface-raised)] focus:bg-[color:var(--color-surface-raised)] focus:outline-none",
              )}
            >
              {columns.map((c) => {
                const raw = c.render ? c.render(row) : (row[c.key] as ReactNode);
                return (
                  <td
                    key={c.key}
                    className={cx(
                      "px-4 py-3 text-body-sm",
                      textColor.default,
                      c.mono && "font-mono tabular-nums",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                    )}
                  >
                    {raw}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  if (!maxBodyHeight) {
    return (
      <div
        className={cx(
          "overflow-x-auto rounded-none border",
          "border-[color:var(--color-border-subtle)]",
        )}
      >
        {table}
      </div>
    );
  }
  return (
    <div className={cx("rounded-none border", "border-[color:var(--color-border-subtle)]")}>
      <ScrollArea maxHeight={maxBodyHeight} horizontal>
        {table}
      </ScrollArea>
    </div>
  );
}

// ─────────────────────── Pagination ───────────────────────

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (next: number) => void;
  /** Optional page-size dropdown. */
  pageSizeOptions?: ReadonlyArray<number>;
  onPageSizeChange?: (next: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <span className={cx("font-mono text-mono-xs uppercase", textColor.muted)}>
        {total === 0 ? "0" : `${start}–${end}`} OF {total}
      </span>
      <div className="flex items-center gap-3">
        {pageSizeOptions && onPageSizeChange ? (
          <label
            className={cx(
              "flex items-center gap-2",
              "font-mono text-mono-xs uppercase",
              textColor.muted,
            )}
          >
            <span>Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={cx(
                "rounded-none border bg-[color:var(--color-surface-base)] px-2 py-1",
                "border-[color:var(--color-border-default)]",
                "font-mono text-mono-xs uppercase",
                textColor.default,
              )}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        <span className={cx("font-mono text-mono-xs tabular-nums", textColor.muted)}>
          {page} / {pageCount}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────── Spinner ───────────────────────

export interface SpinnerProps {
  size?: AvatarSize;
  label?: string;
}

const spinnerSize: Record<AvatarSize, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

export function Spinner({ size = "md", label = "Loading" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(
        "inline-block animate-spin rounded-full border-2 border-current",
        "border-r-transparent",
        textColor.accent,
        spinnerSize[size],
      )}
    />
  );
}

// ─────────────────────── SectionLabel ───────────────────────

export interface SectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  /** Two-digit section index. Pass `1` → renders `01`. */
  index: number;
  children: ReactNode;
}

export function SectionLabel({ index, children, className, ...rest }: SectionLabelProps) {
  return (
    <span
      className={cx("inline-block font-mono text-mono-xs uppercase", textColor.accent, className)}
      {...rest}
    >
      {String(index).padStart(2, "0")} <span aria-hidden>{"//"}</span> {children}
    </span>
  );
}
