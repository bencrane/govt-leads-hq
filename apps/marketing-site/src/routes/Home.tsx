import { HomeMap } from "@/components/HomeMap";
import { LiveAwardsFeed } from "@/components/LiveAwardsFeed";
import { Badge, Button } from "@govt-leads-hq/ui";
import { motion, useReducedMotion } from "framer-motion";

const NAV_LINKS = [
  { href: "#data", label: "The Feed" },
  { href: "#api", label: "API" },
  { href: "#pricing", label: "Pricing" },
  { href: "#sources", label: "Sources" },
];

const OPPORTUNITY_STATS = [
  {
    value: "$792.9B",
    label: "Obligated · 2025",
    lens: "The scale of the market your services can sell into.",
  },
  {
    value: "4,563",
    label: "Companies · receiving awards",
    lens: "The number of net-new accounts you could open this year.",
  },
  {
    value: "6,635,107",
    label: "Transactions · 2025",
    lens: "More than twelve fresh buying signals every minute.",
  },
  {
    value: "$2.17B",
    label: "Awarded · per day · average",
    lens: "Why this signal does not go stale by Tuesday.",
  },
];

const FEED_FIELDS = [
  {
    group: "Award",
    rows: [
      ["notice_id", "string", "SAM.gov solicitation / award ID"],
      ["title", "string", "Award title"],
      ["type", "enum", "award · solicitation · combined-synopsis"],
      ["amount_usd", "number", "Obligated amount"],
      ["agency", "string", "Contracting department / sub-agency"],
      ["posted_at", "datetime", "Posting timestamp (UTC)"],
      ["naics", "string", "Primary NAICS code"],
      ["psc", "string", "Product / Service code"],
      ["set_aside", "enum", "8(a) · SDVOSB · WOSB · HUBZone · …"],
      ["pop_state", "string", "Place of performance"],
    ],
  },
  {
    group: "Entity",
    rows: [
      ["uei", "string", "Unique Entity ID (sam.gov)"],
      ["name", "string", "Legal entity name"],
      ["website", "string", "Primary domain"],
      ["address", "object", "Physical HQ"],
      ["industry", "string", "NAICS-mapped sector"],
      ["employee_range", "string", "Firmographic band"],
      ["revenue_estimate", "number", "Annual revenue estimate (USD)"],
    ],
  },
  {
    group: "Contacts",
    rows: [
      ["people[]", "array", "Verified contacts at the entity"],
      ["people[].name", "string", "Full name"],
      ["people[].title", "string", "Role / title"],
      ["people[].email", "string", "Verified business email"],
      ["people[].mobile", "string", "Mobile phone (where available)"],
    ],
  },
];

const USE_CASES = [
  {
    code: "01",
    who: "Outbound agencies",
    pitch:
      "Build campaigns the morning after an award drops. Pitch staffing, payroll, IT, capital, professional services into entities with fresh budget.",
  },
  {
    code: "02",
    who: "Growth teams selling into govcon",
    pitch:
      "Stop scraping SAM.gov. Pipe verified winners + decision-makers into your CRM, sequenced by NAICS, set-aside, or place of performance.",
  },
  {
    code: "03",
    who: "Lenders, capital, factoring",
    pitch:
      "An award is a financeable receivable. Route winners by obligation size and agency directly to credit underwriters.",
  },
  {
    code: "04",
    who: "Vendors of small-business services",
    pitch:
      "Insurance, compliance, certifications, GovCon-specific tooling — sell to the entities just entering the contract lifecycle.",
  },
];

