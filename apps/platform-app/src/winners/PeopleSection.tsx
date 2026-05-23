/**
 * PeopleSection — drawer people list for a clicked winner.
 *
 * Renders inside [data-testid="winners-detail-drawer"], after firmographic-block.
 * Uses inline React.CSSProperties to match Winners.tsx style convention.
 *
 * Required data-testids (per contract.md):
 *   drawer-people-section          — wrapper
 *   person-row                     — each row
 *   person-full-name               — name span
 *   person-headline                — headline span
 *   person-current-role            — current role (job_title @ company)
 *   person-location                — city, state or country fallback
 *   person-linkedin-link           — <a target="_blank" rel="noopener">
 *   person-row-expanded-detail     — expansion block (always in DOM, toggled visible)
 *   person-experiences-timeline    — timeline in expansion
 *   person-education               — education in expansion
 *   person-skills                  — skills in expansion
 *   person-certifications          — certs in expansion
 */

import { useState } from "react";
import type { Person } from "../data/people-fixture";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrentRole(person: Person): string {
  const current = person.experiences.find((e) => e.job_is_current);
  if (!current) return "—";
  const title = current.job_title;
  const company = current.company_name;
  if (title && company) return `${title} @ ${company}`;
  if (company) return `at ${company}`;
  return "—";
}

function formatLocation(person: Person): string {
  const { city, state_code, country_code } = person.location;
  if (city && state_code) return `${city}, ${state_code}`;
  if (city) return city;
  if (state_code) return state_code;
  if (country_code) return country_code;
  return "—";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ── Styles ────────────────────────────────────────────────────────────────────

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

const emptyStateStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "var(--color-text-muted, #6b7280)",
  fontFamily: "monospace",
  padding: "10px 0",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "10px 0",
  borderBottom: "1px solid var(--color-border-subtle, #0f1623)",
  cursor: "pointer",
  width: "100%",
  background: "none",
  border: "none",
  textAlign: "left",
  color: "inherit",
  fontFamily: "inherit",
};

const avatarStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  minWidth: "36px",
  borderRadius: "50%",
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(34,197,94,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.65rem",
  fontFamily: "monospace",
  color: "var(--color-text-accent, #22c55e)",
  fontWeight: 600,
};

const nameStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 600,
  marginBottom: "2px",
  overflowWrap: "anywhere",
};

const subtextStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--color-text-muted, #9ca3af)",
  overflowWrap: "anywhere",
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 6px",
  borderRadius: "3px",
  fontSize: "0.65rem",
  fontFamily: "monospace",
  background: "rgba(34,197,94,0.08)",
  color: "var(--color-text-accent, #22c55e)",
  border: "1px solid rgba(34,197,94,0.2)",
  marginRight: "4px",
  marginBottom: "4px",
  overflowWrap: "anywhere",
};

const expandedBlockStyle = (visible: boolean): React.CSSProperties => ({
  display: visible ? "block" : "none",
  background: "rgba(255,255,255,0.02)",
  borderRadius: "4px",
  padding: "12px",
  marginTop: "4px",
  marginBottom: "8px",
});

const subSectionTitle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-text-muted, #6b7280)",
  marginBottom: "6px",
  marginTop: "10px",
};

// ── PersonRow ─────────────────────────────────────────────────────────────────

interface PersonRowProps {
  person: Person;
}

