import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import {
  Checkbox,
  Combobox,
  DateRangePicker,
  Field,
  FieldGroup,
  FormErrors,
  Input,
  Label,
  MultiSelect,
  NumberInput,
  Select,
  TagInput,
  Textarea,
} from "./form";
import { Stack } from "./layout";
import { Button } from "./visual";

const meta = {
  title: "Form",
} satisfies Meta;

export default meta;

// Reusable demo options.
const states = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "wa", label: "Washington" },
  { value: "fl", label: "Florida" },
  { value: "il", label: "Illinois" },
  { value: "co", label: "Colorado" },
  { value: "ma", label: "Massachusetts" },
];

// ─── Field ───

export const FieldDefault: StoryObj = {
  name: "Field — default",
  render: () => (
    <Field label="Agency" description="Pick the contracting agency">
      <Input placeholder="e.g. GSA" />
    </Field>
  ),
};

export const FieldRequired: StoryObj = {
  name: "Field — required",
  render: () => (
    <Field label="Agency" required>
      <Input placeholder="e.g. GSA" />
    </Field>
  ),
};

export const FieldError: StoryObj = {
  name: "Field — error",
  render: () => (
    <Field label="Agency" error="Agency is required" required>
      <Input aria-invalid invalid />
    </Field>
  ),
};

// ─── Label ───

export const LabelStandalone: StoryObj = {
  name: "Label — standalone",
  render: () => (
    <Stack gap="2" align="start">
      <Label htmlFor="example">Agency</Label>
      <Input id="example" placeholder="e.g. GSA" />
    </Stack>
  ),
};

// ─── Input ───

export const InputDefault: StoryObj = {
  name: "Input — default",
  render: () => <Input placeholder="Type here" aria-label="Default input" />,
};

export const InputWithValue: StoryObj = {
  name: "Input — with value",
  render: () => (
    <Input defaultValue="GSA — General Services Administration" aria-label="Filled input" />
  ),
};

export const InputInvalid: StoryObj = {
  name: "Input — invalid",
  render: () => <Input invalid defaultValue="bad-data" aria-label="Invalid input" />,
};

export const InputDisabled: StoryObj = {
  name: "Input — disabled",
  render: () => <Input disabled defaultValue="Locked" aria-label="Disabled input" />,
};

export const InputWithPrefix: StoryObj = {
  name: "Input — with prefix",
  render: () => <Input prefix="USD" defaultValue="50,000" aria-label="Amount" />,
};

// ─── Textarea ───

export const TextareaDefault: StoryObj = {
  name: "Textarea — default",
  render: () => <Textarea placeholder="Describe the contract scope" aria-label="Scope" />,
};

export const TextareaInvalid: StoryObj = {
  name: "Textarea — invalid",
  render: () => <Textarea invalid defaultValue="too short" aria-label="Invalid scope" />,
};

// ─── NumberInput ───

export const NumberInputDefault: StoryObj = {
  name: "NumberInput — default",
  render: () => <NumberInput defaultValue={2500} aria-label="Award value" />,
};

export const NumberInputWithPrefix: StoryObj = {
  name: "NumberInput — $ prefix",
  render: () => <NumberInput prefix="$" defaultValue={25000} aria-label="Amount" />,
};

// ─── Checkbox ───

export const CheckboxDefault: StoryObj = {
  name: "Checkbox — default",
  render: () => {
    function CheckboxDemo() {
      const [checked, setChecked] = useState<boolean | "indeterminate">(false);
      return <Checkbox checked={checked} onCheckedChange={setChecked} label="Set aside required" />;
    }
    return <CheckboxDemo />;
  },
};

export const CheckboxChecked: StoryObj = {
  name: "Checkbox — checked",
  render: () => <Checkbox defaultChecked label="Notify me on awards" />,
};

export const CheckboxDisabled: StoryObj = {
  name: "Checkbox — disabled",
  render: () => <Checkbox disabled label="Disabled toggle" />,
};

