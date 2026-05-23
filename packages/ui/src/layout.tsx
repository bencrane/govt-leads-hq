/**
 * Layout primitives — the geometry sub-layer.
 *
 * Stack, Inline, Grid, Box, Divider, Page. These own all spacing and sizing in
 * the design system. Routes describe content; layout primitives describe
 * geometry. They are deliberately kept distinct from the VISUAL primitives
 * (`visual.tsx`) — a layout primitive never carries a brand color or type
 * treatment, and a visual primitive never owns page geometry.
 *
 * Every spacing/width prop is a token NAME mapped through `utils.ts`. No
 * primitive accepts an arbitrary number.
 */

import { type ElementType, type ReactNode, forwardRef } from "react";
import {
  type BorderProp,
  type PageVariantProp,
  type SpacingProp,
  type SurfaceProp,
  borderColor,
  cx,
  pageMaxWidth,
  space,
  surfaceBg,
  textColor,
} from "./utils";

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children">;

interface CommonProps {
  children?: ReactNode;
  /** Escape hatch — last resort. Routes are linted against geometry; allowed here. */
  unsafe_className?: string;
  as?: ElementType;
}

// ────────────── Stack — vertical flex with gap ──────────────

export interface StackProps extends DivProps, CommonProps {
  gap?: SpacingProp;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  p?: SpacingProp;
  px?: SpacingProp;
  py?: SpacingProp;
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
} as const;

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { gap = "4", align, justify, p, px, py, as: As = "div", children, unsafe_className, ...rest },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cx(
        "flex flex-col",
        space.gap[gap],
        align && alignMap[align],
        justify && justifyMap[justify],
        p && space.p[p],
        px && space.px[px],
        py && space.py[py],
        unsafe_className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
});

// ────────────── Inline — horizontal flex with gap ──────────────

export interface InlineProps extends DivProps, CommonProps {
  gap?: SpacingProp;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  p?: SpacingProp;
  px?: SpacingProp;
  py?: SpacingProp;
}

const inlineAlignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;

export const Inline = forwardRef<HTMLDivElement, InlineProps>(function Inline(
  {
    gap = "4",
    align = "center",
    justify,
    wrap,
    p,
    px,
    py,
    as: As = "div",
    children,
    unsafe_className,
    ...rest
  },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cx(
        "flex",
        wrap && "flex-wrap",
        space.gap[gap],
        inlineAlignMap[align],
        justify && justifyMap[justify],
        p && space.p[p],
        px && space.px[px],
        py && space.py[py],
        unsafe_className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
});

// ────────────── Grid ──────────────

type ColCount = 1 | 2 | 3 | 4 | 6 | 12;

export interface GridProps extends DivProps, CommonProps {
  cols?: ColCount;
  mdCols?: ColCount;
  lgCols?: ColCount;
  gap?: SpacingProp;
}

const colMap: Record<ColCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const mdColMap: Record<ColCount, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};

const lgColMap: Record<ColCount, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { cols = 1, mdCols, lgCols, gap = "4", as: As = "div", children, unsafe_className, ...rest },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cx(
        "grid",
        colMap[cols],
        mdCols && mdColMap[mdCols],
        lgCols && lgColMap[lgCols],
        space.gap[gap],
        unsafe_className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
});

// ────────────── Box — generic styled container ──────────────

export interface BoxProps extends DivProps, CommonProps {
  bg?: SurfaceProp;
  border?: BorderProp;
  p?: SpacingProp;
  px?: SpacingProp;
  py?: SpacingProp;
  rounded?: "none" | "xl";
}

const roundedMap = {
  none: "rounded-none",
  xl: "rounded-xl",
} as const;

export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
  { bg, border, p, px, py, rounded, as: As = "div", children, unsafe_className, ...rest },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cx(
        bg && surfaceBg[bg],
        border && cx("border", borderColor[border]),
        p && space.p[p],
        px && space.px[px],
        py && space.py[py],
        rounded && roundedMap[rounded],
        unsafe_className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
});

// ────────────── Divider ──────────────

export interface DividerProps {
  axis?: "horizontal" | "vertical";
  color?: BorderProp;
  unsafe_className?: string;
}

export function Divider({ axis = "horizontal", color = "subtle", unsafe_className }: DividerProps) {
  // <hr> is the semantic horizontal separator. A vertical separator within a
  // horizontal flow is a generic aria-hidden span.
  if (axis === "horizontal") {
    return (
      <hr
        className={cx(
          "h-px w-full border-0",
          borderColor[color].replace("border-", "bg-"),
          unsafe_className,
        )}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-block h-full w-px",
        borderColor[color].replace("border-", "bg-"),
        unsafe_className,
      )}
    />
  );
}

// ────────────── Page — the route-width primitive ──────────────

export interface PageProps extends DivProps, CommonProps {
  /** Content width. Owned here so routes never hand-roll `max-w-*`. */
  variant?: PageVariantProp;
  py?: SpacingProp;
}

