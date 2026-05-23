/**
 * Winners — 30-day federal contract winners browser.
 *
 * Implements all 10 acceptance tests from the directive:
 *   1. route-renders           — page root [data-testid="winners-page"]
 *   2. filter-panel-mounts     — 12 filter controls with stable testids
 *   3. apply-filter-updates-url — URL reflects filter changes
 *   4. url-restores-filter     — URL params hydrate filter controls
 *   5. result-list-renders     — table ≥1 row
 *   6. sort-by-amount-works    — clicking [data-testid="sort-amount"] changes order
 *   7. detail-drawer-opens     — drawer with award-fields + firmographic-block
 *   8. csv-export-works        — Export CSV triggers download
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { EmployeeBand, FundingStatus, RevenueBand, Winner } from "../data/winners-fixture";
import {
  CSV_HEADER,
  type SortDir,
  type WinnersFilters,
  fetchWinners30d,
  winnersToCSV,
} from "../lib/winners-api";

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

// ── Constants ─────────────────────────────────────────────────────────────────

const EMPLOYEE_BANDS: EmployeeBand[] = [
  "1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001+",
];
const REVENUE_BANDS: RevenueBand[] = [
  "<$1M", "$1M-$10M", "$10M-$50M", "$50M-$200M", "$200M-$1B", "$1B+",
];
const FUNDING_STATUSES: FundingStatus[] = [
  "bootstrapped", "vc-backed", "pe-backed", "public", "unknown",
];
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

// ── Filter panel sub-components ───────────────────────────────────────────────

interface LabelProps { label: string; children: React.ReactNode }
function FilterLabel({ label, children }: LabelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "0.7rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted, #6b7280)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--color-surface-raised, #111)",
  border: "1px solid var(--color-border-subtle, #333)",
  color: "var(--color-text-default, #e5e7eb)",
  padding: "6px 8px",
  fontSize: "0.8125rem",
  fontFamily: "inherit",
  borderRadius: "4px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

// ── Main component ────────────────────────────────────────────────────────────

export function Winners() {
  const [params, setParams] = useSearchParams();

  // ── Hydrate filters from URL ──────────────────────────────────────────────
  const [naics, setNaics] = useState(() => params.get("naics") ?? "");
  const [amountMin, setAmountMin] = useState(() => params.get("amount_min") ?? "");
  const [amountMax, setAmountMax] = useState(() => params.get("amount_max") ?? "");
  const [popState, setPopState] = useState<string[]>(() => {
    const v = params.get("pop_state");
    return v ? v.split(",").filter(Boolean) : [];
  });
  const [setAside, setSetAside] = useState<string[]>(() => {
    const v = params.get("set_aside");
    return v ? v.split(",").filter(Boolean) : [];
  });
  const [agency, setAgency] = useState(() => params.get("agency") ?? "");
  const [dateFrom, setDateFrom] = useState(() => params.get("date_from") ?? "");
  const [dateTo, setDateTo] = useState(() => params.get("date_to") ?? "");
  const [keyword, setKeyword] = useState(() => params.get("keyword") ?? "");
  const [employeeBand, setEmployeeBand] = useState<EmployeeBand[]>(() => {
    const v = params.get("employee_band");
    return v ? (v.split(",").filter(Boolean) as EmployeeBand[]) : [];
  });
  const [revenueBand, setRevenueBand] = useState<RevenueBand[]>(() => {
    const v = params.get("revenue_band");
    return v ? (v.split(",").filter(Boolean) as RevenueBand[]) : [];
  });
  const [fundingStatus, setFundingStatus] = useState<FundingStatus[]>(() => {
    const v = params.get("funding_status");
    return v ? (v.split(",").filter(Boolean) as FundingStatus[]) : [];
  });
  const [foundedYearMin, setFoundedYearMin] = useState(() => params.get("founded_year_min") ?? "");
  const [foundedYearMax, setFoundedYearMax] = useState(() => params.get("founded_year_max") ?? "");

  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);

  // ── Sync filter state → URL ────────────────────────────────────────────────
  const syncURL = useCallback(
    (overrides: Record<string, string | string[] | undefined> = {}) => {
      const next: Record<string, string> = {};
      const set = (k: string, v: string | string[] | undefined) => {
        const val = Array.isArray(v) ? v.join(",") : v ?? "";
        if (val) next[k] = val;
      };
      set("naics", overrides.naics !== undefined ? overrides.naics : naics);
      set("amount_min", overrides.amount_min !== undefined ? overrides.amount_min : amountMin);
      set("amount_max", overrides.amount_max !== undefined ? overrides.amount_max : amountMax);
      set("pop_state", overrides.pop_state !== undefined ? overrides.pop_state : popState);
      set("set_aside", overrides.set_aside !== undefined ? overrides.set_aside : setAside);
      set("agency", overrides.agency !== undefined ? overrides.agency : agency);
      set("date_from", overrides.date_from !== undefined ? overrides.date_from : dateFrom);
      set("date_to", overrides.date_to !== undefined ? overrides.date_to : dateTo);
      set("keyword", overrides.keyword !== undefined ? overrides.keyword : keyword);
      set("employee_band", overrides.employee_band !== undefined ? overrides.employee_band : employeeBand);
      set("revenue_band", overrides.revenue_band !== undefined ? overrides.revenue_band : revenueBand);
      set("funding_status", overrides.funding_status !== undefined ? overrides.funding_status : fundingStatus);
      set("founded_year_min", overrides.founded_year_min !== undefined ? overrides.founded_year_min : foundedYearMin);
      set("founded_year_max", overrides.founded_year_max !== undefined ? overrides.founded_year_max : foundedYearMax);
      setParams(next, { replace: false });
    },
    [naics, amountMin, amountMax, popState, setAside, agency, dateFrom, dateTo, keyword, employeeBand, revenueBand, fundingStatus, foundedYearMin, foundedYearMax, setParams],
  );

  // Handlers that update state AND URL atomically
  function handleNaics(v: string) { setNaics(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("naics", v); else n.delete("naics"); return n; }, { replace: false }); }
  function handleAmountMin(v: string) { setAmountMin(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("amount_min", v); else n.delete("amount_min"); return n; }, { replace: false }); }
  function handleAmountMax(v: string) { setAmountMax(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("amount_max", v); else n.delete("amount_max"); return n; }, { replace: false }); }
  function handleAgency(v: string) { setAgency(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("agency", v); else n.delete("agency"); return n; }, { replace: false }); }
  function handleDateFrom(v: string) { setDateFrom(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("date_from", v); else n.delete("date_from"); return n; }, { replace: false }); }
  function handleDateTo(v: string) { setDateTo(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("date_to", v); else n.delete("date_to"); return n; }, { replace: false }); }
  function handleKeyword(v: string) { setKeyword(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("keyword", v); else n.delete("keyword"); return n; }, { replace: false }); }
  function handleFoundedYearMin(v: string) { setFoundedYearMin(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("founded_year_min", v); else n.delete("founded_year_min"); return n; }, { replace: false }); }
  function handleFoundedYearMax(v: string) { setFoundedYearMax(v); setParams(p => { const n = new URLSearchParams(p); if (v) n.set("founded_year_max", v); else n.delete("founded_year_max"); return n; }, { replace: false }); }

  function toggleMulti<T extends string>(list: T[], item: T, setList: (v: T[]) => void, paramKey: string) {
    const next = list.includes(item) ? list.filter(x => x !== item) : [...list, item];
    setList(next);
    setParams(p => { const n = new URLSearchParams(p); if (next.length) n.set(paramKey, next.join(",")); else n.delete(paramKey); return n; }, { replace: false });
  }

  // ── Build query from state ─────────────────────────────────────────────────
  const filters: WinnersFilters = useMemo(() => ({
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
  }), [naics, amountMin, amountMax, popState, setAside, agency, dateFrom, dateTo, keyword, employeeBand, revenueBand, fundingStatus, foundedYearMin, foundedYearMax]);

  const result = useMemo(
    () => fetchWinners30d({ filters, sort_field: "total_obligation_30d", sort_dir: sortDir }),
    [filters, sortDir],
  );

  // ── CSV export ─────────────────────────────────────────────────────────────
  // Run the query without pagination to get all matching rows for export.
  function handleExportCSV() {
    const all = fetchWinners30d({ filters, sort_field: "total_obligation_30d", sort_dir: sortDir, page: 0, page_size: 10_000 });
    const csv = winnersToCSV(all.rows);
    triggerCSVDownload(csv, "winners-30d.csv");
  }

  // ── Sort toggle ────────────────────────────────────────────────────────────
  function handleSortAmount() {
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "var(--color-surface-base, #000000)",
    color: "var(--color-text-default, #e5e7eb)",
    fontFamily: "var(--font-sans, 'Inter', system-ui, sans-serif)",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle: React.CSSProperties = {
    borderBottom: "1px solid var(--color-border-subtle, #1f2937)",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  };

  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    position: "relative",
  };

  const sidebarStyle: React.CSSProperties = {
    width: "260px",
    minWidth: "260px",
    borderRight: "1px solid var(--color-border-subtle, #1f2937)",
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.8125rem",
  };

  const thStyle: React.CSSProperties = {
    padding: "8px 12px",
    textAlign: "left",
    fontFamily: "monospace",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-text-muted, #6b7280)",
    borderBottom: "1px solid var(--color-border-subtle, #1f2937)",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderBottom: "1px solid var(--color-border-subtle, #111827)",
    verticalAlign: "middle",
  };

  const amountTdStyle: React.CSSProperties = {
    ...tdStyle,
    fontFamily: "monospace",
    fontVariantNumeric: "tabular-nums",
    textAlign: "right",
    color: "var(--color-text-accent, #22c55e)",
  };

  const badgeStyle = (color: string): React.CSSProperties => ({
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: "3px",
    fontSize: "0.65rem",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    background: color === "green" ? "rgba(34,197,94,0.12)" : "rgba(99,102,241,0.12)",
    color: color === "green" ? "var(--color-text-accent, #22c55e)" : "#818cf8",
    border: color === "green" ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(99,102,241,0.3)",
  });

  const drawerOverlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 100,
    display: selectedWinner ? "block" : "none",
  };

  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(480px, 90vw)",
    background: "var(--color-surface-raised, #0a0e1a)",
    borderLeft: "1px solid var(--color-border-subtle, #1f2937)",
    zIndex: 101,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    transform: selectedWinner ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.2s ease",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "var(--color-text-muted, #6b7280)",
    marginBottom: "10px",
    paddingBottom: "6px",
    borderBottom: "1px solid var(--color-border-subtle, #1f2937)",
  };

  const fieldRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "6px 0",
    fontSize: "0.8125rem",
    borderBottom: "1px solid var(--color-border-subtle, #0f1623)",
  };

  const fieldKeyStyle: React.CSSProperties = {
    color: "var(--color-text-muted, #6b7280)",
    fontSize: "0.75rem",
    fontFamily: "monospace",
  };

  const sortArrow = sortDir === "desc" ? " ↓" : " ↑";

  // ── MultiSelect helper ─────────────────────────────────────────────────────
  function MultiSelectPills<T extends string>({
    options, selected, onToggle, testId,
  }: {
    options: { value: T; label: string }[];
    selected: T[];
    onToggle: (v: T) => void;
    testId: string;
  }) {
    return (
      <div data-testid={testId} style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              onClick={() => onToggle(o.value)}
              style={{
                padding: "3px 8px",
                fontSize: "0.7rem",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                border: active ? "1px solid var(--color-border-accent, #16a34a)" : "1px solid var(--color-border-subtle, #374151)",
                background: active ? "rgba(34,197,94,0.12)" : "transparent",
                color: active ? "var(--color-text-accent, #22c55e)" : "var(--color-text-muted, #6b7280)",
                cursor: "pointer",
                borderRadius: "3px",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div data-testid="winners-page" style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-accent, #22c55e)" }}>
            GOVTLEADS
          </span>
          <span style={{ color: "var(--color-border-subtle, #374151)" }}>|</span>
          <h1 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
            30-Day Contract Winners
          </h1>
          <span style={badgeStyle("green")}>{result.total} companies</span>
        </div>
        <button
          data-testid="export-csv-button"
          onClick={handleExportCSV}
          style={{
            padding: "7px 14px",
            background: "transparent",
            border: "1px solid var(--color-border-accent, #16a34a)",
            color: "var(--color-text-accent, #22c55e)",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Export CSV
        </button>
      </header>

      {/* Body */}
      <div style={bodyStyle}>
        {/* Filter sidebar */}
        <aside style={sidebarStyle}>
          <div style={{ fontFamily: "monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-muted, #6b7280)", paddingBottom: "8px", borderBottom: "1px solid var(--color-border-subtle, #1f2937)" }}>
            Filters
          </div>

          {/* NAICS */}
          <FilterLabel label="NAICS Code">
            <input
              data-testid="naics-input"
              type="text"
              placeholder="e.g. 541512"
              value={naics}
              onChange={(e) => handleNaics(e.target.value)}
              style={inputStyle}
            />
          </FilterLabel>

          {/* Award amount */}
          <FilterLabel label="Obligation ($)">
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                data-testid="award-amount-min"
                type="number"
                placeholder="Min"
                value={amountMin}
                onChange={(e) => handleAmountMin(e.target.value)}
                style={{ ...inputStyle, width: "50%" }}
              />
              <input
                data-testid="award-amount-max"
                type="number"
                placeholder="Max"
                value={amountMax}
                onChange={(e) => handleAmountMax(e.target.value)}
                style={{ ...inputStyle, width: "50%" }}
              />
            </div>
          </FilterLabel>

          {/* Place of performance */}
          <FilterLabel label="Perf. State">
            <select
              data-testid="pop-state-select"
              multiple
              value={popState}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                setPopState(selected);
                setParams(p => { const n = new URLSearchParams(p); if (selected.length) n.set("pop_state", selected.join(",")); else n.delete("pop_state"); return n; }, { replace: false });
              }}
              style={{ ...selectStyle, height: "72px" }}
            >
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FilterLabel>

          {/* Set-aside */}
          <FilterLabel label="Set-Aside">
            <select
              data-testid="set-aside-select"
              multiple
              value={setAside}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                setSetAside(selected);
                setParams(p => { const n = new URLSearchParams(p); if (selected.length) n.set("set_aside", selected.join(",")); else n.delete("set_aside"); return n; }, { replace: false });
              }}
              style={{ ...selectStyle, height: "72px" }}
            >
              {SET_ASIDE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FilterLabel>

          {/* Agency */}
          <FilterLabel label="Agency">
            <input
              data-testid="agency-select"
              type="text"
              placeholder="e.g. DoD, NASA"
              value={agency}
              onChange={(e) => handleAgency(e.target.value)}
              style={inputStyle}
            />
          </FilterLabel>

          {/* Date range */}
          <FilterLabel label="Date Range">
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <input
                data-testid="date-range-picker"
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateFrom(e.target.value)}
                style={inputStyle}
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleDateTo(e.target.value)}
                style={inputStyle}
              />
            </div>
          </FilterLabel>

          {/* Keyword */}
          <FilterLabel label="Keyword">
            <input
              data-testid="keyword-input"
              type="text"
              placeholder="Search title / description"
              value={keyword}
              onChange={(e) => handleKeyword(e.target.value)}
              style={inputStyle}
            />
          </FilterLabel>

          {/* Employee band */}
          <FilterLabel label="Employee Size">
            <select
              data-testid="employee-band-select"
              multiple
              value={employeeBand}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value) as EmployeeBand[];
                setEmployeeBand(selected);
                setParams(p => { const n = new URLSearchParams(p); if (selected.length) n.set("employee_band", selected.join(",")); else n.delete("employee_band"); return n; }, { replace: false });
              }}
              style={{ ...selectStyle, height: "72px" }}
            >
              {EMPLOYEE_BANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </FilterLabel>

          {/* Revenue band */}
          <FilterLabel label="Revenue Band">
            <select
              data-testid="revenue-band-select"
              multiple
              value={revenueBand}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value) as RevenueBand[];
                setRevenueBand(selected);
                setParams(p => { const n = new URLSearchParams(p); if (selected.length) n.set("revenue_band", selected.join(",")); else n.delete("revenue_band"); return n; }, { replace: false });
              }}
              style={{ ...selectStyle, height: "72px" }}
            >
              {REVENUE_BANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </FilterLabel>

          {/* Funding status */}
          <FilterLabel label="Funding Status">
            <select
              data-testid="funding-status-select"
              multiple
              value={fundingStatus}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value) as FundingStatus[];
                setFundingStatus(selected);
                setParams(p => { const n = new URLSearchParams(p); if (selected.length) n.set("funding_status", selected.join(",")); else n.delete("funding_status"); return n; }, { replace: false });
              }}
              style={{ ...selectStyle, height: "72px" }}
            >
              {FUNDING_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FilterLabel>

          {/* Founded year */}
          <FilterLabel label="Founded Year">
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                data-testid="founded-year-min"
                type="number"
                placeholder="From"
                value={foundedYearMin}
                onChange={(e) => handleFoundedYearMin(e.target.value)}
                style={{ ...inputStyle, width: "50%" }}
              />
              <input
                data-testid="founded-year-max"
                type="number"
                placeholder="To"
                value={foundedYearMax}
                onChange={(e) => handleFoundedYearMax(e.target.value)}
                style={{ ...inputStyle, width: "50%" }}
              />
            </div>
          </FilterLabel>
        </aside>

        {/* Result table */}
        <main style={mainStyle}>
          {result.rows.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--color-text-muted, #6b7280)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
              No results match the current filters.
            </div>
          ) : (
            <table data-testid="winners-table" style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Entity</th>
                  <th
                    data-testid="sort-amount"
                    onClick={handleSortAmount}
                    style={{ ...thStyle, cursor: "pointer", userSelect: "none", textAlign: "right" }}
                  >
                    Obligation{sortArrow}
                  </th>
                  <th style={thStyle}>Agency</th>
                  <th style={thStyle}>NAICS</th>
                  <th style={thStyle}>State</th>
                  <th style={thStyle}>Latest Award</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((w) => (
                  <tr
                    key={w.recipient_uei}
                    data-testid="winners-row"
                    onClick={() => setSelectedWinner(w)}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "";
                    }}
                  >
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500, marginBottom: "2px" }}>{w.company_name}</div>
                      <div style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "var(--color-text-muted, #6b7280)" }}>{w.recipient_uei}</div>
                    </td>
                    <td data-testid="cell-obligation" style={amountTdStyle}>{fmtUSD(w.total_obligation_30d)}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #9ca3af)" }}>{w.top_agency}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={badgeStyle("indigo")}>{w.naics_code}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={badgeStyle("indigo")}>{w.performance_state}</span>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem", color: "var(--color-text-muted, #9ca3af)" }}>
                      {w.latest_contract_date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>

      {/* Detail drawer */}
      <div style={drawerOverlayStyle} onClick={() => setSelectedWinner(null)} />
      <aside
        data-testid="winners-detail-drawer"
        style={drawerStyle}
        aria-hidden={!selectedWinner}
      >
        {selectedWinner && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "4px" }}>{selectedWinner.company_name}</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "var(--color-text-muted, #6b7280)" }}>{selectedWinner.recipient_uei}</div>
              </div>
              <button
                onClick={() => setSelectedWinner(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted, #6b7280)", fontSize: "1.2rem", padding: "0 4px" }}
                aria-label="Close drawer"
              >
                ×
              </button>
            </div>

            {/* Award fields block */}
            <div data-testid="award-fields">
              <div style={sectionTitleStyle}>Award Details</div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Title</span>
                <span style={{ maxWidth: "60%", textAlign: "right", fontSize: "0.8125rem" }}>{selectedWinner.award_title}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Obligation (30d)</span>
                <span style={{ fontFamily: "monospace", color: "var(--color-text-accent, #22c55e)", fontVariantNumeric: "tabular-nums" }}>
                  {fmtUSD(selectedWinner.total_obligation_30d)}
                </span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Contracts</span>
                <span style={{ fontFamily: "monospace" }}>{selectedWinner.contract_count_30d}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Agency</span>
                <span style={{ maxWidth: "60%", textAlign: "right", fontSize: "0.8125rem" }}>{selectedWinner.top_agency}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>NAICS</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>{selectedWinner.naics_code} — {selectedWinner.naics_description}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Perf. State</span>
                <span style={badgeStyle("indigo")}>{selectedWinner.performance_state}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Set-Aside</span>
                <span style={badgeStyle(selectedWinner.set_aside_code !== "NONE" ? "green" : "indigo")}>{selectedWinner.set_aside_code}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Latest Award</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>{selectedWinner.latest_contract_date}</span>
              </div>
              <div style={{ marginTop: "8px", padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "4px", fontSize: "0.8125rem", lineHeight: "1.5", color: "var(--color-text-muted, #9ca3af)" }}>
                {selectedWinner.award_description}
              </div>
            </div>

            {/* Firmographic block */}
            <div data-testid="firmographic-block">
              <div style={sectionTitleStyle}>Company Profile</div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Founded</span>
                <span style={{ fontFamily: "monospace" }}>{selectedWinner.founded_year}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Employees</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>{selectedWinner.employee_band}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Revenue</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>{selectedWinner.revenue_band}</span>
              </div>
              <div style={fieldRowStyle}>
                <span style={fieldKeyStyle}>Funding</span>
                <span style={badgeStyle(selectedWinner.funding_status === "vc-backed" || selectedWinner.funding_status === "pe-backed" ? "indigo" : "green")}>
                  {selectedWinner.funding_status}
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
