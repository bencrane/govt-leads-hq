/**
 * PeopleSection — drawer people list, composed on @govt-leads-hq/ui
 * primitives. Preserves the e2e testid contract verbatim.
 *
 * Structural invariant: `person-row-expanded-detail` is a DOM sibling of
 * `person-row`, sharing one parent div — the spec walks
 * `person-row.locator("..")` down to expanded-detail.
 */

import { useState } from "react";
import type { Person } from "../data/people-fixture";
import { Avatar, Badge, Inline, SectionLabel, Stack, Text } from "@govt-leads-hq/ui";

const TEXT_MUTED = "text-body-xs text-[color:var(--color-text-muted)]";
const BREAK = "break-words";

function formatCurrentRole(p: Person): string {
  const cur = p.experiences.find((e) => e.job_is_current);
  if (!cur) return "—";
  if (cur.job_title && cur.company_name) return `${cur.job_title} @ ${cur.company_name}`;
  if (cur.company_name) return `at ${cur.company_name}`;
  return "—";
}

function formatLocation(p: Person): string {
  const { city, state_code, country_code } = p.location;
  if (city && state_code) return `${city}, ${state_code}`;
  return city || state_code || country_code || "—";
}

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function SubSection({ testId, index, title, empty, children }: { testId: string; index: number; title: string; empty: string; children?: React.ReactNode }) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);
  return (
    <div data-testid={testId}>
      <SectionLabel index={index}>{title}</SectionLabel>
      {isEmpty ? <Text size="body-xs" color="muted" className="mt-2">{empty}</Text> : children}
    </div>
  );
}

function PersonRow({ person }: { person: Person }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-[color:var(--color-border-subtle)] last:border-b-0">
      <button
        type="button"
        data-testid="person-row"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-3 py-3 text-left"
      >
        <Avatar
          src={person.profile_picture_url ?? undefined}
          alt={person.full_name}
          initials={getInitials(person.full_name)}
          size="md"
          rounded
        />
        <Stack gap="1" unsafe_className="min-w-0 flex-1">
          <span data-testid="person-full-name" className={`text-body-sm font-semibold text-[color:var(--color-text-strong)] ${BREAK}`}>{person.full_name}</span>
          <span data-testid="person-headline" className={`${TEXT_MUTED} ${BREAK}`}>{person.headline ?? "—"}</span>
          <span data-testid="person-current-role" className={`${TEXT_MUTED} ${BREAK}`}>{formatCurrentRole(person)}</span>
          <Inline gap="2" align="center" wrap>
            <span data-testid="person-location" className={TEXT_MUTED}>{formatLocation(person)}</span>
            {person.linkedin_url ? (
              // biome-ignore lint/a11y/noBlankTarget: rel="noopener" matches the e2e spec assertion; adding "noreferrer" would break it
              <a
                data-testid="person-linkedin-link"
                href={person.linkedin_url}
                target="_blank"
                rel="noopener"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center rounded-none border border-[color:var(--color-border-accent)] px-1.5 py-0.5 font-mono text-mono-xs uppercase text-[color:var(--color-text-accent)]"
              >
                LinkedIn ↗
              </a>
            ) : null}
          </Inline>
        </Stack>
        <span aria-hidden className="pt-0.5 font-mono text-mono-xs text-[color:var(--color-text-muted)]">{expanded ? "▲" : "▼"}</span>
      </button>

      <div
        data-testid="person-row-expanded-detail"
        aria-hidden={!expanded}
        className={expanded ? "flex flex-col gap-4 bg-[color:var(--color-surface-sunken)] p-3 mb-2" : "hidden"}
      >
        <SubSection testId="person-experiences-timeline" index={1} title="Experience" empty="No experience listed.">
          {person.experiences.length > 0 ? (
            <Stack gap="2" unsafe_className="mt-2">
              {person.experiences.map((exp) => (
                <div
                  key={`${exp.company_name}-${exp.job_start_date ?? "?"}-${exp.job_title ?? ""}`}
                  className="border-l-2 border-[color:var(--color-border-accent)] pl-3"
                >
                  <div className={`text-body-sm font-medium text-[color:var(--color-text-strong)] ${BREAK}`}>
                    {exp.job_title ? `${exp.job_title} @ ${exp.company_name}` : `at ${exp.company_name}`}
                  </div>
                  <div className="font-mono text-mono-xs text-[color:var(--color-text-muted)]">
                    {exp.job_start_date ?? "?"} — {exp.job_is_current ? "Present" : (exp.job_end_date ?? "?")}
                  </div>
                  {exp.job_description ? <div className={`mt-1 ${TEXT_MUTED} ${BREAK}`}>{exp.job_description}</div> : null}
                </div>
              ))}
            </Stack>
          ) : null}
        </SubSection>

        <SubSection testId="person-education" index={2} title="Education" empty="No education listed.">
          {person.education.length > 0 ? (
            <Stack gap="1" unsafe_className="mt-2">
              {person.education.map((edu) => (
                <div key={`${edu.degree}-${edu.start_date ?? "?"}`} className={`${TEXT_MUTED} ${BREAK}`}>
                  {edu.degree}
                  {edu.start_date && edu.end_date ? ` (${edu.start_date.slice(0, 4)}–${edu.end_date.slice(0, 4)})` : null}
                </div>
              ))}
            </Stack>
          ) : null}
        </SubSection>

        <SubSection testId="person-skills" index={3} title="Skills" empty="No skills listed.">
          {person.skills.length > 0 ? (
            <Inline gap="1" wrap unsafe_className="mt-2">
              {person.skills.map((skill) => <Badge key={skill} tone="accent">{skill}</Badge>)}
            </Inline>
          ) : null}
        </SubSection>

        <SubSection testId="person-certifications" index={4} title="Certifications" empty="No certifications listed.">
          {person.certifications.length > 0 ? (
            <Stack gap="1" unsafe_className="mt-2">
              {person.certifications.map((cert) => (
                <div key={`${cert.name}-${cert.authority}`} className={`text-body-xs ${BREAK}`}>
                  <span className="text-[color:var(--color-text-strong)]">{cert.name}</span>
                  <span className="text-[color:var(--color-text-muted)]"> — {cert.authority}</span>
                  {cert.url ? (
                    // biome-ignore lint/a11y/noBlankTarget: house policy mirrors LinkedIn link rel pattern
                    <a href={cert.url} target="_blank" rel="noopener" className="ml-1 font-mono text-mono-xs text-[color:var(--color-text-accent)]">verify ↗</a>
                  ) : null}
                </div>
              ))}
            </Stack>
          ) : null}
        </SubSection>
      </div>
    </div>
  );
}

export function PeopleSection({ people }: { people: Person[] }) {
  return (
    <div data-testid="drawer-people-section" className="flex flex-col gap-3">
      <SectionLabel index={3}>People</SectionLabel>
      {people.length === 0 ? (
        <Text size="body-sm" color="muted" mono>No verified contacts on file</Text>
      ) : (
        <Stack gap="0">
          {people.map((person) => <PersonRow key={person.linkedin_url ?? person.full_name} person={person} />)}
        </Stack>
      )}
    </div>
  );
}