/**
 * Page — the geometry boundary between routes and the design system. A route
 * returns `<Page variant="…">…</Page>`; it never sets `max-w-*` / `mx-auto`
 * itself. The `no-route-geometry` ESLint rule enforces this.
 */
export const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
  { variant = "default", py = "12", as: As = "div", children, unsafe_className, ...rest },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cx("mx-auto w-full", pageMaxWidth[variant], space.py[py], unsafe_className)}
      {...rest}
    >
      {children}
    </As>
  );
});

// ─────────────────────── PageHeader ───────────────────────

export interface PageHeaderProps extends CommonProps {
  /** Two-digit section index, e.g. "01". Rendered as "01 // {title}". */
  section?: string;
  /** Display-text heading. */
  title?: ReactNode;
  /** Secondary subtitle/description. */
  description?: ReactNode;
  /** Right-side actions slot. */
  actions?: ReactNode;
  /** Eyebrow text override — defaults to section + title. */
  eyebrow?: ReactNode;
}

export function PageHeader({
  section,
  title,
  description,
  actions,
  eyebrow,
  children,
  unsafe_className,
}: PageHeaderProps) {
  const eyebrowText =
    eyebrow ??
    (section ? (
      <>
        {section} <span aria-hidden>{"//"}</span>{" "}
        {typeof title === "string" ? title.toUpperCase() : title}
      </>
    ) : null);

  return (
    <header className={cx("mb-10 flex items-start justify-between gap-6", unsafe_className)}>
      <div className="min-w-0 flex-1">
        {eyebrowText ? (
          <span
            data-page-header-eyebrow
            data-testid="page-header-eyebrow"
            className={cx("inline-block font-mono text-mono-xs uppercase", textColor.accent)}
          >
            {eyebrowText}
          </span>
        ) : null}
        {title ? (
          <h1
            className={cx(
              "mt-3 font-display text-display-xl font-semibold leading-[1.05] tracking-tight",
              textColor.strong,
            )}
          >
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className={cx("mt-3 max-w-2xl text-body-lg", textColor.muted)}>{description}</p>
        ) : null}
        {children}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </header>
  );
}

// ─────────────────────── PageBody ───────────────────────

export interface PageBodyProps extends CommonProps {
  gap?: SpacingProp;
}

/**
 * Convenience body wrapper. Adds vertical rhythm between top-level sections.
 * Most routes don't need this — they put sections directly under `<Page>`.
 */
export function PageBody({ gap = "12", children, unsafe_className }: PageBodyProps) {
  return <div className={cx("flex flex-col", space.gap[gap], unsafe_className)}>{children}</div>;
}

// ─────────────────────── PageSection ───────────────────────

export interface PageSectionProps extends CommonProps {
  /** Two-digit index, e.g. "02". */
  section?: string;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageSection({
  section,
  title,
  description,
  actions,
  children,
  unsafe_className,
}: PageSectionProps) {
  const hasHeader = section || title || description || actions;
  return (
    <section className={cx("mt-12 first:mt-0", unsafe_className)}>
      {hasHeader ? (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            {section ? (
              <span
                data-page-section-eyebrow
                className={cx("inline-block font-mono text-mono-xs uppercase", textColor.accent)}
              >
                {section} <span aria-hidden>{"//"}</span>{" "}
                {typeof title === "string" ? title.toUpperCase() : null}
              </span>
            ) : null}
            {title && !section ? (
              <h2
                className={cx(
                  "font-display text-display-md font-semibold tracking-tight",
                  textColor.strong,
                )}
              >
                {title}
              </h2>
            ) : null}
            {title && section ? (
              <h2
                className={cx(
                  "mt-2 font-display text-display-md font-semibold tracking-tight",
                  textColor.strong,
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className={cx("mt-2 text-body-md", textColor.muted)}>{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

// ─────────────────────── PageActions ───────────────────────

export interface PageActionsProps extends CommonProps {
  align?: "start" | "end" | "between";
}

export function PageActions({ align = "end", children, unsafe_className }: PageActionsProps) {
  const alignClass =
    align === "between" ? "justify-between" : align === "end" ? "justify-end" : "justify-start";
  return (
    <div className={cx("mt-8 flex items-center gap-3", alignClass, unsafe_className)}>
      {children}
    </div>
  );
}

// ─────────────────────── PageEmptyState ───────────────────────

export interface PageEmptyStateProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: ReactNode;
}

export function PageEmptyState({ title, description, actions, icon }: PageEmptyStateProps) {
  return (
    <div className={cx("flex flex-col items-center text-center", space.py["20"])}>
      {icon ? <div className={cx("mb-4", textColor.subtle)}>{icon}</div> : null}
      <h3 className={cx("font-display text-display-md", textColor.strong)}>{title}</h3>
      {description ? (
        <p className={cx("mt-3 max-w-md text-body-md", textColor.muted)}>{description}</p>
      ) : null}
      {actions ? <div className="mt-6 flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
