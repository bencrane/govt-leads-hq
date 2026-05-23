# GovtLeads HQ — Design System

> The product-grade primitive surface for `@govt-leads-hq/ui`. This document
> is the single source of truth for how the design system is structured, what
> exists, when to add a new primitive vs. inline, how to author a story, and
> how the token-prop API works.

The aesthetic anchor is terminal / Bloomberg-terminal / CLI dev-tool —
true-black surfaces, forest-green emerald-700 accent, sharp edges, mono
labels. The methodology is borrowed-and-upgraded from the same operator's
`ae-hq` repo: every interactive primitive ships with **Radix UI** under the
hood for a11y, every visual prop is a **typed token**, every state has a
**Storybook story** that runs through axe-core in CI.

---

## The four layers

```
Layer 3 — Routes              (apps/*/src/routes/**)
Layer 2 — App shells          (apps/*/src/App.tsx, layouts)
Layer 1 — UI primitives       (packages/ui/src/**)         ← this doc
Layer 0 — Design tokens       (packages/tokens/src/**)
```

- **Layer 0 — tokens.** Single source of truth for spacing, type scale,
  color, motion, breakpoints, radii, z-index. Defined in
  `packages/tokens/src/tokens.ts`; emitted as CSS custom properties via
  `@govt-leads-hq/tokens/css`. Tokens are **semantic roles**
  (`surface.*`, `border.*`, `text.*`, `accent.*`, `state.*`),
  not a palette (`green-500`). The palette is LOCKED — changing a token
  is a multi-cycle change.
- **Layer 1 — primitives.** Every visual building block is a primitive in
  `@govt-leads-hq/ui`. Routes import from this package; routes do NOT own
  type scale, color, or geometry directly. There are six sub-layers
  (see "What exists" below).
- **Layer 2 — app shells.** The application-frame layout (sidebar,
  top-bar, nav). Currently both `apps/platform-app` and
  `apps/marketing-site` have minimal shells; growth lives in this layer.
- **Layer 3 — routes.** A route is the composition of primitives. A
  route's job is to describe content, not draw it. Routes should look
  ~30 lines for typical screens and ~80 lines for dense ones. If a
  route exceeds 200 LOC, one or more primitives are missing.

---

## What exists

`packages/ui` exports 51 named values across seven sub-layers:

| Sub-layer    | File           | Exports                                                                                                       |
|--------------|----------------|----------------------------------------------------------------------------------------------------------------|
| Layout       | `layout.tsx`   | `Stack`, `Inline`, `Grid`, `Box`, `Divider`, `Page`, `PageHeader`, `PageBody`, `PageSection`, `PageActions`, `PageEmptyState` |
| Visual       | `visual.tsx`   | `Text`, `Card`, `Badge`, `Button`                                                                              |
| Form         | `form.tsx`     | `Field`, `Label`, `Input`, `Textarea`, `Select`, `MultiSelect`, `Combobox`, `TagInput`, `NumberInput`, `DateRangePicker`, `Checkbox`, `FieldGroup`, `FormErrors` |
| Display      | `display.tsx`  | `Avatar`, `Stat`, `KVTable`, `DataTable`, `Pagination`, `Spinner`, `SectionLabel`, `ScrollArea`, `CompanyLogo` |
| Feedback     | `feedback.tsx` | `Drawer`, `Modal`, `Tooltip`, `Banner`, `Toast`, `useToastQueue`                                              |
| Motion       | `motion.tsx`   | `AppearOnMount`, `FadeIn`, `SlideIn`                                                                          |
| Interactive  | `interactive.tsx` | `Tabs`, `TabList`, `Tab`, `TabPanel`                                                                       |

Plus token-prop utilities (`cx`, type aliases for `SpacingProp`,
`TextColorProp`, etc.) exported from `utils.ts`.

The full Storybook story matrix (one or more stories per primitive per
state) lives in the matching `*.stories.tsx` next to each source file.
Run `bun run storybook` from the repo root to browse them.

---

## When to add a primitive vs. inline

Add a primitive when:

- A visual pattern shows up in **two or more places**.
- A pattern owns **interactive behavior** (focus, keyboard, ARIA) — even if
  used once, behavior centralization is non-negotiable.
- A route file would otherwise exceed ~150 LOC.
- The token-prop API would catch a class of bugs (typed surface, typed
  spacing).

Stay inline when:

