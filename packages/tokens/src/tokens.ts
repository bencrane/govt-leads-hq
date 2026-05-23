/**
 * Design tokens — single source of truth for GovtLeads HQ.
 *
 * Edit this file to change any spacing, color, type, motion, breakpoint, radius,
 * or z-index value used across the platform. The `build.ts` script consumes this
 * module and emits three artifacts:
 *
 *   dist/css/tokens.css     — CSS custom properties + Tailwind v4 @theme block
 *   dist/tailwind/preset.ts — Tailwind v4 preset (re-exports the CSS file)
 *   dist/ts/index.ts        — Typed const exports (this module, compiled)
 *
 * House style: terminal-dark, sharp-edged (radius 0 except outer cards), mono
 * labels. Aesthetic anchor: CLI / dev-tool — true black surface, bright green
 * as the primary accent (`accent.primary`), with red and yellow as live state
 * colors. Retune values here and all three artifacts follow.
 *
 * Tokens are semantic ROLES, not a raw palette: `surface.*`, `border.*`,
 * `text.*`, `accent.*`, `state.*` — never `green-500`.
 */

// ───────────────────────────── spacing ─────────────────────────────

export const spacing = {
  "0": "0",
  "1": "0.25rem", // 4px
  "2": "0.5rem", // 8px
  "3": "0.75rem", // 12px
  "4": "1rem", // 16px
  "5": "1.25rem", // 20px
  "6": "1.5rem", // 24px
  "8": "2rem", // 32px
  "10": "2.5rem", // 40px
  "12": "3rem", // 48px
  "16": "4rem", // 64px
  "20": "5rem", // 80px
  "24": "6rem", // 96px
} as const;

export type SpacingToken = keyof typeof spacing;

// ───────────────────────────── type scale ─────────────────────────────

