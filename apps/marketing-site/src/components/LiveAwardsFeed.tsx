/**
 * Live awards feed — the right-side panel of the marketing hero.
 *
 * Cycles through a curated pool of realistic federal contract winners to
 * convey that GovtLeads is actively surfacing awards. v0 uses a placeholder
 * POOL constant; v2 will swap in a fetch against platform-api → data-engine-x.
 *
 * Design constraints (locked):
 *   - Container height is deterministic; never resizes when rows cycle.
 *   - Visible row count is FIXED at VISIBLE_ROWS.
 *   - Each row is FIXED height (truncate overflow). No content-driven reflow.
 *   - Rows swap content in place at CYCLE_INTERVAL_MS. The freshness label is
 *     bound to row POSITION (top = newest), not row identity, so a row that
 *     started at position 0 with "Just now" ages to "5m ago" as it shifts.
 *   - Subtle opacity transition on row contents only. No layout animation.
 */

import { useEffect, useState } from "react";

type WinnerRow = {
  id: string;
  entity: string;
  award: string;
  agency: string;
  amount: string;
  popState: string;
};

// Curated placeholder pool. Realistic federal contract winner shapes —
// entity names are synthetic, agency / NAICS / location pairings are
// plausible. Swap with real data via platform-api in v2.
const POOL: WinnerRow[] = [
  {
    id: "1",
    entity: "Vector Range Cyber LLC",
    award: "Cyber-mission planning support",
    agency: "USAF / AFLCMC",
    amount: "$4.2M",
    popState: "Hanscom, MA",
  },
  {
    id: "2",
    entity: "Atlas Logistics Group LLC",
    award: "Vehicle maintenance IDIQ",
    agency: "DLA Land & Maritime",
    amount: "$1.8M",
    popState: "Leavenworth, KS",
  },
  {
    id: "3",
    entity: "Beacon Federal Health Inc",
    award: "Telehealth platform expansion",
    agency: "VHA / VA Maryland",
    amount: "$7.3M",
    popState: "Baltimore, MD",
  },
  {
    id: "4",
    entity: "Ironwood Engineering Partners",
    award: "Pavement marking services BPA",
    agency: "FHWA OH Division",
    amount: "$3.1M",
    popState: "Columbus, OH",
  },
  {
    id: "5",
    entity: "Sentinel Tactical Outfitters",
    award: "Body armor procurement",
    agency: "DOD / DLA Troop Support",
    amount: "$12.4M",
    popState: "El Paso, TX",
  },
  {
    id: "6",
    entity: "Meridian Civil Works LLC",
    award: "Levee inspection IDIQ",
    agency: "USACE Vicksburg",
    amount: "$5.8M",
    popState: "Vicksburg, MS",
  },
  {
    id: "7",
    entity: "Crestline Cybersecurity Corp",
    award: "Endpoint threat detection",
    agency: "DHS / CISA",
    amount: "$9.2M",
    popState: "Arlington, VA",
  },
  {
    id: "8",
    entity: "Polaris Staffing Federal",
    award: "Administrative support BPA",
    agency: "GSA / FSS",
    amount: "$2.1M",
    popState: "Washington, DC",
  },
  {
    id: "9",
    entity: "Apex Facility Services LLC",
    award: "HVAC O&M services",
    agency: "VHA Pittsburgh",
    amount: "$1.6M",
    popState: "Pittsburgh, PA",
  },
  {
    id: "10",
    entity: "Cobalt Range Solutions",
    award: "Range maintenance services",
    agency: "USAF / Nellis AFB",
    amount: "$4.9M",
    popState: "Las Vegas, NV",
  },
  {
    id: "11",
    entity: "Northstar Health Sciences",
    award: "Medical staffing IDIQ",
    agency: "VHA Phoenix",
    amount: "$6.3M",
    popState: "Phoenix, AZ",
  },
  {
    id: "12",
    entity: "Granite Industrial Services",
    award: "Building demolition",
    agency: "USACE Sacramento",
    amount: "$8.7M",
    popState: "Sacramento, CA",
  },
  {
    id: "13",
    entity: "Trident Maritime Group",
    award: "Vessel maintenance contract",
    agency: "NAVSEA / NSY Norfolk",
    amount: "$14.2M",
    popState: "Portsmouth, VA",
  },
  {
    id: "14",
    entity: "Ascent Federal Software",
    award: "Cloud migration services",
    agency: "GSA / TTS",
    amount: "$5.6M",
    popState: "Washington, DC",
  },
  {
    id: "15",
    entity: "Foundry Defense Holdings",
    award: "Range target manufacturing",
    agency: "DOD / Army CCDC",
    amount: "$3.4M",
    popState: "White Sands, NM",
  },
];

