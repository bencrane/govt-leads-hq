import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Avatar,
  CompanyLogo,
  DataTable,
  KVTable,
  Pagination,
  ScrollArea,
  SectionLabel,
  Spinner,
  Stat,
} from "./display";
import { Stack } from "./layout";

const meta = {
  title: "Display",
} satisfies Meta;

export default meta;

// ─── Avatar ───

export const AvatarInitials: StoryObj = {
  name: "Avatar — initials fallback",
  render: () => (
    <Stack gap="3" align="start">
      <Avatar initials="GS" size="sm" alt="Greg Smith" />
      <Avatar initials="GS" size="md" alt="Greg Smith" />
      <Avatar initials="GS" size="lg" alt="Greg Smith" />
    </Stack>
  ),
};

export const AvatarRounded: StoryObj = {
  name: "Avatar — rounded",
  render: () => <Avatar initials="GS" rounded alt="Greg Smith" />,
};

// ─── CompanyLogo ───

export const CompanyLogoMonogram: StoryObj = {
  name: "CompanyLogo — monogram fallback",
  render: () => (
    <Stack gap="3" align="start">
      <CompanyLogo name="Acme Defense" size="sm" />
      <CompanyLogo name="Acme Defense" size="md" />
      <CompanyLogo name="Acme Defense" size="lg" />
    </Stack>
  ),
};

export const CompanyLogoBrokenSource: StoryObj = {
  name: "CompanyLogo — broken URL falls back",
  render: () => <CompanyLogo name="Acme Defense" logoUrl="https://example.invalid/missing.png" />,
};

// ─── Stat ───

export const StatDefault: StoryObj = {
  name: "Stat — default",
  render: () => (
    <Stack gap="6">
      <Stat label="Total awards" value="14,238" unit="this month" />
      <Stat label="Pipeline value" value="$8.2M" delta={{ value: "+12% MoM", tone: "positive" }} />
      <Stat label="Stalled deals" value="3" delta={{ value: "-1 WoW", tone: "negative" }} />
    </Stack>
  ),
};

// ─── KVTable ───

export const KVTableDefault: StoryObj = {
  name: "KVTable — default",
  render: () => (
    <KVTable
      rows={[
        { label: "Solicitation", value: "12345-DOE-2026" },
        { label: "Agency", value: "Department of Energy" },
        { label: "Set-aside", value: "8(a)" },
        { label: "NAICS", value: "541330" },
        { label: "Posted", value: "2026-05-12" },
      ]}
    />
  ),
};

// ─── DataTable ───

type Award = {
  id: string;
  agency: string;
  amount: string;
  state: string;
};

const awards: Award[] = [
  { id: "A-1001", agency: "GSA", amount: "$45,200", state: "VA" },
  { id: "A-1002", agency: "DoD", amount: "$1,820,000", state: "CA" },
  { id: "A-1003", agency: "DHS", amount: "$310,400", state: "TX" },
  { id: "A-1004", agency: "DoE", amount: "$92,800", state: "WA" },
  { id: "A-1005", agency: "GSA", amount: "$12,500", state: "VA" },
  { id: "A-1006", agency: "DoD", amount: "$520,000", state: "NY" },
  { id: "A-1007", agency: "DoT", amount: "$87,400", state: "IL" },
];

export const DataTableDefault: StoryObj = {
  name: "DataTable — default",
  render: () => (
    <DataTable<Award>
      columns={[
        { key: "id", label: "Award", mono: true },
        { key: "agency", label: "Agency" },
        { key: "amount", label: "Amount", align: "right", mono: true },
        { key: "state", label: "State", align: "center" },
      ]}
      rows={awards}
      rowKey={(r) => r.id}
    />
  ),
};

export const DataTableSticky: StoryObj = {
  name: "DataTable — sticky header (scrolls)",
  render: () => {
    const expanded = Array.from({ length: 30 }, (_, i) => ({
      id: `A-${1000 + i}`,
      agency: ["GSA", "DoD", "DHS"][i % 3] || "GSA",
      amount: `$${(Math.floor(Math.random() * 900000) + 10000).toLocaleString()}`,
      state: ["VA", "CA", "TX"][i % 3] || "VA",
    }));
    return (
      <DataTable<Award>
        columns={[
          { key: "id", label: "Award", mono: true },
          { key: "agency", label: "Agency" },
          { key: "amount", label: "Amount", align: "right", mono: true },
          { key: "state", label: "State", align: "center" },
        ]}
        rows={expanded}
        rowKey={(r) => r.id}
        maxBodyHeight="320px"
        caption="Most recent awards"
      />
    );
  },
};

export const DataTableEmpty: StoryObj = {
  name: "DataTable — empty",
  // ADR-05: decorative empty-state copy renders in `text-subtle` (#737378) on
  // `surface.base` (#000). The token palette is locked; the contrast lands
  // at ~4.34:1 (axe enforces 4.5:1 for small text). Per-story exemption.
  parameters: {
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
  render: () => (
    <DataTable<Award>
      columns={[
        { key: "id", label: "Award" },
        { key: "agency", label: "Agency" },
      ]}
      rows={[]}
      rowKey={(r) => r.id}
      empty={
        <div
          className="px-6 py-12 text-center font-mono text-mono-xs uppercase"
          style={{ color: "var(--color-text-subtle)" }}
        >
          No awards match the filter
        </div>
      }
    />
  ),
};

// ─── Pagination ───

export const PaginationDefault: StoryObj = {
  name: "Pagination — default",
  render: () => {
    function PageDemo() {
      const [page, setPage] = useState(1);
      const [pageSize, setPageSize] = useState(25);
      return (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={428}
          onPageChange={setPage}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageSizeChange={setPageSize}
        />
      );
    }
    return <PageDemo />;
  },
};

export const PaginationEmpty: StoryObj = {
  name: "Pagination — zero results",
  render: () => <Pagination page={1} pageSize={25} total={0} onPageChange={() => {}} />,
};

// ─── Spinner ───

export const SpinnerSizes: StoryObj = {
  name: "Spinner — sizes",
  render: () => (
    <Stack gap="4" align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Stack>
  ),
};

// ─── SectionLabel ───

export const SectionLabelDefault: StoryObj = {
  name: "SectionLabel — default",
  render: () => (
    <Stack gap="2" align="start">
      <SectionLabel index={1}>Pipeline overview</SectionLabel>
      <SectionLabel index={2}>Recent awards</SectionLabel>
      <SectionLabel index={10}>Saved searches</SectionLabel>
    </Stack>
  ),
};

// ─── ScrollArea ───

export const ScrollAreaDefault: StoryObj = {
  name: "ScrollArea — default",
  render: () => (
    <div style={{ width: "320px" }}>
      <ScrollArea maxHeight="200px">
        <ul className="flex flex-col gap-2 p-4">
          {Array.from({ length: 30 }, (_, i) => i + 1001).map((opportunityId, i) => (
            <li
              key={`opp-${opportunityId}`}
              className="font-mono text-mono-xs uppercase"
              style={{ color: "var(--color-text-default)" }}
            >
              ROW {String(i + 1).padStart(3, "0")} — opportunity {opportunityId}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  ),
};