export const fontSize = {
  "body-xs": ["0.75rem", { lineHeight: "1rem" }], // 12/16
  "body-sm": ["0.875rem", { lineHeight: "1.25rem" }], // 14/20
  "body-md": ["1rem", { lineHeight: "1.5rem" }], // 16/24
  "body-lg": ["1.125rem", { lineHeight: "1.75rem" }], // 18/28
  "display-xs": ["1.25rem", { lineHeight: "1.5rem", letterSpacing: "-0.01em" }], // 20
  "display-sm": ["1.5rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }], // 24
  "display-md": ["2rem", { lineHeight: "2.25rem", letterSpacing: "-0.015em" }], // 32
  "display-lg": ["2.5rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }], // 40
  "display-xl": ["3rem", { lineHeight: "3.25rem", letterSpacing: "-0.02em" }], // 48
  "display-2xl": ["4.5rem", { lineHeight: "4.75rem", letterSpacing: "-0.025em" }], // 72
  // Mono — eyebrow / label face. 12px floor for a11y.
  "mono-xs": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.18em" }], // 12 — eyebrow size
  "mono-sm": ["0.8125rem", { lineHeight: "1.125rem", letterSpacing: "0.1em" }], // 13
  "mono-md": ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.05em" }], // 14
} as const;

export type FontSizeToken = keyof typeof fontSize;

// ───────────────────────────── color (semantic roles) ─────────────────────────────

/**
 * Color tokens — semantic roles. Concrete hex values target WCAG AA contrast on
 * the `surface.base` (#000000) background.
 *
 * Naming: `surface.*` (bg), `border.*`, `text.*`, `accent.*`, `state.*`.
 *
 * Aesthetic anchor: terminal / CLI / dev-tool dark mode. True black surface,
 * deep industrial / forest emerald as the single primary accent (deliberately
 * not lime — cyan-leaning, deep, oxidized-brass feel), with red + yellow +
 * green as live state colors. `accent.primary` (#047857, emerald-700) carries
 * `text.onAccent` (#fafafa) at ~5.6:1 (AA).
 */
export const color = {
  // Surfaces — true black with near-black raised tiers.
  surface: {
    base: "#000000",
    raised: "#0a0a0a",
    sunken: "#000000",
    overlay: "rgba(0, 0, 0, 0.85)",
    "raised-translucent": "rgba(10, 10, 10, 0.55)",
  },
  border: {
    subtle: "#171717", // neutral-900
    default: "#262626", // neutral-800
    strong: "#404040", // neutral-700
    accent: "rgba(4, 120, 87, 0.5)", // accent.primary @ 50%
  },
  text: {
    // Contrast on surface.base (#000000):
    //   primary  (#fafafa) → 20.4:1  AAA
    //   strong   (#f4f4f5) → 19.5:1  AAA
    //   default  (#e4e4e7) → 16.8:1  AAA
    //   muted    (#a1a1aa) →  8.2:1  AAA
    //   subtle   (#737378) →  4.7:1  AA   (body-text floor)
    //   accent   (#5db89a) →  9.2:1  AAA  (industrial mint — deeper, less lime)
    //   onAccent (#fafafa on accent.primary #047857) → 5.6:1  AA
    primary: "#fafafa", // zinc-50
    strong: "#f4f4f5", // zinc-100
    default: "#e4e4e7", // zinc-200
    muted: "#a1a1aa", // zinc-400
    subtle: "#737378", // body-text contrast floor
    accent: "#5db89a", // industrial mint — desaturated, cyan-leaning, less spring
    onAccent: "#fafafa", // light text on deep emerald accent
  },
  accent: {
    primary: "#047857", // emerald-700 — deep industrial forest green
    primaryHover: "#059669", // emerald-600 — brighter on hover
    primaryActive: "#065f46", // emerald-800 — pressed, deepest
    soft: "rgba(4, 120, 87, 0.18)",
    softer: "rgba(4, 120, 87, 0.08)",
  },
  state: {
    info: "#60a5fa", // blue-400 — 7.95:1
    success: "#10b981", // emerald-500 — bright enough to read "live" on black
    warn: "#facc15", // yellow-400 — 15.4:1
    error: "#f87171", // red-400 — 7.32:1
    successSoft: "rgba(16, 185, 129, 0.14)",
    warnSoft: "rgba(250, 204, 21, 0.12)",
    errorSoft: "rgba(248, 113, 113, 0.12)",
  },
} as const;

export type ColorPathLeaf =
  | `surface.${keyof typeof color.surface}`
  | `border.${keyof typeof color.border}`
  | `text.${keyof typeof color.text}`
  | `accent.${keyof typeof color.accent}`
  | `state.${keyof typeof color.state}`;

// ───────────────────────────── radius ─────────────────────────────

export const radius = {
  none: "0",
  sm: "0",
  md: "0",
  lg: "0",
  xl: "0.75rem", // only outer cards — sharp-edge house style
} as const;

export type RadiusToken = keyof typeof radius;

// ───────────────────────────── motion ─────────────────────────────

export const motion = {
  duration: {
    fast: "120ms",
    base: "200ms",
    slow: "320ms",
  },
  easing: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  },
} as const;

// ───────────────────────────── breakpoints ─────────────────────────────

export const breakpoint = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type BreakpointToken = keyof typeof breakpoint;

// ───────────────────────────── z-index ─────────────────────────────

export const z = {
  base: 0,
  raised: 10,
  sticky: 20,
  nav: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
} as const;

export type ZToken = keyof typeof z;

// ───────────────────────────── page width ─────────────────────────────

export const pageWidth = {
  narrow: "48rem", // 768px — read-heavy forms
  default: "72rem", // 1152px — most routes
  wide: "84rem", // 1344px — dense grids
} as const;

export type PageWidthToken = keyof typeof pageWidth;

// ───────────────────────────── aggregate ─────────────────────────────

/** Aggregate token tree for tooling. */
export const tokens = {
  spacing,
  fontSize,
  color,
  radius,
  motion,
  breakpoint,
  z,
  pageWidth,
} as const;

export type Tokens = typeof tokens;