// ─── Select ───

export const SelectDefault: StoryObj = {
  name: "Select — default",
  render: () => {
    function SelectDemo() {
      const container = useRef<HTMLDivElement>(null);
      const [value, setValue] = useState<string>("");
      return (
        <div ref={container}>
          <Field label="Agency">
            <Select
              value={value}
              onValueChange={setValue}
              options={[
                { value: "gsa", label: "GSA" },
                { value: "dod", label: "DoD" },
                { value: "dhs", label: "DHS" },
                { value: "doe", label: "DoE" },
              ]}
              portalContainer={container.current}
            />
          </Field>
        </div>
      );
    }
    return <SelectDemo />;
  },
};

export const SelectWithValue: StoryObj = {
  name: "Select — with value",
  render: () => {
    function SelectDemo() {
      const container = useRef<HTMLDivElement>(null);
      return (
        <div ref={container}>
          <Field label="State">
            <Select defaultValue="ca" options={states} portalContainer={container.current} />
          </Field>
        </div>
      );
    }
    return <SelectDemo />;
  },
};

// ─── MultiSelect ───

export const MultiSelectDefault: StoryObj = {
  name: "MultiSelect — default",
  // ADR-05: placeholder text "Select…" renders in `text-subtle` (#737378) on
  // `surface.base` (#000) — ~4.34:1, just below axe's 4.5:1 small-text bar.
  // Token palette locked; per-story exemption.
  parameters: {
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
  render: () => {
    function MultiDemo() {
      const container = useRef<HTMLDivElement>(null);
      const [value, setValue] = useState<string[]>([]);
      return (
        <div ref={container}>
          <Field label="States" description="Filter awards by state">
            <MultiSelect
              value={value}
              onChange={setValue}
              options={states}
              portalContainer={container.current}
              aria-label="States"
            />
          </Field>
        </div>
      );
    }
    return <MultiDemo />;
  },
};

export const MultiSelectWithValue: StoryObj = {
  name: "MultiSelect — with value",
  render: () => {
    function MultiDemo() {
      const container = useRef<HTMLDivElement>(null);
      const [value, setValue] = useState<string[]>(["ca", "ny", "tx"]);
      return (
        <div ref={container}>
          <Field label="States">
            <MultiSelect
              value={value}
              onChange={setValue}
              options={states}
              portalContainer={container.current}
              aria-label="States"
            />
          </Field>
        </div>
      );
    }
    return <MultiDemo />;
  },
};

// ─── Combobox ───

export const ComboboxDefault: StoryObj = {
  name: "Combobox — default",
  render: () => {
    function ComboDemo() {
      const [value, setValue] = useState("");
      return (
        <Field label="Agency">
          <Combobox
            value={value}
            onChange={setValue}
            options={[
              { value: "GSA", label: "General Services Administration" },
              { value: "DoD", label: "Department of Defense" },
              { value: "DHS", label: "Department of Homeland Security" },
            ]}
            placeholder="Start typing…"
            aria-label="Agency"
          />
        </Field>
      );
    }
    return <ComboDemo />;
  },
};

// ─── TagInput ───

export const TagInputDefault: StoryObj = {
  name: "TagInput — default",
  render: () => {
    function TagDemo() {
      const [tags, setTags] = useState<string[]>(["541330", "541512"]);
      return (
        <Field label="NAICS codes" description="Press Enter or comma to commit">
          <TagInput
            value={tags}
            onChange={setTags}
            placeholder="Add code"
            aria-label="NAICS codes"
          />
        </Field>
      );
    }
    return <TagDemo />;
  },
};

export const TagInputEmpty: StoryObj = {
  name: "TagInput — empty",
  render: () => {
    function TagDemo() {
      const [tags, setTags] = useState<string[]>([]);
      return (
        <Field label="NAICS codes">
          <TagInput
            value={tags}
            onChange={setTags}
            placeholder="Add code"
            aria-label="NAICS codes"
          />
        </Field>
      );
    }
    return <TagDemo />;
  },
};

// ─── DateRangePicker ───

export const DateRangePickerDefault: StoryObj = {
  name: "DateRangePicker — default",
  render: () => {
    function DateDemo() {
      const [range, setRange] = useState({ start: "2026-01-01", end: "2026-06-30" });
      return (
        <Field label="Posted window">
          <DateRangePicker value={range} onChange={setRange} aria-label="Posted window" />
        </Field>
      );
    }
    return <DateDemo />;
  },
};

export const DateRangePickerEmpty: StoryObj = {
  name: "DateRangePicker — empty",
  render: () => {
    function DateDemo() {
      const [range, setRange] = useState({ start: "", end: "" });
      return (
        <Field label="Posted window">
          <DateRangePicker value={range} onChange={setRange} aria-label="Posted window" />
        </Field>
      );
    }
    return <DateDemo />;
  },
};

// ─── FieldGroup ───

export const FieldGroupVertical: StoryObj = {
  name: "FieldGroup — vertical",
  render: () => (
    <FieldGroup title="Filter awards" description="Tighten the result set">
      <Field label="Agency">
        <Input placeholder="GSA" aria-label="Agency" />
      </Field>
      <Field label="State">
        <Input placeholder="CA" aria-label="State" />
      </Field>
    </FieldGroup>
  ),
};

export const FieldGroupHorizontal: StoryObj = {
  name: "FieldGroup — horizontal",
  render: () => (
    <FieldGroup title="Money range" direction="horizontal">
      <Field label="Min">
        <NumberInput prefix="$" defaultValue={10000} aria-label="Min" />
      </Field>
      <Field label="Max">
        <NumberInput prefix="$" defaultValue={250000} aria-label="Max" />
      </Field>
    </FieldGroup>
  ),
};

// ─── FormErrors ───

export const FormErrorsDefault: StoryObj = {
  name: "FormErrors — populated",
  render: () => (
    <FormErrors
      errors={[
        { field: "Agency", message: "Agency is required" },
        { field: "Window", message: "Start date is after end date" },
        { message: "Generic submission error" },
      ]}
    />
  ),
};

export const FormErrorsEmpty: StoryObj = {
  name: "FormErrors — empty (renders nothing)",
  // ADR-05: the helper "(no visible output)" copy is decorative — `text-subtle`
  // (#737378) on `surface.base` (#000) lands ~4.34:1, below axe's 4.5:1 small
  // text bar. Token palette locked; per-story exemption.
  parameters: {
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
  render: () => (
    <Stack gap="2">
      <FormErrors errors={[]} />
      <div className="text-mono-xs uppercase" style={{ color: "var(--color-text-subtle)" }}>
        (no visible output)
      </div>
    </Stack>
  ),
};

// ─── Composite mini form ───

export const FormComposite: StoryObj = {
  name: "Field — composite mini form",
  render: () => {
    function Demo() {
      return (
        <Stack gap="4">
          <Field label="Title" required>
            <Input placeholder="Enter saved search title" aria-label="Title" />
          </Field>
          <Field label="NAICS codes">
            <TagInput value={["541330"]} onChange={() => {}} aria-label="NAICS codes" />
          </Field>
          <FieldGroup title="Window" direction="horizontal">
            <Field label="Min award">
              <NumberInput prefix="$" defaultValue={10000} aria-label="Min award" />
            </Field>
            <Field label="Max award">
              <NumberInput prefix="$" defaultValue={250000} aria-label="Max award" />
            </Field>
          </FieldGroup>
          <Stack gap="2" align="start">
            <Checkbox defaultChecked label="Notify me on new awards" />
          </Stack>
          <Button>Save search</Button>
        </Stack>
      );
    }
    return <Demo />;
  },
};