- A composition is a one-off **layout** with no behavior (e.g., a
  marketing-site fold that won't be repeated).
- A primitive would have only one variant axis and one user. Wait for
  the second user.

Most "I'll just write a div for this" instincts are wrong on this codebase —
the moment a div carries spacing AND color AND a tooltip, it should be a
primitive composition. If unsure, write the route in primitives and refactor
to a new primitive when a SECOND consumer appears.

---

## The token-prop API

Every primitive's spacing/color/size prop is a **typed token name**.
Examples (legacy primitives):

```tsx
<Stack gap="6" />          // ✓ — gap-6 = 24px from spacing token
<Stack gap={42} />         // ✗ — compile error, gap is SpacingProp
<Text size="display-lg" /> // ✓ — text-display-lg from fontSize token
<Text color="muted" />     // ✓ — text-[var(--color-text-muted)]
<Box bg="raised" />        // ✓ — surface.raised
<Page variant="wide" />    // ✓ — max-w-* from pageWidth tokens
```

The mapping tables live in `packages/ui/src/utils.ts` — one table per
prop dimension (spacing, text color, surface, border, font size, page
width). The prop *type* is derived from the token source so it cannot
drift.

For the new primitives (Form/Display/Feedback/Motion/Interactive/Page
chrome): every prop that takes a visual value is the same way. Examples:

```tsx
<Banner tone="success" />       // tone is a typed union
<Avatar size="md" />            // size is the typed avatar scale
<DataTable maxBodyHeight="400px" /> // CSS length string is opt-in only when no scale fits
<SlideIn from="bottom" />       // typed union, four directions
```

When a prop legitimately accepts a raw CSS string (e.g., `Drawer width`,
`DataTable maxBodyHeight`), use it sparingly — only when no token scale
applies.

---

## Variant management

Two methodologies, ranked by complexity:

1. **Typed record-tables** — the default. A record keyed by a
   string-union variant type, value is the class string. See
   `visual.tsx§buttonVariants`, `display.tsx§deltaTone`,
   `feedback.tsx§bannerStyle`. Simple, no extra library, type-safe.
2. **CVA (`class-variance-authority`)** — opt-in when variants have
   ≥3 variants × ≥2 axes (e.g., a Button with variant×size×state).
   Today `packages/ui` does not have a primitive that warrants CVA; the
   library is installed for future use.

What's banned: **inline ternary cascades** for variant classes — i.e.
`tone === "success" ? "border-green …" : tone === "warn" ? "border-yellow …" : "..."`.
Variant management must be either a record-table or CVA — never an
ad-hoc chain.

---

## Radix UI discipline

Every primitive that owns interactive behavior wraps a matching Radix
primitive:

| Primitive          | Radix package                  |
|--------------------|--------------------------------|
| `Drawer`, `Modal`  | `@radix-ui/react-dialog`       |
| `Tooltip`          | `@radix-ui/react-tooltip`      |
| `Select`           | `@radix-ui/react-select`       |
| `MultiSelect`      | `@radix-ui/react-popover` + checkboxes |
| `Checkbox`         | `@radix-ui/react-checkbox`     |
| `Tabs`/`TabList`/`Tab`/`TabPanel` | `@radix-ui/react-tabs` |
| `Toast`            | `@radix-ui/react-toast`        |
| `ScrollArea`       | `@radix-ui/react-scroll-area`  |

Hand-rolled keyboard handlers, focus traps, ESC handlers, ARIA-state
machines are banned in this package. Radix already owns the contract; we
own the visual + token mapping.

The marketing-site `Section` helper and the existing `Drawer` in
`apps/platform-app/src/winners/Winners.tsx` predate this discipline; they
are exempted via the rule's escape hatch and slated for migration in
the next cycle.

---

## Sharp-edge house style

Default radius is **0** (`rounded-none`) on every interactive surface —
inputs, buttons, badges, table cells, modal panels, drawer panels. The
`rounded-xl` Card variant is the single exception (outer cards on
marketing surfaces).

Why: terminal aesthetic, deliberate. Rounded corners on a true-black
surface read as "consumer-cute"; the product is for power users browsing
federal-contract data, and the visual language signals that.

When in doubt: don't round.

---

## Storybook stories — how to author

Every primitive has at least one `*.stories.tsx` file next to its source.
Each story is a `StoryObj` with an explicit `name`. The story file
follows ae-hq's pattern (replicated here):

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Field, Input } from "./form";

const meta = { title: "Form" } satisfies Meta;
export default meta;

