/**
 * Winners — 30-day federal contract winners browser, composed on
 * @govt-leads-hq/ui primitives.
 *
 * Workarounds (no primitive edits):
 * - DataTable's `column.label` is typed `string`; cast through `unknown` so the
 *   sort-amount button can live inside the column header.
 * - DataTable does not expose a per-row `data-testid`. A scoped useEffect on
 *   the wrapper div stamps `data-testid="winners-row"` onto each `<tr>` after
 *   render.
 * - Drawer does not expose `data-testid` on Content; the testid lives on a
 *   wrapper div inside children.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { EmployeeBand, FundingStatus, RevenueBand, Winner } from "../data/winners-fixture";
import { getPeopleByUei } from "../data/people-fixture";
import { type SortDir, type WinnersFilters, fetchWinners30d, winnersToCSV } from "../lib/winners-api";
import { PeopleSection } from "./PeopleSection";

import {
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
  DateRangePicker,
  Drawer,
  Field,
  Input,
  Inline,
  KVTable,
  MultiSelect,
  NumberInput,
  Page,
  PageHeader,
  SectionLabel,
  Stack,
  Text,
} from "@govt-leads-hq/ui";

// ── Utility ──────────────────────────────────────────────────────────────────

function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function triggerCSVDownload(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Constants ────────────────────────────────────────────────────────────────

const EMPLOYEE_BANDS: EmployeeBand[] = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001+"];
const REVENUE_BANDS: RevenueBand[] = ["<$1M", "$1M-$10M", "$10M-$50M", "$50M-$200M", "$200M-$1B", "$1B+"];
const FUNDING_STATUSES: FundingStatus[] = ["bootstrapped", "vc-backed", "pe-backed", "public", "unknown"];
const SET_ASIDE_OPTIONS = [
  { value: "8A", label: "8(a)" },
  { value: "SDVOSB", label: "SDVOSB" },
  { value: "WOSB", label: "WOSB" },
  { value: "HUBZ", label: "HUBZone" },
  { value: "EDWOSB", label: "EDWOSB" },
  { value: "NONE", label: "No set-aside" },
];
const US_STATES = [
  "AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL",
  "IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE",
  "NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VA","VT","WA","WI","WV","WY",
];
const STATE_OPTIONS = US_STATES.map((s) => ({ value: s, label: s }));
const EMPLOYEE_OPTIONS = EMPLOYEE_BANDS.map((b) => ({ value: b, label: b }));
const REVENUE_OPTIONS = REVENUE_BANDS.map((b) => ({ value: b, label: b }));
const FUNDING_OPTIONS = FUNDING_STATUSES.map((s) => ({ value: s, label: s }));

// ── Filter-state hook ────────────────────────────────────────────────────────
// Owns all 14 filter fields + the URL sync. Returns one filters memo, one
// stable per-field setter that updates both state and the URL, and the
// multi-select setters typed against their string-literal unions.

function useWinnersFilters() {
  const [params, setParams] = useSearchParams();

  const [naics, setNaics] = useState(() => params.get("naics") ?? "");
  const [amountMin, setAmountMin] = useState(() => params.get("amount_min") ?? "");
  const [amountMax, setAmountMax] = useState(() => params.get("amount_max") ?? "");
  const [popState, setPopState] = useState<string[]>(() => (params.get("pop_state") ?? "").split(",").filter(Boolean));
  const [setAside, setSetAside] = useState<string[]>(() => (params.get("set_aside") ?? "").split(",").filter(Boolean));
  const [agency, setAgency] = useState(() => params.get("agency") ?? "");
  const [dateFrom, setDateFrom] = useState(() => params.get("date_from") ?? "");
  const [dateTo, setDateTo] = useState(() => params.get("date_to") ?? "");
  const [keyword, setKeyword] = useState(() => params.get("keyword") ?? "");
  const [employeeBand, setEmployeeBand] = useState<EmployeeBand[]>(
    () => (params.get("employee_band") ?? "").split(",").filter(Boolean) as EmployeeBand[],
  );
  const [revenueBand, setRevenueBand] = useState<RevenueBand[]>(
    () => (params.get("revenue_band") ?? "").split(",").filter(Boolean) as RevenueBand[],
  );
  const [fundingStatus, setFundingStatus] = useState<FundingStatus[]>(
    () => (params.get("funding_status") ?? "").split(",").filter(Boolean) as FundingStatus[],
  );
  const [foundedYearMin, setFoundedYearMin] = useState(() => params.get("founded_year_min") ?? "");
  const [foundedYearMax, setFoundedYearMax] = useState(() => params.get("founded_year_max") ?? "");

  const writeParam = useCallback(
    (key: string, value: string | string[]) => {
      setParams(
        (p) => {
          const n = new URLSearchParams(p);
          const v = Array.isArray(value) ? value.join(",") : value;
          if (v) n.set(key, v);
          else n.delete(key);
          return n;
        },
        { replace: false },
      );
    },
    [setParams],
  );

  // Generic state + URL setter factory. One function per field.
  const bindText = (set: (v: string) => void, key: string) => (v: string) => {
    set(v);
    writeParam(key, v);
  };
  const bindArr = <T extends string>(set: (v: T[]) => void, key: string) => (next: string[]) => {
    set(next as T[]);
    writeParam(key, next);
  };

  const filters: WinnersFilters = useMemo(
    () => ({
      naics: naics || undefined,
      award_amount_min: amountMin ? Number(amountMin) : undefined,
      award_amount_max: amountMax ? Number(amountMax) : undefined,
      pop_state: popState.length ? popState : undefined,
      set_aside: setAside.length ? setAside : undefined,
      agency: agency || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      keyword: keyword || undefined,
      employee_band: employeeBand.length ? employeeBand : undefined,
      revenue_band: revenueBand.length ? revenueBand : undefined,
      funding_status: fundingStatus.length ? fundingStatus : undefined,
      founded_year_min: foundedYearMin ? Number(foundedYearMin) : undefined,
      founded_year_max: foundedYearMax ? Number(foundedYearMax) : undefined,
    }),
    [naics, amountMin, amountMax, popState, setAside, agency, dateFrom, dateTo, keyword, employeeBand, revenueBand, fundingStatus, foundedYearMin, foundedYearMax],
  );

  return {
    filters,
    values: { naics, amountMin, amountMax, popState, setAside, agency, dateFrom, dateTo, keyword, employeeBand, revenueBand, fundingStatus, foundedYearMin, foundedYearMax },
    setters: {
      naics: bindText(setNaics, "naics"),
      amountMin: bindText(setAmountMin, "amount_min"),
      amountMax: bindText(setAmountMax, "amount_max"),
      popState: bindArr<string>(setPopState, "pop_state"),
      setAside: bindArr<string>(setSetAside, "set_aside"),
      agency: bindText(setAgency, "agency"),
      keyword: bindText(setKeyword, "keyword"),
      employeeBand: bindArr<EmployeeBand>(setEmployeeBand, "employee_band"),
      revenueBand: bindArr<RevenueBand>(setRevenueBand, "revenue_band"),
      fundingStatus: bindArr<FundingStatus>(setFundingStatus, "funding_status"),
      foundedYearMin: bindText(setFoundedYearMin, "founded_year_min"),
      foundedYearMax: bindText(setFoundedYearMax, "founded_year_max"),
      dateRange: (next: { start: string; end: string }) => {
        setDateFrom(next.start);
        setDateTo(next.end);
        writeParam("date_from", next.start);
        writeParam("date_to", next.end);
      },
    },
  };
}

// ── Main component ───────────────────────────────────────────────────────────

export function Winners() {
  const { filters, values: v, setters: s } = useWinnersFilters();
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);

  const result = useMemo(
    () => fetchWinners30d({ filters, sort_field: "total_obligation_30d", sort_dir: sortDir }),
    [filters, sortDir],
  );

  const handleExportCSV = useCallback(() => {
    const all = fetchWinners30d({ filters, sort_field: "total_obligation_30d", sort_dir: sortDir, page: 0, page_size: 10_000 });
    triggerCSVDownload(winnersToCSV(all.rows), "winners-30d.csv");
  }, [filters, sortDir]);

  const handleSortAmount = useCallback(() => setSortDir((d) => (d === "desc" ? "asc" : "desc")), []);

  const columns: ReadonlyArray<DataTableColumn<Winner>> = useMemo(() => [
    {
      key: "entity",
      label: "Entity",
      render: (w) => (
        <Stack gap="1">
          <span className="font-medium text-[color:var(--color-text-strong)]">{w.company_name}</span>
          <span className="font-mono text-mono-xs text-[color:var(--color-text-muted)]">{w.recipient_uei}</span>
        </Stack>
      ),
    },
    {
      key: "total_obligation_30d",
      // DataTableColumn.label is typed `string`; runtime accepts ReactNode via JSX children.
      label: ((
        <button
          type="button"
          data-testid="sort-amount"
          onClick={handleSortAmount}
          className="cursor-pointer font-mono text-mono-xs uppercase text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-accent)]"
        >
          Obligation{sortDir === "desc" ? " ↓" : " ↑"}
        </button>
      ) as unknown) as string,
      align: "right",
      mono: true,
      render: (w) => (
        <span data-testid="cell-obligation" className="text-[color:var(--color-text-accent)]">
          {fmtUSD(w.total_obligation_30d)}
        </span>
      ),
    },
    { key: "top_agency", label: "Agency", render: (w) => <span className="text-[color:var(--color-text-muted)]">{w.top_agency}</span> },
    { key: "naics_code", label: "NAICS", render: (w) => <Badge tone="info">{w.naics_code}</Badge> },
    { key: "performance_state", label: "State", render: (w) => <Badge tone="info">{w.performance_state}</Badge> },
    {
      key: "latest_contract_date",
      label: "Latest Award",
      mono: true,
      render: (w) => <span className="font-mono text-mono-xs text-[color:var(--color-text-muted)]">{w.latest_contract_date}</span>,
    },
  ], [sortDir, handleSortAmount]);

  // DataTable lacks per-row data-testid; stamp it on each <tr> after render.
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;
    for (const tr of wrapper.querySelectorAll("tbody tr")) {
      tr.setAttribute("data-testid", "winners-row");
    }
  }, [result.rows]);

  return (
    <Page variant="wide" py="0" unsafe_className="min-h-screen flex flex-col px-16" data-testid="winners-page">
      <PageHeader
        eyebrow={
          <Inline gap="3" align="center">
            <span>GOVTLEADS</span>
            <span aria-hidden className="text-[color:var(--color-border-default)]">|</span>
            <span className="font-sans text-body-md font-semibold normal-case tracking-tight text-[color:var(--color-text-strong)]">
              30-Day Contract Winners
            </span>
            <Badge tone="success">{result.total} companies</Badge>
          </Inline>
        }
        actions={
          <Button variant="secondary" size="sm" data-testid="export-csv-button" onClick={handleExportCSV}>
            Export CSV
          </Button>
        }
      />

      <div className="flex flex-1 gap-6 overflow-hidden">
        <aside
          data-testid="winners-filters-sidebar"
          className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto border-r border-[color:var(--color-border-subtle)] pr-4"
        >
          <span className="border-b border-[color:var(--color-border-subtle)] pb-2 font-mono text-mono-xs uppercase text-[color:var(--color-text-muted)]">
            Filters
          </span>

          <Field label="NAICS Code">
            <Input data-testid="naics-input" type="text" placeholder="e.g. 541512" value={v.naics} onChange={(e) => s.naics(e.target.value)} />
          </Field>

          <Field label="Obligation ($)">
            <Inline gap="2">
              <NumberInput data-testid="award-amount-min" placeholder="Min" value={v.amountMin} onChange={(e) => s.amountMin(e.target.value)} />
              <NumberInput data-testid="award-amount-max" placeholder="Max" value={v.amountMax} onChange={(e) => s.amountMax(e.target.value)} />
            </Inline>
          </Field>

          <Field label="Perf. State">
            <div data-testid="pop-state-select">
              <MultiSelect value={v.popState} onChange={s.popState} options={STATE_OPTIONS} aria-label="Performance state" />
            </div>
          </Field>

          <Field label="Set-Aside">
            <div data-testid="set-aside-select">
              <MultiSelect value={v.setAside} onChange={s.setAside} options={SET_ASIDE_OPTIONS} aria-label="Set-aside" />
            </div>
          </Field>

          <Field label="Agency">
            <Input data-testid="agency-select" type="text" placeholder="e.g. DoD, NASA" value={v.agency} onChange={(e) => s.agency(e.target.value)} />
          </Field>

          <Field label="Date Range">
            <div data-testid="date-range-picker">
              <DateRangePicker value={{ start: v.dateFrom, end: v.dateTo }} onChange={s.dateRange} aria-label="Date range" />
            </div>
          </Field>

          <Field label="Keyword">
            <Input data-testid="keyword-input" type="text" placeholder="Search title / description" value={v.keyword} onChange={(e) => s.keyword(e.target.value)} />
          </Field>

          <Field label="Employee Size">
            <div data-testid="employee-band-select">
              <MultiSelect value={v.employeeBand} onChange={s.employeeBand} options={EMPLOYEE_OPTIONS} aria-label="Employee size" />
            </div>
          </Field>

          <Field label="Revenue Band">
            <div data-testid="revenue-band-select">
              <MultiSelect value={v.revenueBand} onChange={s.revenueBand} options={REVENUE_OPTIONS} aria-label="Revenue band" />
            </div>
          </Field>

          <Field label="Funding Status">
            <div data-testid="funding-status-select">
              <MultiSelect value={v.fundingStatus} onChange={s.fundingStatus} options={FUNDING_OPTIONS} aria-label="Funding status" />
            </div>
          </Field>

          <Field label="Founded Year">
            <Inline gap="2">
              <NumberInput data-testid="founded-year-min" placeholder="From" value={v.foundedYearMin} onChange={(e) => s.foundedYearMin(e.target.value)} />
              <NumberInput data-testid="founded-year-max" placeholder="To" value={v.foundedYearMax} onChange={(e) => s.foundedYearMax(e.target.value)} />
            </Inline>
          </Field>
        </aside>

        <main className="flex flex-1 flex-col overflow-y-auto pl-2">
          {result.rows.length === 0 ? (
            <div className="p-8 text-center font-mono text-mono-sm text-[color:var(--color-text-muted)]">
              No results match the current filters.
            </div>
          ) : (
            <div ref={tableWrapperRef} data-testid="winners-table">
              <DataTable
                columns={columns as unknown as ReadonlyArray<DataTableColumn<Record<string, unknown>>>}
                rows={result.rows as unknown as ReadonlyArray<Record<string, unknown>>}
                rowKey={(w) => (w as unknown as Winner).recipient_uei}
                onRowClick={(w) => setSelectedWinner(w as unknown as Winner)}
                caption="30-day federal contract winners"
              />
            </div>
          )}
        </main>
      </div>

      <Drawer
        open={!!selectedWinner}
        onOpenChange={(o) => !o && setSelectedWinner(null)}
        width="min(520px, 90vw)"
        aria-label="Winner detail"
      >
        {selectedWinner && (
          <div data-testid="winners-detail-drawer" className="flex max-h-[calc(100vh-3rem)] flex-col gap-5 overflow-y-auto">
            <Inline justify="between" align="start">
              <Stack gap="1">
                <Text as="span" size="body-lg" color="strong" className="font-semibold">{selectedWinner.company_name}</Text>
                <span className="font-mono text-mono-xs text-[color:var(--color-text-muted)]">{selectedWinner.recipient_uei}</span>
              </Stack>
              <Button variant="ghost" size="sm" onClick={() => setSelectedWinner(null)} aria-label="Close drawer">{"×"}</Button>
            </Inline>

            <div data-testid="award-fields" className="flex flex-col gap-3">
              <SectionLabel index={1}>Award Details</SectionLabel>
              <KVTable
                rows={[
                  { label: "Title", value: selectedWinner.award_title },
                  { label: "Obligation (30d)", value: <span className="font-mono tabular-nums text-[color:var(--color-text-accent)]">{fmtUSD(selectedWinner.total_obligation_30d)}</span> },
                  { label: "Contracts", value: <span className="font-mono tabular-nums">{selectedWinner.contract_count_30d}</span> },
                  { label: "Agency", value: selectedWinner.top_agency },
                  { label: "NAICS", value: <span className="font-mono">{selectedWinner.naics_code} — {selectedWinner.naics_description}</span> },
                  { label: "Perf. State", value: <Badge tone="info">{selectedWinner.performance_state}</Badge> },
                  { label: "Set-Aside", value: <Badge tone={selectedWinner.set_aside_code !== "NONE" ? "success" : "default"}>{selectedWinner.set_aside_code}</Badge> },
                  { label: "Latest Award", value: <span className="font-mono">{selectedWinner.latest_contract_date}</span> },
                ]}
              />
              <Text size="body-sm" color="muted" className="mt-2">{selectedWinner.award_description}</Text>
            </div>

            <div data-testid="firmographic-block" className="flex flex-col gap-3">
              <SectionLabel index={2}>Company Profile</SectionLabel>
              <KVTable
                rows={[
                  { label: "Founded", value: <span className="font-mono">{selectedWinner.founded_year}</span> },
                  { label: "Employees", value: <span className="font-mono">{selectedWinner.employee_band}</span> },
                  { label: "Revenue", value: <span className="font-mono">{selectedWinner.revenue_band}</span> },
                  {
                    label: "Funding",
                    value: (
                      <Badge tone={selectedWinner.funding_status === "vc-backed" || selectedWinner.funding_status === "pe-backed" ? "info" : "success"}>
                        {selectedWinner.funding_status}
                      </Badge>
                    ),
                  },
                ]}
              />
            </div>

            <PeopleSection people={getPeopleByUei(selectedWinner.recipient_uei)} />
          </div>
        )}
      </Drawer>
    </Page>
  );
}