const TIERS = [
  {
    code: "I",
    name: "Starter",
    price: "$399",
    cadence: "per month",
    summary: "The 30-day winners feed.",
    includes: [
      "Last 30 days of SAM.gov award winners",
      "Award detail — NAICS, PSC, set-aside, period of performance",
      "Entity firmographics — name, site, address, industry, revenue band",
      "JSON REST API + CSV export + webhook",
      "Unlimited queries, unlimited exports",
    ],
    cta: "Start with Starter",
  },
  {
    code: "II",
    name: "Growth",
    price: "$499",
    cadence: "per month",
    summary: "Add the decision-makers.",
    includes: [
      "Everything in Starter",
      "Unlimited verified contacts per company",
      "Filter contacts by role, seniority, department",
      "Verified business email addresses",
      "Decision-maker enrichment via BlitzAPI",
      "New-winner webhook within 6 hours of posting",
    ],
    cta: "Start with Growth",
    featured: true,
  },
  {
    code: "III",
    name: "Advanced",
    price: "$599",
    cadence: "per month",
    summary: "Add mobile phones.",
    includes: [
      "Everything in Growth",
      "Mobile phone numbers where available",
      "Direct-dial coverage on majority of contacts",
      "Contact intent signals — role changes, web activity",
      "Same-hour webhook delivery",
      "Bulk contact append for existing CRM records",
      "Priority email support — same-day response",
    ],
    cta: "Start with Advanced",
  },
  {
    code: "IV",
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    summary: "The full historical archive.",
    includes: [
      "Everything in Advanced",
      "Full historical archive — 20+ years of award data",
      "Bulk delivery — S3, Snowflake, BigQuery, Postgres",
      "Custom NAICS / PSC / agency segmentation",
      "Dedicated infrastructure + SLA",
      "White-glove onboarding + custom data joins",
      "Quarterly review with the founders",
      "Custom contract terms",
    ],
    cta: "Talk to founder",
  },
];

const SOURCES = [
  { id: "SAM.GOV", desc: "Federal contract opportunity & award postings" },
  { id: "USASPENDING", desc: "Federal spending obligations & sub-awards" },
  { id: "FPDS", desc: "Federal Procurement Data System — award records" },
  { id: "SBA", desc: "Small-business contracting awards & set-aside data" },
  { id: "GSA", desc: "GSA Schedules & multiple-award contract vehicles" },
  { id: "BLITZAPI", desc: "Contact enrichment — emails, mobile, firmographics" },
];