const VISIBLE_ROWS = 5;
const CYCLE_INTERVAL_MS = 5000;

// Freshness labels by position. Position 0 = top (newest arrival).
// Rows age as they shift down.
const AGE_BY_POSITION = ["Just now", "5m ago", "12m ago", "21m ago", "32m ago"];

export function LiveAwardsFeed() {
  const [topIndex, setTopIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTopIndex((i) => (i + 1) % POOL.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const visible = Array.from(
    { length: VISIBLE_ROWS },
    (_, i) => POOL[(topIndex + i) % POOL.length]!,
  );

  return (
    <div className="flex flex-col border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-raised)]">
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-[color:var(--color-border-subtle)] px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-[color:var(--color-text-muted)] sm:text-[0.6875rem]">
          <span
            className="inline-block h-[6px] w-[6px] bg-[color:var(--color-state-success)]"
            aria-hidden
          />
          Live contract awards
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-[color:var(--color-state-success)]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--color-state-success)]" />
          Live
        </div>
      </div>

      {/* Rows — fixed positions, content swaps in place */}
      <div className="flex flex-col gap-2 p-3">
        {visible.map((row, i) => (
          <FeedRowView
            key={`pos-${i}`}
            row={row}
            ageLabel={AGE_BY_POSITION[i]!}
            isNewest={i === 0}
          />
        ))}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-sunken)]">
        <Stat value="324" label="awards today" />
        <Stat value="$487M" label="obligated" />
        <Stat value="41" label="agencies" />
      </div>
    </div>
  );
}

function FeedRowView({
  row,
  ageLabel,
  isNewest,
}: {
  row: WinnerRow;
  ageLabel: string;
  isNewest: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-3 border bg-[color:var(--color-surface-base)] px-3 py-2.5 transition-colors duration-500 ${
        isNewest
          ? "border-[color:var(--color-border-accent)]"
          : "border-[color:var(--color-border-subtle)]"
      }`}
      style={{ height: 72 }}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-[0.8125rem] font-medium leading-snug text-[color:var(--color-text-primary)] transition-opacity duration-500 sm:text-[0.875rem]">
          {row.entity}
        </div>
        <div className="mt-1 truncate font-mono text-[0.625rem] uppercase tracking-wider text-[color:var(--color-text-muted)] transition-opacity duration-500">
          <span className="text-[color:var(--color-text-default)]">{row.award}</span>
          <span className="text-[color:var(--color-text-subtle)]"> · </span>
          {row.agency}
          <span className="text-[color:var(--color-text-subtle)]"> · </span>
          <span className="tabular-nums text-[color:var(--color-text-accent)]">
            {row.amount}
          </span>
          <span className="text-[color:var(--color-text-subtle)]"> · </span>
          {row.popState}
        </div>
      </div>
      <div className="shrink-0 pt-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-[color:var(--color-text-subtle)] transition-opacity duration-500">
        {ageLabel}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-[color:var(--color-border-subtle)] px-4 py-4 text-center last:border-r-0">
      <div className="font-display text-[1.125rem] font-semibold tabular-nums text-[color:var(--color-text-primary)] sm:text-[1.25rem]">
        {value}
      </div>
      <div className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-[color:var(--color-text-subtle)]">
        {label}
      </div>
    </div>
  );
}