export const FieldDefault: StoryObj = {
  name: "Field — default",
  render: () => (
    <Field label="Agency" description="Pick the contracting agency">
      <Input placeholder="e.g. GSA" />
    </Field>
  ),
};
```

Rules:

- **One story per state.** Default, with-value, invalid, disabled, error,
  empty — whatever the primitive supports.
- **Use `args` + `argTypes` for stateless primitives.** Use inline closure
  `render` when state is essential to the demo (e.g., MultiSelect needs
  a value state to actually be controllable).
- **Story names are human-readable.** `name: 'Drawer — right'`, not
  `name: 'drawer-right'`.
- **For portaled overlays** (Drawer, Modal, Tooltip, Select), wrap the
  story in a local container `<div ref={containerRef}>` and pass
  `portalContainer={containerRef.current}` so the portal renders INSIDE
  the Storybook iframe.
- **For locked-palette decorative contrast violations**, set
  `parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }`
  on the offending story and document the exemption rationale in an ADR.

---

## How to migrate a route to primitives

Symptom: a route file is ≥150 LOC, owns its own `mx-auto`/`max-w-*`,
imports nothing from `@govt-leads-hq/ui`, has inline-styled `<div>`s.

Procedure:

1. **Wrap with `<Page>`.** This becomes the new top-level JSX. Pass
   `variant="default"` (most common).
2. **Replace section scaffolding with `<PageHeader>` / `<PageSection>`
   / `<PageBody>`.** The eyebrow, title, description, actions slot
   are typed props.
3. **Replace each form control with the matching Form primitive.**
4. **Replace data presentations with `<DataTable>` + `<Stat>` +
   `<KVTable>` + `<Pagination>`.**
5. **Replace overlays with `<Drawer>` / `<Modal>` / `<Tooltip>`.**
6. **Run `bun x eslint apps/*/src/routes/**/*.tsx`** — the
   `no-route-geometry` rule should pass with no escape-hatch comments.
7. **Verify Storybook stories cover any new primitive variant** you
   discovered while migrating; add them.

Done correctly, the route ends up ~30–80 LOC and reads as a content
specification.

---

## ESLint enforcement

Two rules currently enforce design-system discipline:

- **`govt-leads-hq/no-route-geometry`** — bans `mx-auto`, `max-w-*`,
  `px-N`, `py-N`, `gap-N` on top-level JSX in any
  `apps/*/src/routes/**/*.tsx`. The escape hatch is
  `unsafe_className` on a primitive OR an explicit
  `// eslint-disable-next-line` comment.
- The future cycle will add `no-magic-color` and `no-magic-spacing`
  rules; for now, a grep over `packages/ui/src/*.tsx` for inline
  hex / rgb literals must come back empty. Legacy primitives
  (`visual.tsx`) are grandfathered.

The plugin source lives at
`packages/eslint-plugin-govt-leads-hq/src/no-route-geometry.ts` with
seven unit tests. Wired into the root `eslint.config.mjs`.

---

## axe-core a11y CI gate

`bun run --filter @govt-leads-hq/ui test:a11y` boots the built
Storybook (`storybook-static/`) on `http-server` and runs
`@storybook/test-runner` with `axe-playwright`. Every story is visited;
axe checks WCAG 2.0 A + AA conformance.

Per-story exemptions are allowed when a violation is downstream of a
locked-palette decision (e.g., decorative mono labels failing
`color-contrast`). Each exemption MUST have an ADR entry in
`docs/design-decisions.md`.

---

## Bundle policy

`@govt-leads-hq/ui` is source-exported today — there is no compiled
`dist/`. Consumers (Vite, Storybook, Bun) handle the source compilation
on the fly. This keeps the iteration loop tight: edit a primitive, see
the change in the consumer immediately, no extra build step.

When/why we'd switch to a real bundle: another workspace OUTSIDE the
monorepo needs to consume this package. That cycle adds Vite library
mode or `tsup`, enforces a bundle-size budget (200KB gzipped), and
gates accidental imports from `radix-ui` barrel exports. ADR-08 in
`design-decisions.md` records the decision to defer.

---

## Adding a new primitive — checklist

1. Decide the sub-layer file (`form.tsx`, `display.tsx`, etc.).
2. Write the implementation with:
   - Typed token props for every spacing/color/size value.
   - Radix root if any interactive behavior is involved.
   - Typed record-table OR CVA for variants.
   - Sharp edges (`rounded-none`) by default.
   - `unsafe_className` escape hatch ONLY if the primitive is layout-grade.
3. Add it to `packages/ui/src/index.ts`'s re-export list.
4. Write `*.stories.tsx` entries: default + each interactive state.
5. Run `bun run --filter @govt-leads-hq/ui typecheck`.
6. Run `bun run --filter @govt-leads-hq/ui storybook:build`.
7. Run `bun run --filter @govt-leads-hq/ui test:a11y`.
8. Verify no inline hex / no inline rgb / no inline px on the new file
   via grep.

If all four checks pass, the primitive is done.

---

## Open work

- **Magic-color/magic-spacing ESLint rules.** Next-cycle.
- **Real bundle + size budget.** Deferred until an out-of-monorepo
  consumer arrives.
- **DateRangePicker calendar popover.** MVP today is two `<input
  type="date">` fields with a guard that end ≥ start. Calendar popover
  is the next iteration.
- **MultiSelect with cmdk-style command palette.** MVP today is a
  Popover + checkbox list. Power-user filter UX is the next iteration.
- **`/winners` migration.** The 800-LOC inline-styled `<div>` route is
  scheduled for migration to primitives in the next cycle.