export default function Home() {
  const reduced = !!useReducedMotion();

  return (
    <main className="bg-[color:var(--color-surface-base)] text-[color:var(--color-text-default)]">
      {/* ── Sticky nav ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-overlay)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3 sm:px-10">
          <a
            href="#top"
            className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-[color:var(--color-text-primary)]"
          >
            GOVT&nbsp;LEADS
            <span className="ml-2 text-[color:var(--color-text-subtle)]">/ API</span>
          </a>
          <nav className="hidden gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button variant="primary" size="sm">
              Get API key
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative flex min-h-screen w-full items-center overflow-hidden border-b border-[color:var(--color-border-subtle)]"
      >
        <HomeMap />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left column — copy + CTAs */}
            <div className="lg:col-span-6">
              <div className="mb-6 font-mono text-[0.625rem] uppercase tracking-[0.28em] text-[color:var(--color-text-accent)]">
                // GOVT CONTRACT WINNERS · API-FIRST
              </div>

              <h1 className="font-display text-[2.25rem] font-medium leading-[1.04] tracking-[-0.025em] text-[color:var(--color-text-primary)] sm:text-[2.75rem] md:text-[3.25rem]">
                {reduced ? (
                  <>
                    <span className="block">Every Government Contract Creates Two Things:</span>
                    <span className="block text-[color:var(--color-text-accent)]">
                      A Buyer With Money and a Deadline They Need to Hit.
                    </span>
                  </>
                ) : (
                  <span className="grid">
                    <motion.span
                      className="col-start-1 row-start-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        times: [0, 0.18, 0.7, 0.95],
                        duration: 3.2,
                        ease: "easeInOut",
                      }}
                    >
                      Every Government Contract Creates Two Things:
                    </motion.span>
                    <motion.span
                      className="col-start-1 row-start-1 text-[color:var(--color-text-accent)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7, delay: 2.7, ease: "easeOut" }}
                    >
                      A Buyer With Money and a Deadline They Need to Hit.
                    </motion.span>
                  </span>
                )}
              </h1>

              <p className="mt-7 max-w-[580px] text-[1rem] leading-[1.6] text-[color:var(--color-text-default)] sm:text-[1.0625rem]">
                Every day, hundreds of millions of dollars are awarded to U.S. companies
                to perform work for the government. Building roads. Wiring up bases.
                Hauling cargo. Securing networks. Repairing dams. Training the workforce.
              </p>
              <p className="mt-4 max-w-[580px] text-[1rem] leading-[1.6] text-[color:var(--color-text-default)]">
                It's a windfall — until the winning company realizes they need to hire
                talent, re-examine their insurance and bonding, revisit their compliance
                posture, and stand up the IT and security systems the contract demands.
              </p>
              <p className="mt-6 max-w-[580px] text-[1.0625rem] font-medium leading-[1.5] text-[color:var(--color-text-primary)]">
                That's where you come in.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="primary" size="md">
                  Get an API key — $399 / mo
                </Button>
                <Button variant="secondary" size="md">
                  View docs
                </Button>
              </div>
            </div>

            {/* Right column — live feed */}
            <div className="lg:col-span-6">
              <LiveAwardsFeed />
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-6 z-10 hidden font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-[color:var(--color-text-subtle)] sm:block">
          DOC · GL-001 / REV A · 21 MAY 2026
        </div>
      </section>

      {/* ── § 01 — The opportunity, in four numbers ───────────────────── */}
      <Section
        id="opportunity"
        code="§ 01"
        title="The Opportunity, in Four Numbers."
      >
        <p className="mb-12 max-w-[760px] text-[1.0625rem] leading-[1.6] text-[color:var(--color-text-default)] sm:text-[1.125rem]">
          A federal contract is not a one-time event. Each one starts months of vendor
          spending — staffing, payroll, IT, services — and that means weeks of buying
          signals for anyone selling into the winner. Here's a year of them.
        </p>

        <div className="grid gap-px border border-[color:var(--color-border-default)] bg-[color:var(--color-border-default)] md:grid-cols-2 lg:grid-cols-4">
          {OPPORTUNITY_STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col bg-[color:var(--color-surface-raised)] px-6 py-8 sm:px-7 sm:py-10"
            >
              <div className="font-display text-[2.5rem] font-semibold tabular-nums leading-[1.05] text-[color:var(--color-text-primary)] sm:text-[3rem]">
                {s.value}
              </div>
              <div className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[color:var(--color-text-accent)]">
                {s.label}
              </div>
              <div className="mt-5 text-[0.875rem] leading-[1.5] text-[color:var(--color-text-muted)]">
                {s.lens}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-[760px] text-[1.0625rem] leading-[1.55] text-[color:var(--color-text-primary)] sm:text-[1.125rem]">
          These aren't abstractions. Each transaction is a winner about to spend.
          GovtLeads makes them addressable the morning after the award.
        </p>
      </Section>

      {/* ── § 02 — The problem ────────────────────────────────────────── */}
      <Section id="why" code="§ 02" title="Every contract award is a buying signal.">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-[1.0625rem] leading-[1.6] text-[color:var(--color-text-default)] sm:text-[1.1875rem]">
              The day a federal contract is awarded, the winning company's operating plan
              reshuffles. Within 30 days they are hiring. They are reviewing insurance and
              bonding capacity. They are expanding payroll, vetting IT and compliance
              vendors, sizing working-capital lines, and lining up professional-services
              support. Every line item in the award has a vendor on the other side ready to
              sell into it.
            </p>
            <p className="mt-6 text-[1rem] leading-[1.65] text-[color:var(--color-text-muted)]">
              The existing govcon-data market doesn't deliver this signal to vendors.
              GovTribe charges $1,600/mo for ~3,500 capped records — no API, no export.
              GovWin IQ is multi-thousand annual — no API, no export. Raw FPDS and SAM.gov
              are a firehose with no entity enrichment and no contacts. None were built for
              the people selling into winners.
            </p>
            <p className="mt-6 text-[1rem] leading-[1.65] text-[color:var(--color-text-default)]">
              GovtLeads is the first feed built for the seller. Every winner, the morning
              after the award. With firmographics, decision-makers, and verified email. As
              an API.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-raised)]">
              <div className="border-b border-[color:var(--color-border-subtle)] px-5 py-3 font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-[color:var(--color-text-subtle)]">
                Comparison · monthly · entry tier
              </div>
              <div className="divide-y divide-[color:var(--color-border-subtle)]">
                {[
                  ["GovTribe", "$1,600 / mo", "~3,500 records · no API · no export"],
                  ["GovWin IQ", "$2,500+ / mo", "Annual contract · no API · no export"],
                  ["FPDS / SAM.gov", "Free", "Raw firehose · no enrichment · no contacts"],
                  ["GovtLeads", "$399 / mo", "Full API · CSV export · contacts unlocked"],
                ].map(([name, price, detail], i) => (
                  <div
                    key={String(name)}
                    className={`grid grid-cols-12 gap-3 px-5 py-3 ${
                      i === 3 ? "bg-[color:var(--color-accent-soft)]" : ""
                    }`}
                  >
                    <div className="col-span-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[color:var(--color-text-primary)]">
                      {name}
                    </div>
                    <div className="col-span-3 font-mono text-[0.6875rem] tabular-nums text-[color:var(--color-text-default)]">
                      {price}
                    </div>
                    <div className="col-span-5 text-[0.75rem] leading-[1.4] text-[color:var(--color-text-muted)]">
                      {detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── § 03 — The feed ───────────────────────────────────────────── */}
      <Section id="data" code="§ 03" title="Every winner, every field. As JSON.">
        <p className="mb-12 max-w-[720px] text-[1rem] leading-[1.65] text-[color:var(--color-text-default)]">
          Each record is three layers stitched together: the SAM.gov award itself, the
          winning entity's firmographics, and verified contacts at the entity. Returned as
          JSON, exportable as CSV, pushed by webhook when fresh. No record caps. No
          per-query metering.
        </p>

        <div className="grid gap-px border border-[color:var(--color-border-default)] bg-[color:var(--color-border-default)] md:grid-cols-3">
          {FEED_FIELDS.map((g) => (
            <div key={g.group} className="bg-[color:var(--color-surface-raised)]">
              <div className="border-b border-[color:var(--color-border-subtle)] px-5 py-3">
                <Badge tone="accent">{g.group}</Badge>
              </div>
              <table className="w-full">
                <tbody>
                  {g.rows.map(([k, t, d]) => (
                    <tr
                      key={k}
                      className="border-b border-[color:var(--color-border-subtle)] last:border-b-0"
                    >
                      <td className="px-5 py-2.5 align-top font-mono text-[0.75rem] text-[color:var(--color-text-primary)]">
                        {k}
                      </td>
                      <td className="py-2.5 pr-2 align-top font-mono text-[0.6875rem] text-[color:var(--color-text-subtle)]">
                        {t}
                      </td>
                      <td className="py-2.5 pl-2 pr-5 align-top text-[0.75rem] leading-[1.4] text-[color:var(--color-text-muted)]">
                        {d}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </Section>

      {/* ── § 04 — API in action ──────────────────────────────────────── */}
      <Section id="api" code="§ 04" title="Five lines to your first record.">
        <p className="mb-10 max-w-[720px] text-[1rem] leading-[1.65] text-[color:var(--color-text-default)]">
          REST + JSON. One endpoint per record type, cursor-paginated, filterable by date,
          agency, NAICS, set-aside, and place of performance. Hit it with curl, any HTTP
          client, any language. In your CRM the same hour.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <CodePane label="Request · curl">
            {`curl https://api.govtleads.com/v1/awards \\
  -G \\
  -H "Authorization: Bearer $GL_API_KEY" \\
  -d "since=2026-05-15" \\
  -d "naics=541512" \\
  -d "set_aside=SDVOSB" \\
  -d "limit=25"`}
          </CodePane>

          <CodePane label="Response · 200 OK">
            {`{
  "data": [
    {
      "notice_id": "FA8771-26-Q-0042",
      "title": "Cyber-mission planning support",
      "amount_usd": 4275000,
      "agency": "Department of Defense / Air Force",
      "naics": "541512",
      "set_aside": "SDVOSB",
      "pop_state": "VA",
      "posted_at": "2026-05-19T13:04:00Z",
      "entity": {
        "uei": "JX7P9KQN4LM2",
        "name": "Vector Range Cyber LLC",
        "website": "vectorrange.io",
        "industry": "Computer systems design"
      },
      "people": [
        { "name": "M. Halloran",
          "title": "VP Capture",
          "email": "m.halloran@vectorrange.io" }
      ]
    }
    // … 24 more
  ],
  "next_cursor": "eyJvZmZzZXQiOjI1fQ"
}`}
          </CodePane>
        </div>
      </Section>

      {/* ── § 05 — Use cases ──────────────────────────────────────────── */}
      <Section id="use-cases" code="§ 05" title="Who sells into winners.">
        <p className="mb-12 max-w-[720px] text-[1rem] leading-[1.65] text-[color:var(--color-text-default)]">
          If you sell staffing, payroll, insurance, IT, compliance, capital, or
          professional services — a fresh federal contract winner is the highest-conviction
          lead in your funnel. They have budget, they have a deadline, and they need
          vendors.
        </p>

        <div className="grid gap-px border border-[color:var(--color-border-default)] bg-[color:var(--color-border-default)] md:grid-cols-2">
          {USE_CASES.map((u) => (
            <div
              key={u.code}
              className="flex flex-col gap-3 bg-[color:var(--color-surface-raised)] px-6 py-7 sm:px-8 sm:py-9"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-[color:var(--color-text-accent)]">
                  USE {u.code}
                </span>
                <span className="h-px flex-1 bg-[color:var(--color-border-subtle)]" />
              </div>
              <h3 className="font-display text-[1.25rem] font-semibold leading-[1.2] text-[color:var(--color-text-primary)]">
                {u.who}
              </h3>
              <p className="text-[0.9375rem] leading-[1.55] text-[color:var(--color-text-muted)]">
                {u.pitch}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── § 06 — Pricing ────────────────────────────────────────────── */}
      <Section id="pricing" code="§ 06" title="One flat rate. Unlimited records.">
        <p className="mb-10 max-w-[720px] text-[1rem] leading-[1.65] text-[color:var(--color-text-default)]">
          No record caps. No per-query metering. No surprise overage. Pay annually and a
          rolling 90-day historical window unlocks inside the subscription year.
        </p>

        <div className="grid gap-px border border-[color:var(--color-border-default)] bg-[color:var(--color-border-default)] md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <div
              key={t.code}
              className={`flex flex-col bg-[color:var(--color-surface-raised)] px-6 py-7 sm:px-7 ${
                t.featured ? "ring-1 ring-inset ring-[color:var(--color-accent-primary)]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.24em] text-[color:var(--color-text-subtle)]">
                  TIER · {t.code}
                </span>
                {t.featured && <Badge tone="accent">Most popular</Badge>}
              </div>
              <h3 className="mt-4 font-display text-[1.5rem] font-semibold text-[color:var(--color-text-primary)]">
                {t.name}
              </h3>
              <p className="mt-1 text-[0.8125rem] leading-[1.5] text-[color:var(--color-text-muted)]">
                {t.summary}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-[2.25rem] font-semibold tabular-nums text-[color:var(--color-text-primary)]">
                  {t.price}
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">
                  {t.cadence}
                </span>
              </div>

              <ul className="mt-6 space-y-2 text-[0.8125rem] leading-[1.5] text-[color:var(--color-text-default)]">
                {t.includes.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span
                      className="mt-1.5 inline-block h-[3px] w-[3px] flex-none bg-[color:var(--color-text-accent)]"
                      aria-hidden
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <Button
                  variant={t.featured ? "primary" : "secondary"}
                  size="sm"
                  className="w-full"
                >
                  {t.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-[680px] text-[0.8125rem] leading-[1.55] text-[color:var(--color-text-subtle)]">
          All plans: unlimited queries · unlimited exports · webhook delivery · all U.S.
          federal departments and agencies · 7-day refund. Enterprise prices on
          conversation; annual delivery to S3 / Snowflake / BigQuery / Postgres.
        </p>
      </Section>

      {/* ── § 07 — Sources ────────────────────────────────────────────── */}
      <Section id="sources" code="§ 07" title="Where the data comes from.">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-[1rem] leading-[1.65] text-[color:var(--color-text-default)]">
              Ingest runs nightly against the primary federal procurement registries. Every
              award notice is reconciled against entity registries and enriched with
              firmographic + contact data before it hits the API.
            </p>
            <p className="mt-5 text-[0.9375rem] leading-[1.65] text-[color:var(--color-text-muted)]">
              No scraping of paywalled platforms. No reseller licenses. Direct from the
              source. The historical archive reaches back two decades and continues to
              extend.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="border border-[color:var(--color-border-default)]">
              {SOURCES.map((s, i) => (
                <div
                  key={s.id}
                  className={`grid grid-cols-12 gap-3 px-5 py-3 ${
                    i !== SOURCES.length - 1
                      ? "border-b border-[color:var(--color-border-subtle)]"
                      : ""
                  }`}
                >
                  <div className="col-span-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[color:var(--color-text-primary)]">
                    {s.id}
                  </div>
                  <div className="col-span-8 text-[0.75rem] leading-[1.4] text-[color:var(--color-text-muted)]">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-5 font-mono text-[0.625rem] uppercase tracking-[0.28em] text-[color:var(--color-text-accent)]">
            GET STARTED · § GL-001
          </div>
          <h2 className="font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-[color:var(--color-text-primary)] sm:text-[2.75rem]">
            Start selling into winners next week.{" "}
            <span className="text-[color:var(--color-text-accent)]">$399 a month.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[520px] text-[1rem] leading-[1.6] text-[color:var(--color-text-default)]">
            Buy a key. Hit the endpoint. Get 30 days of winners — with the people inside —
            in your CRM the same hour. Cancel inside the first week if it doesn't pay for
            itself in pipeline. We refund.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="md">
              Get an API key
            </Button>
            <Button variant="secondary" size="md">
              Talk to founder
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-[color:var(--color-border-subtle)] px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-[color:var(--color-text-primary)]">
              GOVT&nbsp;LEADS / API
            </div>
            <div className="mt-2 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">
              Issued · 21 MAY 2026 · DOC GL-001 / REV A
            </div>
          </div>
          <nav className="flex flex-wrap gap-6">
            {[
              ["Docs", "#"],
              ["Pricing", "#pricing"],
              ["Status", "#"],
              ["Contact", "#"],
              ["Terms", "#"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}

// ────────────────────────── Local components ──────────────────────────

function Section({
  id,
  code,
  title,
  children,
}: {
  id: string;
  code: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-[color:var(--color-border-subtle)] px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 max-w-[800px]">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.28em] text-[color:var(--color-text-accent)]">
            {code}
          </div>
          <h2 className="mt-3 font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-[color:var(--color-text-primary)] sm:text-[2.75rem]">
            {title}
          </h2>
          <div className="mt-6 h-px w-full bg-[color:var(--color-border-default)]" />
        </div>
        {children}
      </div>
    </section>
  );
}

function CodePane({ label, children }: { label: string; children: string }) {
  return (
    <div className="border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-sunken)]">
      <div className="flex items-center justify-between border-b border-[color:var(--color-border-subtle)] px-4 py-2.5">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-[color:var(--color-text-subtle)]">
          {label}
        </span>
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-[color:var(--color-text-subtle)]">
          ⏎
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.75rem] leading-[1.55] text-[color:var(--color-text-default)]">
        <code>{children}</code>
      </pre>
    </div>
  );
}