function PersonRow({ person }: PersonRowProps) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    setExpanded((v) => !v);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  const currentRole = formatCurrentRole(person);
  const location = formatLocation(person);
  const initials = getInitials(person.full_name);

  return (
    <div>
      <div
        data-testid="person-row"
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        style={rowStyle}
        aria-expanded={expanded}
      >
        {/* Avatar */}
        <div style={avatarStyle} aria-hidden="true">
          {person.profile_picture_url ? (
            <img
              src={person.profile_picture_url}
              alt=""
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            initials
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div data-testid="person-full-name" style={nameStyle}>
            {person.full_name}
          </div>
          <div data-testid="person-headline" style={{ ...subtextStyle, marginBottom: "3px" }}>
            {person.headline ?? "—"}
          </div>
          <div data-testid="person-current-role" style={{ ...subtextStyle, marginBottom: "3px" }}>
            {currentRole}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span data-testid="person-location" style={subtextStyle}>
              {location}
            </span>
            {person.linkedin_url && (
              <a
                data-testid="person-linkedin-link"
                href={person.linkedin_url}
                target="_blank"
                rel="noopener"
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  color: "var(--color-text-accent, #22c55e)",
                  textDecoration: "none",
                  border: "1px solid rgba(34,197,94,0.3)",
                  padding: "1px 5px",
                  borderRadius: "3px",
                }}
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>

        <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted, #6b7280)", paddingTop: "2px" }}>
          {expanded ? "▲" : "▼"}
        </div>
      </div>

      {/* Expanded detail block — always in DOM; toggled via display */}
      <div
        data-testid="person-row-expanded-detail"
        style={expandedBlockStyle(expanded)}
        aria-hidden={!expanded}
      >
        {/* Experiences timeline */}
        <div data-testid="person-experiences-timeline">
          <div style={subSectionTitle}>Experience</div>
          {person.experiences.length === 0 ? (
            <div style={subtextStyle}>No experience listed.</div>
          ) : (
            person.experiences.map((exp, i) => (
              <div
                key={i}
                style={{
                  padding: "6px 0",
                  borderLeft: "2px solid rgba(34,197,94,0.3)",
                  paddingLeft: "10px",
                  marginBottom: "6px",
                }}
              >
                <div style={{ fontSize: "0.8125rem", fontWeight: 500, overflowWrap: "anywhere" }}>
                  {exp.job_title ? `${exp.job_title} @ ${exp.company_name}` : `at ${exp.company_name}`}
                </div>
                <div style={subtextStyle}>
                  {exp.job_start_date ?? "?"} — {exp.job_is_current ? "Present" : (exp.job_end_date ?? "?")}
                </div>
                {exp.job_description && (
                  <div style={{ ...subtextStyle, marginTop: "3px", overflowWrap: "anywhere" }}>
                    {exp.job_description}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Education */}
        <div data-testid="person-education">
          <div style={subSectionTitle}>Education</div>
          {person.education.length === 0 ? (
            <div style={subtextStyle}>No education listed.</div>
          ) : (
            person.education.map((edu, i) => (
              <div key={i} style={{ ...subtextStyle, marginBottom: "3px", overflowWrap: "anywhere" }}>
                {edu.degree}
                {edu.start_date && edu.end_date && ` (${edu.start_date.slice(0, 4)}–${edu.end_date.slice(0, 4)})`}
              </div>
            ))
          )}
        </div>

        {/* Skills */}
        <div data-testid="person-skills">
          <div style={subSectionTitle}>Skills</div>
          {person.skills.length === 0 ? (
            <div style={subtextStyle}>No skills listed.</div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {person.skills.map((skill, i) => (
                <span key={i} style={tagStyle}>{skill}</span>
              ))}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div data-testid="person-certifications">
          <div style={subSectionTitle}>Certifications</div>
          {person.certifications.length === 0 ? (
            <div style={subtextStyle}>No certifications listed.</div>
          ) : (
            person.certifications.map((cert, i) => (
              <div key={i} style={{ ...subtextStyle, marginBottom: "4px" }}>
                <span style={{ color: "var(--color-text-default, #e5e7eb)", overflowWrap: "anywhere" }}>
                  {cert.name}
                </span>
                <span style={{ color: "var(--color-text-muted, #9ca3af)" }}> — {cert.authority}</span>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener"
                    style={{ fontSize: "0.65rem", color: "var(--color-text-accent, #22c55e)", marginLeft: "6px" }}
                  >
                    verify ↗
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── PeopleSection ─────────────────────────────────────────────────────────────

interface PeopleSectionProps {
  people: Person[];
}

export function PeopleSection({ people }: PeopleSectionProps) {
  return (
    <div data-testid="drawer-people-section">
      <div style={sectionTitleStyle}>People</div>
      {people.length === 0 ? (
        <div style={emptyStateStyle}>No verified contacts on file</div>
      ) : (
        people.map((person, i) => (
          <PersonRow key={`${person.linkedin_url}-${i}`} person={person} />
        ))
      )}
    </div>
  );
}
