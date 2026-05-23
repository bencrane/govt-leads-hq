/**
 * Form primitives — Field, Label, Input, Textarea, Select, MultiSelect,
 * Combobox, TagInput, NumberInput, DateRangePicker, Checkbox, FieldGroup,
 * FormErrors.
 *
 * Methodology upgrade vs the rest of the package: Radix UI under the hood
 * wherever a Radix primitive exists. Hand-rolled keyboard/focus/aria is
 * banned in this file — every interactive surface ships with a Radix root
 * that already owns the a11y contract.
 *
 * Variant management: typed record-tables (consistent with the legacy
 * Stack/Button surface). CVA reserved for primitives with ≥3 variants × ≥2
 * axes; nothing here exceeds that bar today.
 *
 * Sharp-edge house style: `rounded-none` on every control. Focus ring is
 * `accent.primary` (`#047857`). Placeholder text uses `text.subtle`.
 */

import * as Checkbox$ from "@radix-ui/react-checkbox";
import * as Popover$ from "@radix-ui/react-popover";
import * as Select$ from "@radix-ui/react-select";
import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type TextareaHTMLAttributes,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useMemo,
  useState,
} from "react";
import { cx, textColor } from "./utils";

// ── shared control surface ──

const CONTROL_SURFACE = "rounded-none border bg-[color:var(--color-surface-base)]";
const CONTROL_PAD = "px-3 py-2";
const CONTROL_SIZE = "text-body-sm";
const CONTROL_BORDER_DEFAULT = "border-[color:var(--color-border-default)]";
const CONTROL_BORDER_INVALID = "border-[color:var(--color-state-error)]";
const CONTROL_FOCUS =
  "focus:border-[color:var(--color-accent-primary)] focus:outline-none focus-visible:outline-none";
const CONTROL_PLACEHOLDER = "placeholder:text-[color:var(--color-text-subtle)]";
const CONTROL_DISABLED = "disabled:cursor-not-allowed disabled:opacity-50";

// ─────────────────────── Field ───────────────────────

export interface FieldProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  /** Explicit control id. If omitted, Field generates one and wires it
   *  to the single child control automatically so the label is always
   *  associated. */
  htmlFor?: string;
}

export function Field({ label, description, error, required, children, htmlFor }: FieldProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const descId = useId();
  const errorId = useId();

  let control = children;
  if (!htmlFor && isValidElement(children)) {
    const childProps = children.props as { id?: string; "aria-describedby"?: string };
    if (!childProps.id) {
      const described = [
        description ? descId : null,
        error ? errorId : null,
        childProps["aria-describedby"] ?? null,
      ]
        .filter(Boolean)
        .join(" ");
      control = cloneElement(
        children as ReactElement<{ id?: string; "aria-describedby"?: string }>,
        {
          id: controlId,
          "aria-describedby": described || undefined,
        },
      );
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <Label htmlFor={controlId} required={required}>
          {label}
        </Label>
      ) : null}
      {description ? (
        <p id={descId} className={cx("text-body-xs", textColor.muted)}>
          {description}
        </p>
      ) : null}
      {control}
      {error ? (
        <p
          id={errorId}
          className={cx(
            "font-mono text-mono-xs uppercase",
            "text-[color:var(--color-state-error)]",
          )}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

// ─────────────────────── Label ───────────────────────

export interface LabelProps {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}

export function Label({ htmlFor, required, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={cx("font-mono text-mono-xs uppercase", textColor.muted)}>
      {children}
      {required ? (
        <span aria-hidden className={cx("ml-1", textColor.accent)}>
          *
        </span>
      ) : null}
    </label>
  );
}

// ─────────────────────── Input ───────────────────────

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  invalid?: boolean;
  /** Optional left-slot content (icon, $ prefix). Pure visual sugar. */
  prefix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, prefix, className, ...rest },
  ref,
) {
  const inputClasses = cx(
    CONTROL_SURFACE,
    CONTROL_PAD,
    CONTROL_SIZE,
    textColor.strong,
    invalid ? CONTROL_BORDER_INVALID : CONTROL_BORDER_DEFAULT,
    CONTROL_FOCUS,
    CONTROL_PLACEHOLDER,
    CONTROL_DISABLED,
    "w-full",
    className,
  );
  if (prefix) {
    return (
      <div
        className={cx(
          "flex items-stretch",
          CONTROL_SURFACE,
          invalid ? CONTROL_BORDER_INVALID : CONTROL_BORDER_DEFAULT,
          "focus-within:border-[color:var(--color-accent-primary)]",
        )}
      >
        <span
          aria-hidden
          className={cx("flex items-center px-3 font-mono text-mono-xs uppercase", textColor.muted)}
        >
          {prefix}
        </span>
        <input
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cx(
            "flex-1 bg-transparent px-2 py-2",
            CONTROL_SIZE,
            textColor.strong,
            "border-0 outline-none focus:outline-none",
            CONTROL_PLACEHOLDER,
            CONTROL_DISABLED,
          )}
          {...rest}
        />
      </div>
    );
  }
  return <input ref={ref} aria-invalid={invalid || undefined} className={inputClasses} {...rest} />;
});

