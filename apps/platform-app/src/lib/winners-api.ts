/**
 * winners-api.ts — BFF abstraction for the 30-day winners browser.
 *
 * Today: reads from local fixture. Single swap-point when a real backend
 * endpoint (/api/v1/govcontracts/companies/winners-30d) lands. Only this
 * file changes — the UI components depend on WinnersFilters + WinnersResult,
 * not on the transport.
 *
 * Filter dimensions:
 *   Covered by data-engine-x today: naics_code, pop_state, date range
 *   Backend-gapped (fixture-only): set_aside_code, top_agency, keyword,
 *     employee_band, revenue_band, funding_status, founded_year_min/max,
 *     award_amount_min/max
 *
 * Follow-up directives required before wiring a real endpoint:
 *   - Extend CompanyGrainBaseFilters with set_aside_code,
 *     awarding_agency_name, awarding_sub_agency_name, keyword.
 *   - Firmographic enrichment data pipeline (employee_band, revenue_band,
 *     funding_status, founded_year).
 */

import type { EmployeeBand, FundingStatus, RevenueBand, Winner } from "../data/winners-fixture";
import { WINNERS_FIXTURE } from "../data/winners-fixture";

/** All 12 filter dimensions from the operator brief. */
export interface WinnersFilters {
  naics?: string; // prefix-match (e.g. "541" matches all 541xxx)
  award_amount_min?: number;
  award_amount_max?: number;
  pop_state?: string[]; // multi-select; empty means all
  set_aside?: string[]; // multi-select
  agency?: string; // partial match on top_agency
  date_from?: string; // ISO date
  date_to?: string; // ISO date
  keyword?: string; // keyword search on award_title + award_description
  employee_band?: EmployeeBand[];
  revenue_band?: RevenueBand[];
  funding_status?: FundingStatus[];
  founded_year_min?: number;
  founded_year_max?: number;
}

export interface WinnersResult {
  rows: Winner[];
  total: number;
}

export type SortField = "total_obligation_30d" | "latest_contract_date" | "company_name";
export type SortDir = "asc" | "desc";

export interface WinnersQuery {
  filters: WinnersFilters;
  sort_field?: SortField;
  sort_dir?: SortDir;
  page?: number;
  page_size?: number;
}

/** Apply a filter to the fixture data and return paginated results. */
export function fetchWinners30d(query: WinnersQuery): WinnersResult {
  const { filters, sort_field = "total_obligation_30d", sort_dir = "desc", page = 0, page_size = 25 } = query;

  let rows = [...WINNERS_FIXTURE];

  // naics prefix match
  if (filters.naics) {
    const prefix = filters.naics.trim();
    rows = rows.filter((r) => r.naics_code.startsWith(prefix));
  }

  // award amount range
  if (filters.award_amount_min != null) {
    rows = rows.filter((r) => r.total_obligation_30d >= (filters.award_amount_min ?? 0));
  }
  if (filters.award_amount_max != null) {
    rows = rows.filter((r) => r.total_obligation_30d <= (filters.award_amount_max ?? Infinity));
  }

  // pop state multi-select
  if (filters.pop_state && filters.pop_state.length > 0) {
    rows = rows.filter((r) => filters.pop_state!.includes(r.performance_state));
  }

  // set aside multi-select
  if (filters.set_aside && filters.set_aside.length > 0) {
    rows = rows.filter((r) => filters.set_aside!.includes(r.set_aside_code));
  }

  // agency partial match
  if (filters.agency) {
    const lower = filters.agency.toLowerCase();
    rows = rows.filter((r) => r.top_agency.toLowerCase().includes(lower));
  }

  // date range
  if (filters.date_from) {
    rows = rows.filter((r) => r.latest_contract_date >= filters.date_from!);
  }
  if (filters.date_to) {
    rows = rows.filter((r) => r.latest_contract_date <= filters.date_to!);
  }

  // keyword search over award_title + award_description
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.award_title.toLowerCase().includes(kw) ||
        r.award_description.toLowerCase().includes(kw),
    );
  }

  // firmographic filters
  if (filters.employee_band && filters.employee_band.length > 0) {
    rows = rows.filter((r) => filters.employee_band!.includes(r.employee_band));
  }
  if (filters.revenue_band && filters.revenue_band.length > 0) {
    rows = rows.filter((r) => filters.revenue_band!.includes(r.revenue_band));
  }
  if (filters.funding_status && filters.funding_status.length > 0) {
    rows = rows.filter((r) => filters.funding_status!.includes(r.funding_status));
  }
  if (filters.founded_year_min != null) {
    rows = rows.filter((r) => r.founded_year >= (filters.founded_year_min ?? 0));
  }
  if (filters.founded_year_max != null) {
    rows = rows.filter((r) => r.founded_year <= (filters.founded_year_max ?? 9999));
  }

  // sort
  rows.sort((a, b) => {
    let cmp = 0;
    if (sort_field === "total_obligation_30d") {
      cmp = a.total_obligation_30d - b.total_obligation_30d;
    } else if (sort_field === "latest_contract_date") {
      cmp = a.latest_contract_date.localeCompare(b.latest_contract_date);
    } else if (sort_field === "company_name") {
      cmp = a.company_name.localeCompare(b.company_name);
    }
    return sort_dir === "asc" ? cmp : -cmp;
  });

  const total = rows.length;
  const start = page * page_size;
  const paged = rows.slice(start, start + page_size);

  return { rows: paged, total };
}

/** Generate CSV string from Winner rows using the canonical table column set. */
export function winnersToCSV(rows: Winner[]): string {
  const HEADER = "entity_name,obligation_30d,agency,naics_code,perf_state,latest_contract_date";
  const lines = rows.map((r) =>
    [
      `"${r.company_name.replace(/"/g, '""')}"`,
      r.total_obligation_30d,
      `"${r.top_agency.replace(/"/g, '""')}"`,
      r.naics_code,
      r.performance_state,
      r.latest_contract_date,
    ].join(","),
  );
  return [HEADER, ...lines].join("\n");
}

export const CSV_HEADER = "entity_name,obligation_30d,agency,naics_code,perf_state,latest_contract_date";