// ─────────────────────── Textarea ───────────────────────

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cx(
        CONTROL_SURFACE,
        CONTROL_PAD,
        CONTROL_SIZE,
        textColor.strong,
        invalid ? CONTROL_BORDER_INVALID : CONTROL_BORDER_DEFAULT,
        CONTROL_FOCUS,
        CONTROL_PLACEHOLDER,
        CONTROL_DISABLED,
        "w-full resize-y",
        className,
      )}
      {...rest}
    />
  );
});

// ─────────────────────── NumberInput ───────────────────────

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "prefix"> {
  invalid?: boolean;
  prefix?: ReactNode;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { invalid, prefix, className, ...rest },
  ref,
) {
  return (
    <Input
      ref={ref}
      type="number"
      inputMode="numeric"
      invalid={invalid}
      prefix={prefix}
      className={cx("tabular-nums", className)}
      {...rest}
    />
  );
});

// ─────────────────────── Checkbox (Radix) ───────────────────────

export interface CheckboxProps {
  id?: string;
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean | "indeterminate") => void;
  disabled?: boolean;
  invalid?: boolean;
  label?: ReactNode;
  "aria-label"?: string;
  "aria-describedby"?: string;
  name?: string;
  value?: string;
}

export function Checkbox({
  id,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  invalid,
  label,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  name,
  value,
}: CheckboxProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const box = (
    <Checkbox$.Root
      id={controlId}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      name={name}
      value={value}
      aria-label={!label ? ariaLabel : undefined}
      aria-describedby={ariaDescribedBy}
      aria-invalid={invalid || undefined}
      className={cx(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-none border",
        invalid
          ? "border-[color:var(--color-state-error)]"
          : "border-[color:var(--color-border-default)]",
        "bg-[color:var(--color-surface-base)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent-primary)]",
        "data-[state=checked]:border-[color:var(--color-accent-primary)]",
        "data-[state=checked]:bg-[color:var(--color-accent-primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <Checkbox$.Indicator
        className={cx(
          "flex items-center justify-center",
          "text-[color:var(--color-text-onAccent)]",
        )}
      >
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative checkmark inside aria-hidden indicator */}
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        >
          <path d="M3 8l3.5 3.5L13 5" />
        </svg>
      </Checkbox$.Indicator>
    </Checkbox$.Root>
  );
  if (!label) return box;
  return (
    <span className="inline-flex items-center gap-2">
      {box}
      <label htmlFor={controlId} className={cx("text-body-sm", textColor.default)}>
        {label}
      </label>
    </span>
  );
}

// ─────────────────────── Select (Radix) ───────────────────────

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  /** Override the portal container — useful for Storybook iframes. */
  portalContainer?: HTMLElement | null;
}

export function Select({
  id,
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select…",
  disabled,
  invalid,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  portalContainer,
}: SelectProps) {
  return (
    <Select$.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select$.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
        className={cx(
          "inline-flex w-full items-center justify-between gap-2",
          CONTROL_SURFACE,
          CONTROL_PAD,
          CONTROL_SIZE,
          textColor.strong,
          invalid ? CONTROL_BORDER_INVALID : CONTROL_BORDER_DEFAULT,
          "data-[state=open]:border-[color:var(--color-accent-primary)]",
          CONTROL_FOCUS,
          CONTROL_DISABLED,
        )}
      >
        <Select$.Value placeholder={placeholder} />
        <Select$.Icon aria-hidden className={textColor.muted}>
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative chevron inside aria-hidden Select.Icon */}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </Select$.Icon>
      </Select$.Trigger>
      <Select$.Portal container={portalContainer}>
        <Select$.Content
          position="popper"
          sideOffset={4}
          className={cx(
            "z-50 min-w-[var(--radix-select-trigger-width)] rounded-none border",
            "bg-[color:var(--color-surface-raised)]",
            "border-[color:var(--color-border-default)]",
            "shadow-lg",
          )}
        >
          <Select$.Viewport className="p-1">
            {options.map((o) => (
              <Select$.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className={cx(
                  "relative flex cursor-pointer items-center px-3 py-2 text-body-sm",
                  textColor.default,
                  "outline-none",
                  "data-[highlighted]:bg-[color:var(--color-accent-soft)]",
                  "data-[highlighted]:text-[color:var(--color-text-accent)]",
                  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                )}
              >
                <Select$.ItemText>{o.label}</Select$.ItemText>
              </Select$.Item>
            ))}
          </Select$.Viewport>
        </Select$.Content>
      </Select$.Portal>
    </Select$.Root>
  );
}

// ─────────────────────── MultiSelect (Radix Popover + checkboxes) ───────────────────────

export interface MultiSelectOption {
  value: string;
  label: ReactNode;
}

export interface MultiSelectProps {
  id?: string;
  value: ReadonlyArray<string>;
  onChange: (next: string[]) => void;
  options: ReadonlyArray<MultiSelectOption>;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  searchable?: boolean;
  "aria-label"?: string;
  portalContainer?: HTMLElement | null;
}

export function MultiSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled,
  invalid,
  searchable = true,
  "aria-label": ariaLabel,
  portalContainer,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) =>
      typeof o.label === "string"
        ? o.label.toLowerCase().includes(q)
        : o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }
  const summary =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? "1 selected"
        : `${value.length} selected`;

  return (
    <Popover$.Root open={open} onOpenChange={setOpen}>
      <Popover$.Trigger
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cx(
          "inline-flex w-full items-center justify-between gap-2",
          CONTROL_SURFACE,
          CONTROL_PAD,
          CONTROL_SIZE,
          textColor.strong,
          invalid ? CONTROL_BORDER_INVALID : CONTROL_BORDER_DEFAULT,
          "data-[state=open]:border-[color:var(--color-accent-primary)]",
          CONTROL_FOCUS,
          CONTROL_DISABLED,
        )}
      >
        <span className={cx(value.length === 0 ? textColor.subtle : textColor.strong)}>
          {summary}
        </span>
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative chevron, aria-hidden */}
        <svg
          aria-hidden
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={textColor.muted}
        >
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Popover$.Trigger>
      <Popover$.Portal container={portalContainer}>
        <Popover$.Content
          align="start"
          sideOffset={4}
          className={cx(
            "z-50 w-[var(--radix-popover-trigger-width)] rounded-none border",
            "bg-[color:var(--color-surface-raised)]",
            "border-[color:var(--color-border-default)]",
            "shadow-lg",
          )}
        >
          {searchable ? (
            <div className={cx("border-b p-2", "border-[color:var(--color-border-subtle)]")}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter…"
                aria-label="Filter options"
                className={cx(
                  "w-full bg-transparent px-2 py-1 text-body-sm outline-none",
                  textColor.strong,
                  CONTROL_PLACEHOLDER,
                )}
              />
            </div>
          ) : null}
          {/* biome-ignore lint/a11y/useFocusableInteractive: focus lives on each option button, not the listbox container */}
          {/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: ARIA listbox role REQUIRED for screen-reader pattern; no native HTML equivalent for a multi-select popover */}
          {/* biome-ignore lint/a11y/useSemanticElements: native <select multiple> does not support custom popover content (checkbox rows + filter) */}
          <ul role="listbox" aria-multiselectable className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className={cx("px-3 py-2 font-mono text-mono-xs uppercase", textColor.subtle)}>
                No matches
              </li>
            ) : null}
            {filtered.map((o) => {
              const checked = value.includes(o.value);
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    // biome-ignore lint/a11y/useSemanticElements: ARIA option role required for inside-listbox semantics
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggle(o.value)}
                    className={cx(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm",
                      textColor.default,
                      "hover:bg-[color:var(--color-accent-soft)]",
                      "hover:text-[color:var(--color-text-accent)]",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cx(
                        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-none border",
                        checked
                          ? "border-[color:var(--color-accent-primary)] bg-[color:var(--color-accent-primary)]"
                          : "border-[color:var(--color-border-default)] bg-[color:var(--color-surface-base)]",
                      )}
                    >
                      {checked ? (
                        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative checkmark inside aria-hidden checkbox visual
                        <svg
                          viewBox="0 0 16 16"
                          width="10"
                          height="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            d="M3 8l3.5 3.5L13 5"
                            className="text-[color:var(--color-text-onAccent)]"
                          />
                        </svg>
                      ) : null}
                    </span>
                    <span>{o.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Popover$.Content>
      </Popover$.Portal>
    </Popover$.Root>
  );
}

// ─────────────────────── Combobox ───────────────────────
// Native combobox via <input list> + <datalist>. The browser provides the
// combobox role + expansion semantics — we deliberately do NOT add a custom
// aria-expanded state machine.

export interface ComboboxProps {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}

export function Combobox({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
  disabled,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const listId = useId();
  return (
    <div>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        invalid={invalid}
        disabled={disabled}
        list={listId}
        aria-label={ariaLabel}
      />
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </datalist>
    </div>
  );
}

// ─────────────────────── TagInput ───────────────────────

export interface TagInputProps {
  id?: string;
  value: ReadonlyArray<string>;
  onChange: (next: string[]) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}

export function TagInput({
  id,
  value,
  onChange,
  placeholder,
  invalid,
  disabled,
  "aria-label": ariaLabel,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commit(token: string) {
    const trimmed = token.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      className={cx(
        "flex flex-wrap items-center gap-2",
        CONTROL_SURFACE,
        "px-2 py-1.5",
        invalid ? CONTROL_BORDER_INVALID : CONTROL_BORDER_DEFAULT,
        "focus-within:border-[color:var(--color-accent-primary)]",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {value.map((t) => (
        <span
          key={t}
          className={cx(
            "inline-flex items-center gap-1 rounded-none border px-2 py-0.5",
            "font-mono text-mono-xs uppercase",
            "border-[color:var(--color-border-default)]",
            textColor.default,
          )}
        >
          {t}
          <button
            type="button"
            onClick={() => onChange(value.filter((v) => v !== t))}
            aria-label={`Remove ${t}`}
            disabled={disabled}
            className={cx("ml-1 text-mono-xs leading-none", textColor.muted)}
          >
            ×
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => commit(draft)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cx(
          "flex-1 bg-transparent px-1 py-1 text-body-sm outline-none",
          CONTROL_PLACEHOLDER,
          textColor.strong,
        )}
      />
    </div>
  );
}

// ─────────────────────── DateRangePicker ───────────────────────
// MVP: two `<input type="date">` controls with a guard that end >= start.
// A calendar popover is a Cycle-N+1 enhancement; this surface is shipped
// today as a TYPED two-field range so callers can compose it without
// reinventing.

export interface DateRange {
  start: string;
  end: string;
}

export interface DateRangePickerProps {
  id?: string;
  value: DateRange;
  onChange: (next: DateRange) => void;
  /** Optional minimum start date (ISO yyyy-mm-dd). */
  min?: string;
  /** Optional maximum end date (ISO yyyy-mm-dd). */
  max?: string;
  invalid?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}

export function DateRangePicker({
  id,
  value,
  onChange,
  min,
  max,
  invalid,
  disabled,
  "aria-label": ariaLabel,
}: DateRangePickerProps) {
  const startId = useId();
  const endId = useId();
  function setStart(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    // Clamp end >= start.
    const nextEnd = value.end && value.end < next ? next : value.end;
    onChange({ start: next, end: nextEnd });
  }
  function setEnd(e: ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, end: e.target.value });
  }
  return (
    // biome-ignore lint/a11y/useSemanticElements: a <fieldset> here would force its own legend semantics; ARIA group + label is the correct pattern for an inline two-input date range
    <div role="group" aria-label={ariaLabel ?? "Date range"} className="flex items-center gap-2">
      <Input
        id={id ?? startId}
        type="date"
        value={value.start}
        onChange={setStart}
        min={min}
        max={max}
        invalid={invalid}
        disabled={disabled}
        aria-label="Start date"
      />
      <span aria-hidden className={cx("font-mono text-mono-xs", textColor.muted)}>
        —
      </span>
      <Input
        id={endId}
        type="date"
        value={value.end}
        onChange={setEnd}
        min={value.start || min}
        max={max}
        invalid={invalid}
        disabled={disabled}
        aria-label="End date"
      />
    </div>
  );
}

// ─────────────────────── FieldGroup ───────────────────────

export interface FieldGroupProps {
  title?: ReactNode;
  description?: ReactNode;
  direction?: "vertical" | "horizontal";
  children: ReactNode;
}

export function FieldGroup({
  title,
  description,
  direction = "vertical",
  children,
}: FieldGroupProps) {
  return (
    <fieldset
      className={cx(
        "flex border-0 p-0",
        direction === "horizontal" ? "flex-wrap items-end gap-4" : "flex-col gap-4",
      )}
    >
      {title ? (
        <legend className={cx("mb-2 font-mono text-mono-xs uppercase", textColor.accent)}>
          {title}
        </legend>
      ) : null}
      {description ? (
        <p className={cx("-mt-3 mb-2 text-body-sm", textColor.muted)}>{description}</p>
      ) : null}
      {children}
    </fieldset>
  );
}

// ─────────────────────── FormErrors ───────────────────────

export interface FormErrorEntry {
  field?: string;
  message: string;
}

export interface FormErrorsProps {
  errors: ReadonlyArray<FormErrorEntry>;
}

export function FormErrors({ errors }: FormErrorsProps) {
  const list = useMemo(() => errors.filter((e) => e.message), [errors]);
  if (list.length === 0) return null;
  return (
    <div
      role="alert"
      className={cx(
        "rounded-none border px-4 py-3",
        "border-[color:var(--color-state-error)]",
        "bg-[color:var(--color-state-errorSoft)]",
      )}
    >
      <div
        className={cx(
          "mb-2 font-mono text-mono-xs uppercase",
          "text-[color:var(--color-state-error)]",
        )}
      >
        ERR {"//"} {list.length} issue{list.length > 1 ? "s" : ""}
      </div>
      <ul className="flex flex-col gap-1">
        {list.map((e, i) => (
          <li key={`${e.field ?? "form"}-${i}`} className={cx("text-body-sm", textColor.default)}>
            {e.field ? <span className={textColor.muted}>{e.field}: </span> : null}
            {e.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
