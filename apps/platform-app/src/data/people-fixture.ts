/**
 * people-fixture.ts — local fixture for people associated with contract winners.
 *
 * Shape mirrors BlitzAPI find-people response. When BlitzAPI is live, only the
 * data layer changes — Person type and PEOPLE_BY_UEI export stay identical.
 *
 * Exports:
 *   Person          — TypeScript type matching BlitzAPI find-people shape
 *   PEOPLE_FIXTURE  — flat array of all people (≥80)
 *   PEOPLE_BY_UEI   — Record<recipient_uei, Person[]>
 *   getPeopleByUei  — helper function
 */

export interface Person {
  first_name: string;
  last_name: string;
  full_name: string;
  nickname?: string | null;
  civility_title?: string | null;
  headline: string | null;
  about_me: string | null;
  location: {
    city: string | null;
    state_code: string | null;
    country_code: string | null;
    continent: string | null;
  };
  linkedin_url: string;
  connections_count: number;
  profile_picture_url: string | null;
  experiences: Array<{
    company_name: string;
    job_title: string | null;
    company_linkedin_url?: string;
    company_linkedin_id?: string;
    company_domain?: string;
    job_description?: string | null;
    job_start_date: string | null;
    job_end_date: string | null;
    job_is_current: boolean;
    job_location?: { city: string | null; state_code: string | null; country_code: string | null };
  }>;
  education: Array<{ degree: string; start_date?: string; end_date?: string }>;
  skills: string[];
  certifications: Array<{ authority: string; name: string; url?: string }>;
}

// ── People data keyed by recipient_uei ────────────────────────────────────────
// 35 of 48 winners have people; 13 get empty-state.
// Distribution: ~88 people total across 35 winners.

const _raw: Array<{ uei: string; people: Person[] }> = [
  {
    uei: "ABC123456789", // Apex Federal Solutions
    people: [
      {
        first_name: "James", last_name: "Whitfield", full_name: "James Whitfield",
        headline: "VP of Delivery at Apex Federal Solutions",
        about_me: "Federal IT executive with 15+ years delivering cloud and DevSecOps programs across DoD.",
        location: { city: "Arlington", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/james-whitfield-fed",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Apex Federal Solutions", job_title: "VP of Delivery", company_domain: "apexfed.com", job_start_date: "2020-03-01", job_end_date: null, job_is_current: true, job_location: { city: "Arlington", state_code: "VA", country_code: "US" } },
          { company_name: "Booz Allen Hamilton", job_title: "Senior Consultant", company_domain: "boozallen.com", job_start_date: "2015-06-01", job_end_date: "2020-02-28", job_is_current: false, job_location: { city: "McLean", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Information Systems", start_date: "2010-01-01", end_date: "2012-01-01" }, { degree: "B.S. Computer Science", start_date: "2005-01-01", end_date: "2009-01-01" }],
        skills: ["cloud architecture", "devsecops", "federal contracting", "AWS", "Azure"],
        certifications: [{ authority: "AWS", name: "AWS Solutions Architect Professional", url: "https://aws.amazon.com/certification/" }, { authority: "ISC2", name: "CISSP" }],
      },
      {
        first_name: "Maria", last_name: "Delgado", full_name: "Maria Delgado",
        headline: "Cloud Migration Program Manager",
        about_me: "PMP-certified program manager focused on large-scale cloud migrations for federal clients.",
        location: { city: "Fairfax", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/maria-delgado-pm",
        connections_count: 312,
        profile_picture_url: null,
        experiences: [
          { company_name: "Apex Federal Solutions", job_title: "Program Manager", company_domain: "apexfed.com", job_start_date: "2021-07-01", job_end_date: null, job_is_current: true, job_location: { city: "Fairfax", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "MBA", start_date: "2014-01-01", end_date: "2016-01-01" }],
        skills: ["program management", "agile", "PMP", "stakeholder engagement"],
        certifications: [{ authority: "PMI", name: "Project Management Professional (PMP)", url: "https://www.pmi.org/certifications/project-management-pmp" }],
      },
      {
        first_name: "Derek", last_name: "Okonkwo", full_name: "Derek Okonkwo",
        headline: null,
        about_me: null,
        location: { city: "Reston", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/derek-okonkwo",
        connections_count: 187,
        profile_picture_url: null,
        experiences: [
          { company_name: "Apex Federal Solutions", job_title: null, company_domain: "apexfed.com", job_start_date: null, job_end_date: null, job_is_current: true, job_location: { city: null, state_code: null, country_code: null } },
        ],
        education: [{ degree: "B.S. Cybersecurity" }],
        skills: ["penetration testing", "SIEM", "incident response"],
        certifications: [{ authority: "CompTIA", name: "Security+" }],
      },
    ],
  },
  {
    uei: "DEF987654321", // Meridian Analytics Group
    people: [
      {
        first_name: "Sandra", last_name: "Park", full_name: "Sandra Park",
        headline: "Principal Consultant — Acquisition Strategy",
        about_me: "20 years of federal acquisition experience supporting DHS, DOJ, and HHS procurement teams.",
        location: { city: "Rockville", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/sandra-park-acq",
        connections_count: 422,
        profile_picture_url: null,
        experiences: [
          { company_name: "Meridian Analytics Group", job_title: "Principal Consultant", company_domain: "meridianag.com", job_start_date: "2019-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Rockville", state_code: "MD", country_code: "US" } },
          { company_name: "DHS Office of Procurement", job_title: "Contracting Officer", company_domain: "dhs.gov", job_start_date: "2005-09-01", job_end_date: "2018-12-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "Master of Public Administration", start_date: "2003-01-01", end_date: "2005-01-01" }, { degree: "B.A. Political Science" }],
        skills: ["federal acquisition", "FAR/DFARS", "source selection", "contracting"],
        certifications: [{ authority: "NCMA", name: "Certified Federal Contracts Manager (CFCM)" }],
      },
      {
        first_name: "Anthony", last_name: "Reeves", full_name: "Anthony Reeves",
        headline: "Data Analyst — Government Programs",
        about_me: null,
        location: { city: "Silver Spring", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/anthony-reeves-data",
        connections_count: 245,
        profile_picture_url: null,
        experiences: [
          { company_name: "Meridian Analytics Group", job_title: "Data Analyst", company_domain: "meridianag.com", job_start_date: "2022-04-01", job_end_date: null, job_is_current: true, job_location: { city: "Silver Spring", state_code: "MD", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Statistics", start_date: "2017-01-01", end_date: "2021-01-01" }],
        skills: ["Python", "SQL", "data visualization", "Tableau"],
        certifications: [],
      },
    ],
  },
  {
    uei: "GHI111222333", // TerraLogic Systems
    people: [
      {
        first_name: "Robert", last_name: "Chambers", full_name: "Robert Chambers",
        headline: "Chief Engineer — Infrastructure Resilience",
        about_me: "PE-licensed civil engineer specializing in critical infrastructure resilience for Army Corps projects.",
        location: { city: "Austin", state_code: "TX", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/robert-chambers-pe",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "TerraLogic Systems", job_title: "Chief Engineer", company_domain: "terralogic.com", job_start_date: "2018-06-01", job_end_date: null, job_is_current: true, job_location: { city: "Austin", state_code: "TX", country_code: "US" } },
          { company_name: "AECOM", job_title: "Senior Structural Engineer", company_domain: "aecom.com", job_start_date: "2010-01-01", job_end_date: "2018-05-31", job_is_current: false, job_location: { city: "Houston", state_code: "TX", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Civil Engineering", start_date: "2006-01-01", end_date: "2008-01-01" }, { degree: "B.S. Civil Engineering", start_date: "2002-01-01", end_date: "2006-01-01" }],
        skills: ["structural engineering", "resilience assessment", "AutoCAD", "risk analysis"],
        certifications: [{ authority: "NCEES", name: "Professional Engineer (PE) — Civil" }],
      },
      {
        first_name: "Priya", last_name: "Nair", full_name: "Priya Nair",
        headline: "Project Director — Federal Infrastructure",
        about_me: "Experienced project director managing multi-million dollar infrastructure contracts.",
        location: { city: "Dallas", state_code: "TX", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/priya-nair-infra",
        connections_count: 389,
        profile_picture_url: null,
        experiences: [
          { company_name: "TerraLogic Systems", job_title: "Project Director", company_domain: "terralogic.com", job_start_date: "2020-09-01", job_end_date: null, job_is_current: true, job_location: { city: "Dallas", state_code: "TX", country_code: "US" } },
        ],
        education: [{ degree: "M.B.A.", start_date: "2012-01-01", end_date: "2014-01-01" }],
        skills: ["project management", "stakeholder management", "contract management", "scheduling"],
        certifications: [{ authority: "PMI", name: "PMP" }, { authority: "AACE", name: "Cost Engineer Certification" }],
      },
    ],
  },
  {
    uei: "KLM101112131", // Summit Financial Advisory
    people: [
      {
        first_name: "Howard", last_name: "Finkel", full_name: "Howard Finkel",
        headline: "Managing Director — Federal Financial Advisory",
        about_me: "CPA and federal financial systems advisor with expertise in Treasury IT modernization audits.",
        location: { city: "New York", state_code: "NY", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/howard-finkel-cpa",
        connections_count: 412,
        profile_picture_url: null,
        experiences: [
          { company_name: "Summit Financial Advisory", job_title: "Managing Director", company_domain: "summitfinancialadvisory.com", job_start_date: "2013-01-01", job_end_date: null, job_is_current: true, job_location: { city: "New York", state_code: "NY", country_code: "US" } },
          { company_name: "Dept. of Treasury OIG", job_title: "Senior Auditor", company_domain: "treasury.gov", job_start_date: "2007-06-01", job_end_date: "2012-12-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Accounting" }, { degree: "B.S. Finance" }],
        skills: ["federal financial audit", "investment advisory", "GAAP", "OMB Circular A-123"],
        certifications: [{ authority: "AICPA", name: "Certified Public Accountant (CPA)" }, { authority: "CDFM", name: "Certified Defense Financial Manager" }],
      },
      {
        first_name: "Natalie", last_name: "Steinberg", full_name: "Natalie Steinberg",
        headline: "Senior Financial Analyst",
        about_me: null,
        location: { city: "Manhattan", state_code: "NY", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/natalie-steinberg-fin",
        connections_count: 187,
        profile_picture_url: null,
        experiences: [
          { company_name: "Summit Financial Advisory", job_title: "Senior Financial Analyst", company_domain: "summitfinancialadvisory.com", job_start_date: "2020-09-01", job_end_date: null, job_is_current: true, job_location: { city: "New York", state_code: "NY", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Finance" }],
        skills: ["financial modeling", "DCF analysis", "Excel", "federal budgeting"],
        certifications: [{ authority: "CFA Institute", name: "CFA Level II Candidate" }],
      },
    ],
  },
  {
    uei: "JKL444555666", // Patriot Data Services
    people: [
      {
        first_name: "Thomas", last_name: "Nguyen", full_name: "Thomas Nguyen",
        headline: "Director of Operations — VA Programs",
        about_me: "Veteran and federal IT operations leader with deep experience in VA data platforms.",
        location: { city: "Richmond", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/thomas-nguyen-va",
        connections_count: 298,
        profile_picture_url: null,
        experiences: [
          { company_name: "Patriot Data Services", job_title: "Director of Operations", company_domain: "patriotdata.com", job_start_date: "2017-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Richmond", state_code: "VA", country_code: "US" } },
          { company_name: "US Army", job_title: null, company_domain: "army.mil", job_start_date: "2005-01-01", job_end_date: "2015-12-31", job_is_current: false, job_location: { city: null, state_code: null, country_code: "US" } },
        ],
        education: [{ degree: "B.S. Information Technology", start_date: "2016-01-01", end_date: "2019-01-01" }],
        skills: ["data operations", "federal IT", "ITIL", "veterans services"],
        certifications: [{ authority: "AXELOS", name: "ITIL Foundation" }, { authority: "CompTIA", name: "Network+" }],
      },
    ],
  },
  {
    uei: "MNO777888999", // Clearance Consulting Partners
    people: [
      {
        first_name: "Rachel", last_name: "Ostrowski", full_name: "Rachel Ostrowski",
        headline: "Managing Partner — Federal Compliance",
        about_me: "Attorney and compliance consultant helping federal contractors build airtight compliance programs.",
        location: { city: "Washington", state_code: "DC", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/rachel-ostrowski-esq",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Clearance Consulting Partners", job_title: "Managing Partner", company_domain: "clearanceconsulting.com", job_start_date: "2019-03-01", job_end_date: null, job_is_current: true, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
          { company_name: "DOJ", job_title: "Trial Attorney", company_domain: "justice.gov", job_start_date: "2012-07-01", job_end_date: "2019-02-28", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "J.D.", start_date: "2009-01-01", end_date: "2012-01-01" }, { degree: "B.A. Political Science" }],
        skills: ["federal compliance", "regulatory affairs", "legal counsel", "government contracts"],
        certifications: [{ authority: "DC Bar", name: "DC Bar Member" }],
      },
      {
        first_name: "Kevin", last_name: "Strauss", full_name: "Kevin Strauss",
        headline: "Senior Compliance Analyst",
        about_me: null,
        location: { city: "Bethesda", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/kevin-strauss-compliance",
        connections_count: 183,
        profile_picture_url: null,
        experiences: [
          { company_name: "Clearance Consulting Partners", job_title: "Senior Compliance Analyst", company_domain: "clearanceconsulting.com", job_start_date: "2021-06-01", job_end_date: null, job_is_current: true, job_location: { city: "Bethesda", state_code: "MD", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Regulatory Affairs", start_date: "2018-01-01", end_date: "2020-01-01" }],
        skills: ["compliance auditing", "risk assessment", "NIST", "policy writing"],
        certifications: [{ authority: "SCCE", name: "Certified Compliance and Ethics Professional (CCEP)" }],
      },
    ],
  },
  {
    uei: "PQR000111222", // Northfield Cybersecurity
    people: [
      {
        first_name: "Daniel", last_name: "Harrington", full_name: "Daniel Harrington",
        headline: "Chief Technology Officer — Northfield Cybersecurity",
        about_me: "NSA-cleared CTO leading threat intelligence platform development for national security clients.",
        location: { city: "Columbia", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/daniel-harrington-cto",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Northfield Cybersecurity", job_title: "CTO", company_domain: "northfieldcyber.com", job_start_date: "2016-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Columbia", state_code: "MD", country_code: "US" } },
          { company_name: "NSA", job_title: null, company_domain: "nsa.gov", job_start_date: "2005-01-01", job_end_date: "2015-12-31", job_is_current: false, job_location: { city: null, state_code: null, country_code: "US" } },
        ],
        education: [{ degree: "M.S. Computer Science", start_date: "2003-01-01", end_date: "2005-01-01" }],
        skills: ["threat intelligence", "malware analysis", "reverse engineering", "SIEM", "network security"],
        certifications: [{ authority: "SANS", name: "GIAC Certified Incident Handler (GCIH)", url: "https://www.giac.org/certifications/certified-incident-handler-gcih/" }, { authority: "ISC2", name: "CISSP" }],
      },
      {
        first_name: "Aisha", last_name: "Coleman", full_name: "Aisha Coleman",
        headline: "Lead Threat Intelligence Analyst",
        about_me: "Cybersecurity analyst specializing in APT tracking and threat actor profiling.",
        location: { city: "Annapolis Junction", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/aisha-coleman-cyber",
        connections_count: 267,
        profile_picture_url: null,
        experiences: [
          { company_name: "Northfield Cybersecurity", job_title: "Lead Threat Intelligence Analyst", company_domain: "northfieldcyber.com", job_start_date: "2020-08-01", job_end_date: null, job_is_current: true, job_location: { city: "Columbia", state_code: "MD", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Information Assurance", start_date: "2015-01-01", end_date: "2019-01-01" }],
        skills: ["OSINT", "threat hunting", "Splunk", "MITRE ATT&CK"],
        certifications: [{ authority: "CompTIA", name: "Security+" }, { authority: "SANS", name: "GIAC Cyber Threat Intelligence (GCTI)" }],
      },
      {
        first_name: "Marcus", last_name: "Patel", full_name: "Marcus Patel",
        headline: "Platform Engineering Lead",
        about_me: null,
        location: { city: null, state_code: null, country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/marcus-patel-eng",
        connections_count: 421,
        profile_picture_url: null,
        experiences: [
          { company_name: "Northfield Cybersecurity", job_title: "Platform Engineering Lead", company_domain: "northfieldcyber.com", job_start_date: "2019-02-01", job_end_date: null, job_is_current: true, job_location: { city: null, state_code: null, country_code: null } },
        ],
        education: [{ degree: "B.S. Software Engineering", start_date: "2013-01-01", end_date: "2017-01-01" }],
        skills: ["Kubernetes", "Go", "data pipelines", "ElasticSearch"],
        certifications: [],
      },
    ],
  },
  {
    uei: "STU333444555", // Crestview Logistics Inc
    people: [
      {
        first_name: "Larry", last_name: "Hutchinson", full_name: "Larry Hutchinson",
        headline: "VP Supply Chain Operations — DoD Programs",
        about_me: "30-year logistics veteran managing defense supply chain contracts across CONUS and OCONUS.",
        location: { city: "Atlanta", state_code: "GA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/larry-hutchinson-scm",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Crestview Logistics Inc", job_title: "VP Supply Chain Operations", company_domain: "crestviewlogistics.com", job_start_date: "2015-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Atlanta", state_code: "GA", country_code: "US" } },
          { company_name: "DHL Federal", job_title: "Regional Director", company_domain: "dhl.com", job_start_date: "2005-01-01", job_end_date: "2014-12-31", job_is_current: false, job_location: { city: "Savannah", state_code: "GA", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Logistics and Supply Chain Management" }],
        skills: ["supply chain", "transportation management", "defense logistics", "RFID"],
        certifications: [{ authority: "APICS", name: "Certified Supply Chain Professional (CSCP)" }],
      },
      {
        first_name: "Denise", last_name: "Warren", full_name: "Denise Warren",
        headline: "Contracts Manager",
        about_me: null,
        location: { city: "Marietta", state_code: "GA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/denise-warren-contracts",
        connections_count: 156,
        profile_picture_url: null,
        experiences: [
          { company_name: "Crestview Logistics Inc", job_title: "Contracts Manager", company_domain: "crestviewlogistics.com", job_start_date: "2018-04-01", job_end_date: null, job_is_current: true, job_location: { city: "Marietta", state_code: "GA", country_code: "US" } },
        ],
        education: [{ degree: "B.B.A. Business Administration" }],
        skills: ["contract management", "procurement", "FAR compliance", "vendor relations"],
        certifications: [{ authority: "NCMA", name: "CFCM" }],
      },
    ],
  },
  {
    uei: "VWX666777888", // BlueSky Environmental
    people: [
      {
        first_name: "Christine", last_name: "Hollis", full_name: "Christine Hollis",
        headline: "Senior Environmental Scientist — Superfund Programs",
        about_me: "20 years of remediation experience at EPA Superfund and RCRA sites across California.",
        location: { city: "Sacramento", state_code: "CA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/christine-hollis-env",
        connections_count: 334,
        profile_picture_url: null,
        experiences: [
          { company_name: "BlueSky Environmental", job_title: "Senior Environmental Scientist", company_domain: "blueskyenv.com", job_start_date: "2016-03-01", job_end_date: null, job_is_current: true, job_location: { city: "Sacramento", state_code: "CA", country_code: "US" } },
          { company_name: "EPA Region 9", job_title: "Environmental Protection Specialist", company_domain: "epa.gov", job_start_date: "2004-07-01", job_end_date: "2016-02-28", job_is_current: false, job_location: { city: "San Francisco", state_code: "CA", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Environmental Engineering", start_date: "2002-01-01", end_date: "2004-01-01" }, { degree: "B.S. Chemistry" }],
        skills: ["remediation", "site characterization", "RCRA", "hazardous waste", "EPA regulations"],
        certifications: [{ authority: "ABIH", name: "Certified Industrial Hygienist (CIH)" }],
      },
    ],
  },
  {
    uei: "YZA999000111", // Keystone Health Solutions
    people: [
      {
        first_name: "Dr. Patricia", last_name: "Monroe", full_name: "Dr. Patricia Monroe",
        headline: "Medical Director — Community Health Programs",
        about_me: "Board-certified family physician leading federally-funded community health outreach programs.",
        location: { city: "Philadelphia", state_code: "PA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/dr-patricia-monroe-md",
        connections_count: 412,
        profile_picture_url: null,
        experiences: [
          { company_name: "Keystone Health Solutions", job_title: "Medical Director", company_domain: "keystonehealth.com", job_start_date: "2018-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Philadelphia", state_code: "PA", country_code: "US" } },
        ],
        education: [{ degree: "M.D.", start_date: "1992-01-01", end_date: "1996-01-01" }, { degree: "B.S. Biology", start_date: "1988-01-01", end_date: "1992-01-01" }],
        skills: ["community health", "population health management", "federal grants", "clinical leadership"],
        certifications: [{ authority: "ABFM", name: "Board Certified Family Medicine" }],
      },
      {
        first_name: "Leon", last_name: "Fischer", full_name: "Leon Fischer",
        headline: "Director of Federal Programs",
        about_me: null,
        location: { city: "Pittsburgh", state_code: "PA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/leon-fischer-health",
        connections_count: 221,
        profile_picture_url: null,
        experiences: [
          { company_name: "Keystone Health Solutions", job_title: "Director of Federal Programs", company_domain: "keystonehealth.com", job_start_date: "2020-11-01", job_end_date: null, job_is_current: true, job_location: { city: "Pittsburgh", state_code: "PA", country_code: "US" } },
        ],
        education: [{ degree: "M.P.H.", start_date: "2015-01-01", end_date: "2017-01-01" }],
        skills: ["grant management", "HRSA", "program evaluation", "public health"],
        certifications: [],
      },
    ],
  },
  {
    uei: "BCD222333444", // Redstone Technology Partners
    people: [
      {
        first_name: "Gregory", last_name: "Voss", full_name: "Gregory Voss",
        headline: "Chief Scientist — Advanced Propulsion",
        about_me: "PhD physicist with 25 years of propulsion R&D at NASA and private contractors.",
        location: { city: "Huntsville", state_code: "AL", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/gregory-voss-phd",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Redstone Technology Partners", job_title: "Chief Scientist", company_domain: "redstonetek.com", job_start_date: "2010-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Huntsville", state_code: "AL", country_code: "US" } },
          { company_name: "NASA MSFC", job_title: "Research Scientist", company_domain: "nasa.gov", job_start_date: "1999-06-01", job_end_date: "2009-12-31", job_is_current: false, job_location: { city: "Huntsville", state_code: "AL", country_code: "US" } },
        ],
        education: [{ degree: "Ph.D. Aerospace Engineering", start_date: "1994-01-01", end_date: "1999-01-01" }, { degree: "M.S. Physics" }],
        skills: ["propulsion systems", "computational fluid dynamics", "materials testing", "R&D"],
        certifications: [],
      },
      {
        first_name: "Tamara", last_name: "Elkins", full_name: "Tamara Elkins",
        headline: "Program Manager — NASA Contracts",
        about_me: "Certified project manager with 15 years executing NASA research contracts.",
        location: { city: "Madison", state_code: "AL", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/tamara-elkins-nasa",
        connections_count: 287,
        profile_picture_url: null,
        experiences: [
          { company_name: "Redstone Technology Partners", job_title: "Program Manager", company_domain: "redstonetek.com", job_start_date: "2015-04-01", job_end_date: null, job_is_current: true, job_location: { city: "Huntsville", state_code: "AL", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Industrial Engineering" }],
        skills: ["program management", "earned value management", "NASA FAR supplement", "scheduling"],
        certifications: [{ authority: "PMI", name: "PMP" }, { authority: "AACEI", name: "Earned Value Professional (EVP)" }],
      },
    ],
  },
  {
    uei: "HIJ888999000", // Irongate Defense Research
    people: [
      {
        first_name: "Col. (ret.) Steven", last_name: "Blackwood", full_name: "Col. (ret.) Steven Blackwood",
        headline: "President — Irongate Defense Research",
        about_me: "Retired Army Colonel and autonomous systems expert. 30 years DoD + 15 years industry.",
        location: { city: "Arlington", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/col-blackwood-ret",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Irongate Defense Research", job_title: "President", company_domain: "irongate-def.com", job_start_date: "2015-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Arlington", state_code: "VA", country_code: "US" } },
          { company_name: "US Army", job_title: null, company_domain: "army.mil", job_start_date: "1985-05-01", job_end_date: "2015-05-31", job_is_current: false, job_location: { city: null, state_code: null, country_code: "US" } },
        ],
        education: [{ degree: "M.S. National Security Strategy", start_date: "1998-01-01", end_date: "1999-01-01" }, { degree: "B.S. Engineering" }],
        skills: ["autonomous systems", "defense R&D", "business development", "government relations"],
        certifications: [],
      },
      {
        first_name: "Nina", last_name: "Petrova", full_name: "Nina Petrova",
        headline: "Lead Research Engineer — Autonomous Systems",
        about_me: "Robotics and AI engineer developing autonomous platform capabilities for DARPA programs.",
        location: { city: "Herndon", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/nina-petrova-robotics",
        connections_count: 356,
        profile_picture_url: null,
        experiences: [
          { company_name: "Irongate Defense Research", job_title: "Lead Research Engineer", company_domain: "irongate-def.com", job_start_date: "2019-09-01", job_end_date: null, job_is_current: true, job_location: { city: "Herndon", state_code: "VA", country_code: "US" } },
          { company_name: "Carnegie Mellon University", job_title: "Postdoctoral Researcher", company_domain: "cmu.edu", job_start_date: "2017-01-01", job_end_date: "2019-08-31", job_is_current: false, job_location: { city: "Pittsburgh", state_code: "PA", country_code: "US" } },
        ],
        education: [{ degree: "Ph.D. Robotics", start_date: "2012-01-01", end_date: "2017-01-01" }, { degree: "M.S. Computer Science" }],
        skills: ["ROS", "machine learning", "computer vision", "sensor fusion", "C++", "Python"],
        certifications: [],
      },
      {
        first_name: "Walter", last_name: "Kim", full_name: "Walter Kim",
        headline: "Systems Integration Manager",
        about_me: null,
        location: { city: "Chantilly", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/walter-kim-sysint",
        connections_count: 198,
        profile_picture_url: null,
        experiences: [
          { company_name: "Irongate Defense Research", job_title: "Systems Integration Manager", company_domain: "irongate-def.com", job_start_date: "2021-02-01", job_end_date: null, job_is_current: true, job_location: { city: "Chantilly", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Electrical Engineering", start_date: "2014-01-01", end_date: "2018-01-01" }],
        skills: ["systems engineering", "MBSE", "test and evaluation", "integration testing"],
        certifications: [{ authority: "INCOSE", name: "Certified Systems Engineering Professional (CSEP)" }],
      },
    ],
  },
  {
    uei: "FGH383940414", // Vanguard Protective Services
    people: [
      {
        first_name: "Michael", last_name: "Rhodes", full_name: "Michael Rhodes",
        headline: "VP of Federal Security Programs",
        about_me: "Former Secret Service agent leading embassy and federal facility security programs.",
        location: { city: "Washington", state_code: "DC", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/michael-rhodes-security",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Vanguard Protective Services", job_title: "VP Federal Security Programs", company_domain: "vanguardps.com", job_start_date: "2017-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
          { company_name: "US Secret Service", job_title: null, company_domain: "secretservice.gov", job_start_date: "1995-01-01", job_end_date: "2016-12-31", job_is_current: false, job_location: { city: null, state_code: null, country_code: "US" } },
        ],
        education: [{ degree: "B.S. Criminal Justice" }],
        skills: ["physical security", "threat assessment", "executive protection", "federal law enforcement"],
        certifications: [{ authority: "ASIS", name: "Certified Protection Professional (CPP)" }],
      },
      {
        first_name: "Evelyn", last_name: "Huang", full_name: "Evelyn Huang",
        headline: "Operations Manager — Overseas Programs",
        about_me: null,
        location: { city: null, state_code: null, country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/evelyn-huang-ops",
        connections_count: 234,
        profile_picture_url: null,
        experiences: [
          { company_name: "Vanguard Protective Services", job_title: "Operations Manager", company_domain: "vanguardps.com", job_start_date: "2020-06-01", job_end_date: null, job_is_current: true, job_location: { city: null, state_code: null, country_code: null } },
        ],
        education: [{ degree: "M.A. International Security" }],
        skills: ["operations management", "logistics", "overseas deployment", "risk management"],
        certifications: [],
      },
    ],
  },
  {
    uei: "IJK424344454", // Suncoast Marine Systems
    people: [
      {
        first_name: "Raymond", last_name: "Torres", full_name: "Raymond Torres",
        headline: "Program Director — LCS Maintenance",
        about_me: "Naval architect and ship systems engineer with 25 years in Navy surface combatant maintenance.",
        location: { city: "Jacksonville", state_code: "FL", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/raymond-torres-naval",
        connections_count: 445,
        profile_picture_url: null,
        experiences: [
          { company_name: "Suncoast Marine Systems", job_title: "Program Director", company_domain: "suncoastmarine.com", job_start_date: "2014-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Jacksonville", state_code: "FL", country_code: "US" } },
          { company_name: "Huntington Ingalls Industries", job_title: "Senior Naval Architect", company_domain: "hii.com", job_start_date: "2005-01-01", job_end_date: "2013-12-31", job_is_current: false, job_location: { city: "Pascagoula", state_code: "MS", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Naval Architecture and Marine Engineering" }, { degree: "B.S. Mechanical Engineering" }],
        skills: ["naval architecture", "ship maintenance", "NAVSEA", "dry-dock operations"],
        certifications: [{ authority: "SNAME", name: "Professional Member SNAME" }],
      },
      {
        first_name: "Brittany", last_name: "Sellers", full_name: "Brittany Sellers",
        headline: "Quality Assurance Director",
        about_me: "QA director ensuring shipyard quality standards for all US Navy vessel maintenance contracts.",
        location: { city: "Orange Park", state_code: "FL", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/brittany-sellers-qa",
        connections_count: 189,
        profile_picture_url: null,
        experiences: [
          { company_name: "Suncoast Marine Systems", job_title: "Quality Assurance Director", company_domain: "suncoastmarine.com", job_start_date: "2018-07-01", job_end_date: null, job_is_current: true, job_location: { city: "Jacksonville", state_code: "FL", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Industrial Engineering" }],
        skills: ["quality management", "ISO 9001", "NAVSEA standards", "non-destructive testing"],
        certifications: [{ authority: "ASQ", name: "Certified Quality Manager (CQM/OE)" }],
      },
    ],
  },
  {
    uei: "OPQ505152535", // Capital Infrastructure Group
    people: [
      {
        first_name: "Harold", last_name: "Simmons", full_name: "Harold Simmons",
        headline: "SVP Infrastructure — Capital Infrastructure Group",
        about_me: "30-year infrastructure executive leading major federal highway and bridge contracts.",
        location: { city: "Bethesda", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/harold-simmons-infra",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Capital Infrastructure Group", job_title: "SVP Infrastructure", company_domain: "capitalinfra.com", job_start_date: "2008-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Bethesda", state_code: "MD", country_code: "US" } },
          { company_name: "MDOT", job_title: "District Engineer", company_domain: "mdot.gov", job_start_date: "1990-01-01", job_end_date: "2007-12-31", job_is_current: false, job_location: { city: "Baltimore", state_code: "MD", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Civil Engineering" }, { degree: "B.S. Civil Engineering" }],
        skills: ["bridge engineering", "highway construction", "FHWA compliance", "project delivery"],
        certifications: [{ authority: "NCEES", name: "Professional Engineer (PE) — Civil/Structural" }],
      },
      {
        first_name: "Jacqueline", last_name: "Reid", full_name: "Jacqueline Reid",
        headline: "Federal Business Development Manager",
        about_me: null,
        location: { city: "Rockville", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/jacqueline-reid-bd",
        connections_count: 312,
        profile_picture_url: null,
        experiences: [
          { company_name: "Capital Infrastructure Group", job_title: "Business Development Manager", company_domain: "capitalinfra.com", job_start_date: "2019-03-01", job_end_date: null, job_is_current: true, job_location: { city: "Bethesda", state_code: "MD", country_code: "US" } },
        ],
        education: [{ degree: "M.B.A." }],
        skills: ["business development", "capture management", "proposal writing", "federal contracting"],
        certifications: [{ authority: "APMP", name: "APMP Foundation Certification" }],
      },
    ],
  },
  {
    uei: "RST545556575", // Coastal Data Intelligence
    people: [
      {
        first_name: "Dr. Lily", last_name: "Watanabe", full_name: "Dr. Lily Watanabe",
        headline: "Chief Data Scientist — NOAA Programs",
        about_me: "Oceanographer turned data scientist, building ML pipelines for NOAA ocean monitoring systems.",
        location: { city: "Miami", state_code: "FL", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/dr-lily-watanabe",
        connections_count: 367,
        profile_picture_url: null,
        experiences: [
          { company_name: "Coastal Data Intelligence", job_title: "Chief Data Scientist", company_domain: "coastaldataintel.com", job_start_date: "2021-07-01", job_end_date: null, job_is_current: true, job_location: { city: "Miami", state_code: "FL", country_code: "US" } },
          { company_name: "NOAA AOML", job_title: "Physical Oceanographer", company_domain: "noaa.gov", job_start_date: "2015-09-01", job_end_date: "2021-06-30", job_is_current: false, job_location: { city: "Miami", state_code: "FL", country_code: "US" } },
        ],
        education: [{ degree: "Ph.D. Physical Oceanography" }, { degree: "M.S. Ocean Sciences" }],
        skills: ["machine learning", "Python", "ocean modeling", "data pipelines", "Apache Kafka"],
        certifications: [],
      },
    ],
  },
  {
    uei: "DEF707172737", // Highpoint IT Staffing
    people: [
      {
        first_name: "Brandon", last_name: "Cross", full_name: "Brandon Cross",
        headline: "Director of Cleared Staffing Solutions",
        about_me: "15 years placing cleared IT professionals into DoD cyber and information operations programs.",
        location: { city: "San Antonio", state_code: "TX", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/brandon-cross-cleared",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Highpoint IT Staffing", job_title: "Director of Cleared Staffing", company_domain: "highpointit.com", job_start_date: "2016-01-01", job_end_date: null, job_is_current: true, job_location: { city: "San Antonio", state_code: "TX", country_code: "US" } },
          { company_name: "SAIC", job_title: "Talent Acquisition Manager", company_domain: "saic.com", job_start_date: "2010-06-01", job_end_date: "2015-12-31", job_is_current: false, job_location: { city: "McLean", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "B.B.A. Human Resources" }],
        skills: ["cleared staffing", "talent acquisition", "workforce planning", "DoD cyber"],
        certifications: [{ authority: "SHRM", name: "SHRM-CP" }],
      },
      {
        first_name: "Vanessa", last_name: "Brooks", full_name: "Vanessa Brooks",
        headline: "Senior Recruiter — Cyber Programs",
        about_me: null,
        location: { city: "Austin", state_code: "TX", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/vanessa-brooks-recruiter",
        connections_count: 423,
        profile_picture_url: null,
        experiences: [
          { company_name: "Highpoint IT Staffing", job_title: "Senior Recruiter", company_domain: "highpointit.com", job_start_date: "2020-03-01", job_end_date: null, job_is_current: true, job_location: { city: "Austin", state_code: "TX", country_code: "US" } },
        ],
        education: [{ degree: "B.A. Communications" }],
        skills: ["technical recruiting", "LinkedIn Recruiter", "clearance verification", "ATS"],
        certifications: [],
      },
      {
        first_name: "Omar", last_name: "Jefferson", full_name: "Omar Jefferson",
        headline: "Compliance Officer — Cleared Personnel",
        about_me: null,
        location: { city: null, state_code: null, country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/omar-jefferson-compliance",
        connections_count: 147,
        profile_picture_url: null,
        experiences: [
          { company_name: "Highpoint IT Staffing", job_title: "Compliance Officer", company_domain: "highpointit.com", job_start_date: "2022-01-01", job_end_date: null, job_is_current: true, job_location: { city: null, state_code: null, country_code: null } },
        ],
        education: [{ degree: "B.S. Political Science" }],
        skills: ["security clearance", "NISPOM", "compliance", "insider threat"],
        certifications: [{ authority: "NCMS", name: "Industrial Security Professional (ISP)" }],
      },
    ],
  },
  {
    uei: "QRS181920212", // Glacier Risk Management
    people: [
      {
        first_name: "Dale", last_name: "Hoffman", full_name: "Dale Hoffman",
        headline: "Chief Actuary — National Flood Programs",
        about_me: "Fellow of the Casualty Actuarial Society supporting FEMA National Flood Insurance Program risk modeling.",
        location: { city: "Missoula", state_code: "MT", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/dale-hoffman-actuary",
        connections_count: 289,
        profile_picture_url: null,
        experiences: [
          { company_name: "Glacier Risk Management", job_title: "Chief Actuary", company_domain: "glacierrisk.com", job_start_date: "2015-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Missoula", state_code: "MT", country_code: "US" } },
          { company_name: "FEMA", job_title: "Senior Risk Analyst", company_domain: "fema.gov", job_start_date: "2008-01-01", job_end_date: "2014-12-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Applied Mathematics" }, { degree: "B.S. Statistics" }],
        skills: ["actuarial modeling", "catastrophe modeling", "flood risk", "R", "GIS"],
        certifications: [{ authority: "CAS", name: "Fellow of the Casualty Actuarial Society (FCAS)" }],
      },
      {
        first_name: "Lynn", last_name: "Carruthers", full_name: "Lynn Carruthers",
        headline: "Risk Modeler — Flood Programs",
        about_me: null,
        location: { city: "Bozeman", state_code: "MT", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/lynn-carruthers-risk",
        connections_count: 156,
        profile_picture_url: null,
        experiences: [
          { company_name: "Glacier Risk Management", job_title: "Risk Modeler", company_domain: "glacierrisk.com", job_start_date: "2019-08-01", job_end_date: null, job_is_current: true, job_location: { city: "Bozeman", state_code: "MT", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Geophysics" }],
        skills: ["hydrological modeling", "floodplain mapping", "GIS", "HEC-RAS"],
        certifications: [],
      },
    ],
  },
  {
    uei: "GHI747576777", // Sagebrush Environmental Group
    people: [
      {
        first_name: "Frank", last_name: "Mendoza", full_name: "Frank Mendoza",
        headline: "VP Nuclear Waste Operations",
        about_me: "Health physicist and operations director for transuranic waste programs at DOE sites.",
        location: { city: "Las Vegas", state_code: "NV", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/frank-mendoza-hp",
        connections_count: 289,
        profile_picture_url: null,
        experiences: [
          { company_name: "Sagebrush Environmental Group", job_title: "VP Nuclear Waste Operations", company_domain: "sagebrushenv.com", job_start_date: "2014-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Las Vegas", state_code: "NV", country_code: "US" } },
          { company_name: "DOE Nevada Site", job_title: "Health Physicist", company_domain: "doe.gov", job_start_date: "2003-01-01", job_end_date: "2013-12-31", job_is_current: false, job_location: { city: "Mercury", state_code: "NV", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Health Physics" }, { degree: "B.S. Nuclear Engineering" }],
        skills: ["nuclear waste management", "health physics", "radiation protection", "DOE regulations"],
        certifications: [{ authority: "ABHP", name: "Certified Health Physicist (CHP)" }],
      },
    ],
  },
  {
    uei: "MNO828384858", // Crescent Defense Technologies
    people: [
      {
        first_name: "Admiral (ret.) George", last_name: "Hartley", full_name: "Admiral (ret.) George Hartley",
        headline: "Executive Chairman — Crescent Defense Technologies",
        about_me: "Retired Navy Admiral and defense industry executive. Expert in air defense systems procurement.",
        location: { city: "Phoenix", state_code: "AZ", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/adm-hartley-ret",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Crescent Defense Technologies", job_title: "Executive Chairman", company_domain: "crescentdef.com", job_start_date: "2012-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Phoenix", state_code: "AZ", country_code: "US" } },
          { company_name: "US Navy", job_title: null, company_domain: "navy.mil", job_start_date: "1967-06-01", job_end_date: "2012-05-31", job_is_current: false, job_location: { city: null, state_code: null, country_code: "US" } },
        ],
        education: [{ degree: "M.S. Defense Management" }, { degree: "B.S. Engineering" }],
        skills: ["air defense", "systems acquisition", "defense policy", "executive leadership"],
        certifications: [],
      },
      {
        first_name: "Patricia", last_name: "Donnelly", full_name: "Patricia Donnelly",
        headline: "Program Executive — Radar Systems",
        about_me: "Radar systems engineer with 20+ years in USAF programs.",
        location: { city: "Tempe", state_code: "AZ", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/patricia-donnelly-radar",
        connections_count: 334,
        profile_picture_url: null,
        experiences: [
          { company_name: "Crescent Defense Technologies", job_title: "Program Executive", company_domain: "crescentdef.com", job_start_date: "2018-06-01", job_end_date: null, job_is_current: true, job_location: { city: "Tempe", state_code: "AZ", country_code: "US" } },
          { company_name: "Raytheon", job_title: "Senior Systems Engineer", company_domain: "raytheon.com", job_start_date: "2005-01-01", job_end_date: "2018-05-31", job_is_current: false, job_location: { city: "Tucson", state_code: "AZ", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Electrical Engineering" }, { degree: "B.S. Physics" }],
        skills: ["radar systems", "signal processing", "AESA", "systems engineering", "USAF programs"],
        certifications: [],
      },
      {
        first_name: "Christopher", last_name: "Farrell", full_name: "Christopher Farrell",
        headline: "Director of Contracts",
        about_me: null,
        location: { city: "Scottsdale", state_code: "AZ", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/christopher-farrell-contracts",
        connections_count: 211,
        profile_picture_url: null,
        experiences: [
          { company_name: "Crescent Defense Technologies", job_title: "Director of Contracts", company_domain: "crescentdef.com", job_start_date: "2019-09-01", job_end_date: null, job_is_current: true, job_location: { city: "Scottsdale", state_code: "AZ", country_code: "US" } },
        ],
        education: [{ degree: "J.D." }, { degree: "B.A. Business" }],
        skills: ["defense contracts", "DFARS", "FAR", "intellectual property", "teaming agreements"],
        certifications: [{ authority: "NCMA", name: "CPCM" }],
      },
    ],
  },
  {
    uei: "STU909192939", // Broadridge Federal IT
    people: [
      {
        first_name: "Andrew", last_name: "Chen", full_name: "Andrew Chen",
        headline: "CTO — Federal Analytics Division",
        about_me: "Data engineering leader building federated analytics platforms for law enforcement agencies.",
        location: { city: "Tysons", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/andrew-chen-federal-cto",
        connections_count: 489,
        profile_picture_url: null,
        experiences: [
          { company_name: "Broadridge Federal IT", job_title: "CTO Federal Analytics", company_domain: "broadridgefed.com", job_start_date: "2017-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Tysons", state_code: "VA", country_code: "US" } },
          { company_name: "Palantir", job_title: "Forward Deployed Engineer", company_domain: "palantir.com", job_start_date: "2012-07-01", job_end_date: "2016-12-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Computer Science", start_date: "2010-01-01", end_date: "2012-01-01" }, { degree: "B.S. Mathematics" }],
        skills: ["data engineering", "Apache Spark", "federated analytics", "Python", "machine learning"],
        certifications: [],
      },
      {
        first_name: "Monica", last_name: "Garrett", full_name: "Monica Garrett",
        headline: "Senior Program Manager — DOJ",
        about_me: null,
        location: { city: "Alexandria", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/monica-garrett-pm",
        connections_count: 267,
        profile_picture_url: null,
        experiences: [
          { company_name: "Broadridge Federal IT", job_title: "Senior Program Manager", company_domain: "broadridgefed.com", job_start_date: "2020-10-01", job_end_date: null, job_is_current: true, job_location: { city: "Alexandria", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "M.P.A." }],
        skills: ["program management", "agile delivery", "stakeholder management", "budget management"],
        certifications: [{ authority: "PMI", name: "PMP" }, { authority: "Scrum Alliance", name: "CSM" }],
      },
    ],
  },
  {
    uei: "VWX949596979", // Stonegate Medical Supplies
    people: [
      {
        first_name: "Helen", last_name: "Nakamura", full_name: "Helen Nakamura",
        headline: "VP Federal Health Supply Programs",
        about_me: "Medical supply chain executive managing strategic national stockpile programs.",
        location: { city: "Newark", state_code: "NJ", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/helen-nakamura-supply",
        connections_count: 398,
        profile_picture_url: null,
        experiences: [
          { company_name: "Stonegate Medical Supplies", job_title: "VP Federal Health Supply", company_domain: "stonegatemed.com", job_start_date: "2016-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Newark", state_code: "NJ", country_code: "US" } },
          { company_name: "McKesson", job_title: "Director, Government Programs", company_domain: "mckesson.com", job_start_date: "2010-01-01", job_end_date: "2015-12-31", job_is_current: false, job_location: { city: "Irving", state_code: "TX", country_code: "US" } },
        ],
        education: [{ degree: "M.B.A. Supply Chain Management" }, { degree: "B.S. Pharmacy" }],
        skills: ["medical supply chain", "SNS programs", "HHS procurement", "inventory management"],
        certifications: [{ authority: "APICS", name: "CPIM" }],
      },
    ],
  },
  {
    uei: "BCD135792468", // Bayou Construction Partners
    people: [
      {
        first_name: "Jerome", last_name: "Thibodaux", full_name: "Jerome Thibodaux",
        headline: "President — Bayou Construction Partners",
        about_me: "Third-generation general contractor building federal facilities across the Gulf South.",
        location: { city: "Baton Rouge", state_code: "LA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/jerome-thibodaux-gc",
        connections_count: 445,
        profile_picture_url: null,
        experiences: [
          { company_name: "Bayou Construction Partners", job_title: "President", company_domain: "bayoucp.com", job_start_date: "2005-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Baton Rouge", state_code: "LA", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Construction Management", start_date: "1994-01-01", end_date: "1998-01-01" }],
        skills: ["general contracting", "construction management", "federal buildings", "project delivery"],
        certifications: [{ authority: "AGC", name: "Certified Construction Manager (CCM)" }],
      },
      {
        first_name: "Simone", last_name: "Leblanc", full_name: "Simone Leblanc",
        headline: "Chief Estimator",
        about_me: null,
        location: { city: "New Orleans", state_code: "LA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/simone-leblanc-estimating",
        connections_count: 189,
        profile_picture_url: null,
        experiences: [
          { company_name: "Bayou Construction Partners", job_title: "Chief Estimator", company_domain: "bayoucp.com", job_start_date: "2012-06-01", job_end_date: null, job_is_current: true, job_location: { city: "New Orleans", state_code: "LA", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Civil Engineering" }],
        skills: ["cost estimating", "quantity takeoff", "Procore", "federal cost accounting"],
        certifications: [{ authority: "AACE", name: "Certified Cost Estimator (CCE)" }],
      },
    ],
  },
  {
    uei: "EFG246813579", // Blue Ridge Data Science
    people: [
      {
        first_name: "Allison", last_name: "Graves", full_name: "Allison Graves",
        headline: "Principal Bioinformatics Engineer",
        about_me: "Bioinformatics engineer building genomic data pipelines for NIH research programs.",
        location: { city: "Charlottesville", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/allison-graves-bio",
        connections_count: 312,
        profile_picture_url: null,
        experiences: [
          { company_name: "Blue Ridge Data Science", job_title: "Principal Bioinformatics Engineer", company_domain: "blueridgeds.com", job_start_date: "2020-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Charlottesville", state_code: "VA", country_code: "US" } },
          { company_name: "NIH NHGRI", job_title: "Staff Scientist", company_domain: "genome.gov", job_start_date: "2015-01-01", job_end_date: "2019-12-31", job_is_current: false, job_location: { city: "Bethesda", state_code: "MD", country_code: "US" } },
        ],
        education: [{ degree: "Ph.D. Computational Biology" }, { degree: "B.S. Biochemistry" }],
        skills: ["bioinformatics", "Python", "R", "genomics", "cloud HPC", "AWS"],
        certifications: [],
      },
    ],
  },
  {
    uei: "HIJ369258147", // Cascade Defense Logistics
    people: [
      {
        first_name: "Scott", last_name: "McAllister", full_name: "Scott McAllister",
        headline: "Director of Air Base Logistics — USAF Programs",
        about_me: "Former USAF logistics officer managing base operations support contracts.",
        location: { city: "Tacoma", state_code: "WA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/scott-mcallister-usaf",
        connections_count: 367,
        profile_picture_url: null,
        experiences: [
          { company_name: "Cascade Defense Logistics", job_title: "Director of Logistics", company_domain: "cascadedeflog.com", job_start_date: "2018-07-01", job_end_date: null, job_is_current: true, job_location: { city: "Tacoma", state_code: "WA", country_code: "US" } },
          { company_name: "US Air Force", job_title: null, company_domain: "af.mil", job_start_date: "1995-01-01", job_end_date: "2018-06-30", job_is_current: false, job_location: { city: null, state_code: null, country_code: "US" } },
        ],
        education: [{ degree: "M.S. Logistics Management" }, { degree: "B.S. Business Administration" }],
        skills: ["USAF logistics", "base operations support", "supply chain", "transportation"],
        certifications: [{ authority: "SOLE", name: "Certified Professional Logistician (CPL)" }],
      },
      {
        first_name: "Heather", last_name: "Jorgenson", full_name: "Heather Jorgenson",
        headline: "Inventory Control Manager",
        about_me: null,
        location: { city: "Lakewood", state_code: "WA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/heather-jorgenson-inv",
        connections_count: 143,
        profile_picture_url: null,
        experiences: [
          { company_name: "Cascade Defense Logistics", job_title: "Inventory Control Manager", company_domain: "cascadedeflog.com", job_start_date: "2021-04-01", job_end_date: null, job_is_current: true, job_location: { city: "Lakewood", state_code: "WA", country_code: "US" } },
        ],
        education: [{ degree: "B.A. Operations Management" }],
        skills: ["inventory management", "ERP", "SAP", "demand forecasting"],
        certifications: [{ authority: "APICS", name: "CPIM" }],
      },
    ],
  },
  {
    uei: "KLM741852963", // Peakstone Research Institute
    people: [
      {
        first_name: "Dr. Kenneth", last_name: "Albright", full_name: "Dr. Kenneth Albright",
        headline: "Executive Director — Strategic Policy Research",
        about_me: "Former NSC staffer and defense policy scholar. Expert in emerging threats and great power competition.",
        location: { city: "Washington", state_code: "DC", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/dr-kenneth-albright",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Peakstone Research Institute", job_title: "Executive Director", company_domain: "peakstoneri.com", job_start_date: "2014-09-01", job_end_date: null, job_is_current: true, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
          { company_name: "National Security Council", job_title: "Director for Defense Policy", company_domain: "nsc.gov", job_start_date: "2009-01-01", job_end_date: "2014-08-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "Ph.D. International Relations" }, { degree: "M.A. Security Studies" }, { degree: "B.A. Political Science" }],
        skills: ["defense policy", "strategic analysis", "China/Russia threat assessment", "wargaming"],
        certifications: [],
      },
      {
        first_name: "Carolyn", last_name: "Walsh", full_name: "Carolyn Walsh",
        headline: "Senior Research Analyst",
        about_me: null,
        location: { city: "Arlington", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/carolyn-walsh-research",
        connections_count: 234,
        profile_picture_url: null,
        experiences: [
          { company_name: "Peakstone Research Institute", job_title: "Senior Research Analyst", company_domain: "peakstoneri.com", job_start_date: "2019-06-01", job_end_date: null, job_is_current: true, job_location: { city: "Arlington", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "M.A. International Security Affairs" }, { degree: "B.A. History" }],
        skills: ["policy analysis", "research methodology", "qualitative analysis", "report writing"],
        certifications: [],
      },
    ],
  },
  {
    uei: "QRS159357486", // Tidewater Ship Repair
    people: [
      {
        first_name: "Clifford", last_name: "Boateng", full_name: "Clifford Boateng",
        headline: "General Manager — Ship Repair Operations",
        about_me: "Naval shipyard leader with 25 years of surface combatant overhaul experience at Norfolk.",
        location: { city: "Norfolk", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/clifford-boateng-shipyard",
        connections_count: 412,
        profile_picture_url: null,
        experiences: [
          { company_name: "Tidewater Ship Repair", job_title: "General Manager", company_domain: "tidewatershiprepair.com", job_start_date: "2012-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Norfolk", state_code: "VA", country_code: "US" } },
          { company_name: "Newport News Shipbuilding", job_title: "Production Superintendent", company_domain: "nns.com", job_start_date: "1998-06-01", job_end_date: "2011-12-31", job_is_current: false, job_location: { city: "Newport News", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Marine Engineering Technology" }],
        skills: ["shipyard management", "dry-dock operations", "surface combatants", "production scheduling"],
        certifications: [],
      },
    ],
  },
  {
    uei: "WXY135791357", // Meridian IT Federal
    people: [
      {
        first_name: "Beth", last_name: "Kowalski", full_name: "Beth Kowalski",
        headline: "VP of Modernization — SSA Programs",
        about_me: "Expert in mainframe modernization and legacy system migration for large federal agencies.",
        location: { city: "Baltimore", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/beth-kowalski-modernize",
        connections_count: 378,
        profile_picture_url: null,
        experiences: [
          { company_name: "Meridian IT Federal", job_title: "VP of Modernization", company_domain: "meridianitfed.com", job_start_date: "2015-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Baltimore", state_code: "MD", country_code: "US" } },
          { company_name: "IBM Federal", job_title: "Principal Architect", company_domain: "ibm.com", job_start_date: "2005-06-01", job_end_date: "2014-12-31", job_is_current: false, job_location: { city: "Bethesda", state_code: "MD", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Information Systems Management" }, { degree: "B.S. Computer Science" }],
        skills: ["mainframe modernization", "COBOL", "IBM Z", "migration strategy", "federal IT"],
        certifications: [{ authority: "IBM", name: "IBM Certified System Architect" }],
      },
      {
        first_name: "Jason", last_name: "DiMaggio", full_name: "Jason DiMaggio",
        headline: "Technical Program Manager",
        about_me: null,
        location: { city: "Columbia", state_code: "MD", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/jason-dimaggio-tpm",
        connections_count: 291,
        profile_picture_url: null,
        experiences: [
          { company_name: "Meridian IT Federal", job_title: "Technical Program Manager", company_domain: "meridianitfed.com", job_start_date: "2020-08-01", job_end_date: null, job_is_current: true, job_location: { city: "Baltimore", state_code: "MD", country_code: "US" } },
        ],
        education: [{ degree: "M.S. IT Management" }],
        skills: ["SAFe agile", "program management", "DevOps", "federal IT delivery"],
        certifications: [{ authority: "Scaled Agile", name: "SAFe Program Consultant (SPC)" }],
      },
    ],
  },
  {
    uei: "ZAB579135791", // Skyview Drone Technologies
    people: [
      {
        first_name: "Nathan", last_name: "Flores", full_name: "Nathan Flores",
        headline: "Chief Product Officer — UAS Systems",
        about_me: "Engineer and product leader building unmanned aerial system components for DoD contracts.",
        location: { city: "Tucson", state_code: "AZ", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/nathan-flores-uas",
        connections_count: 356,
        profile_picture_url: null,
        experiences: [
          { company_name: "Skyview Drone Technologies", job_title: "Chief Product Officer", company_domain: "skyviewdrones.com", job_start_date: "2017-04-01", job_end_date: null, job_is_current: true, job_location: { city: "Tucson", state_code: "AZ", country_code: "US" } },
          { company_name: "General Atomics", job_title: "Systems Engineer", company_domain: "ga.com", job_start_date: "2012-01-01", job_end_date: "2017-03-31", job_is_current: false, job_location: { city: "San Diego", state_code: "CA", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Aerospace Engineering" }, { degree: "B.S. Mechanical Engineering" }],
        skills: ["UAS design", "propulsion", "avionics", "DoD acquisition", "systems engineering"],
        certifications: [],
      },
    ],
  },
  {
    uei: "CDE802468024", // Northbrook Analytics
    people: [
      {
        first_name: "Timothy", last_name: "Okafor", full_name: "Timothy Okafor",
        headline: "Director of Economic Research — Commerce Programs",
        about_me: "Economist and policy analyst specializing in federal economic development program evaluation.",
        location: { city: "Chicago", state_code: "IL", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/timothy-okafor-econ",
        connections_count: 287,
        profile_picture_url: null,
        experiences: [
          { company_name: "Northbrook Analytics", job_title: "Director of Economic Research", company_domain: "northbrookanalytics.com", job_start_date: "2019-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Chicago", state_code: "IL", country_code: "US" } },
          { company_name: "US Dept of Commerce", job_title: "Economist", company_domain: "commerce.gov", job_start_date: "2012-09-01", job_end_date: "2018-12-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "Ph.D. Economics" }, { degree: "M.A. Applied Economics" }],
        skills: ["econometrics", "program evaluation", "STATA", "R", "policy analysis"],
        certifications: [],
      },
    ],
  },
  {
    uei: "FGH913579135", // Silverline Engineering
    people: [
      {
        first_name: "Paula", last_name: "Hendricks", full_name: "Paula Hendricks",
        headline: "Principal Structural Engineer — DoD Facilities",
        about_me: "Licensed structural engineer with 25 years designing and inspecting DoD facility renovations.",
        location: { city: "Pittsburgh", state_code: "PA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/paula-hendricks-pe",
        connections_count: 356,
        profile_picture_url: null,
        experiences: [
          { company_name: "Silverline Engineering", job_title: "Principal Structural Engineer", company_domain: "silverlineeng.com", job_start_date: "2010-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Pittsburgh", state_code: "PA", country_code: "US" } },
          { company_name: "US Army Corps of Engineers", job_title: "Civil Engineer", company_domain: "usace.army.mil", job_start_date: "1998-06-01", job_end_date: "2009-12-31", job_is_current: false, job_location: { city: "Pittsburgh", state_code: "PA", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Structural Engineering" }, { degree: "B.S. Civil Engineering" }],
        skills: ["structural analysis", "ETABS", "SAP2000", "seismic design", "DoD UFC standards"],
        certifications: [{ authority: "NCEES", name: "PE — Structural" }],
      },
      {
        first_name: "Victor", last_name: "Salinas", full_name: "Victor Salinas",
        headline: "Project Manager — Federal Facilities",
        about_me: null,
        location: { city: "Harrisburg", state_code: "PA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/victor-salinas-pm",
        connections_count: 198,
        profile_picture_url: null,
        experiences: [
          { company_name: "Silverline Engineering", job_title: "Project Manager", company_domain: "silverlineeng.com", job_start_date: "2021-05-01", job_end_date: null, job_is_current: true, job_location: { city: "Harrisburg", state_code: "PA", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Construction Engineering Technology" }],
        skills: ["project delivery", "scheduling", "Primavera P6", "cost control"],
        certifications: [{ authority: "PMI", name: "PMP" }],
      },
    ],
  },
  {
    uei: "NOP141516171", // Highmark Staffing Group
    people: [
      {
        first_name: "Gwendolyn", last_name: "Pierce", full_name: "Gwendolyn Pierce",
        headline: "VP of Staffing Operations — GSA Programs",
        about_me: "Staffing industry veteran placing IT talent across GSA digital transformation initiatives.",
        location: { city: "Dallas", state_code: "TX", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/gwendolyn-pierce-staffing",
        connections_count: 487,
        profile_picture_url: null,
        experiences: [
          { company_name: "Highmark Staffing Group", job_title: "VP Staffing Operations", company_domain: "highmarkstaffing.com", job_start_date: "2015-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Dallas", state_code: "TX", country_code: "US" } },
          { company_name: "Robert Half Government", job_title: "Regional Manager", company_domain: "roberthalf.com", job_start_date: "2009-01-01", job_end_date: "2014-12-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "B.B.A. Human Resources Management" }],
        skills: ["talent acquisition", "federal staffing", "workforce planning", "GSA MAS"],
        certifications: [{ authority: "SHRM", name: "SHRM-SCP" }],
      },
      {
        first_name: "Arthur", last_name: "Manning", full_name: "Arthur Manning",
        headline: "Capture Manager — IT Staffing Contracts",
        about_me: null,
        location: { city: "Fort Worth", state_code: "TX", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/arthur-manning-capture",
        connections_count: 234,
        profile_picture_url: null,
        experiences: [
          { company_name: "Highmark Staffing Group", job_title: "Capture Manager", company_domain: "highmarkstaffing.com", job_start_date: "2019-07-01", job_end_date: null, job_is_current: true, job_location: { city: "Fort Worth", state_code: "TX", country_code: "US" } },
        ],
        education: [{ degree: "M.B.A." }, { degree: "B.S. Business Administration" }],
        skills: ["capture management", "proposal writing", "GSA Schedule", "IDIQ vehicles"],
        certifications: [{ authority: "APMP", name: "APMP Foundation" }],
      },
    ],
  },
  {
    uei: "TUV222324252", // Frontier Energy Tech
    people: [
      {
        first_name: "Sophia", last_name: "Brennan", full_name: "Sophia Brennan",
        headline: "Chief Engineer — Microreactor Programs",
        about_me: "Nuclear engineer leading microreactor pilot program support for DOE demonstration projects.",
        location: { city: "Albuquerque", state_code: "NM", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/sophia-brennan-nuclear",
        connections_count: 312,
        profile_picture_url: null,
        experiences: [
          { company_name: "Frontier Energy Tech", job_title: "Chief Engineer", company_domain: "frontierenergytech.com", job_start_date: "2020-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Albuquerque", state_code: "NM", country_code: "US" } },
          { company_name: "Sandia National Labs", job_title: "Research Engineer", company_domain: "sandia.gov", job_start_date: "2014-06-01", job_end_date: "2019-12-31", job_is_current: false, job_location: { city: "Albuquerque", state_code: "NM", country_code: "US" } },
        ],
        education: [{ degree: "Ph.D. Nuclear Engineering" }, { degree: "B.S. Mechanical Engineering" }],
        skills: ["nuclear systems", "reactor design", "thermal hydraulics", "DOE regulations"],
        certifications: [],
      },
      {
        first_name: "Isaac", last_name: "Rosenberg", full_name: "Isaac Rosenberg",
        headline: "Senior Systems Engineer — Energy Programs",
        about_me: null,
        location: { city: "Santa Fe", state_code: "NM", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/isaac-rosenberg-energy",
        connections_count: 178,
        profile_picture_url: null,
        experiences: [
          { company_name: "Frontier Energy Tech", job_title: "Senior Systems Engineer", company_domain: "frontierenergytech.com", job_start_date: "2021-09-01", job_end_date: null, job_is_current: true, job_location: { city: "Santa Fe", state_code: "NM", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Electrical Engineering" }],
        skills: ["power systems", "control systems", "MATLAB/Simulink", "grid integration"],
        certifications: [],
      },
      {
        first_name: "Diane", last_name: "Kwon", full_name: "Diane Kwon",
        headline: "Program Manager — DOE Contracts",
        about_me: null,
        location: { city: "Albuquerque", state_code: "NM", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/diane-kwon-pm",
        connections_count: 245,
        profile_picture_url: null,
        experiences: [
          { company_name: "Frontier Energy Tech", job_title: "Program Manager", company_domain: "frontierenergytech.com", job_start_date: "2022-03-01", job_end_date: null, job_is_current: true, job_location: { city: "Albuquerque", state_code: "NM", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Engineering Management" }],
        skills: ["program management", "DOE contracting", "schedule management", "earned value"],
        certifications: [{ authority: "PMI", name: "PMP" }],
      },
    ],
  },
  {
    uei: "ZAB303132333", // Apex Cloud Partners
    people: [
      {
        first_name: "Eugene", last_name: "Lambert", full_name: "Eugene Lambert",
        headline: "Zero Trust Architecture Lead",
        about_me: "Cloud security architect specializing in zero trust network implementations for DoD networks.",
        location: { city: "Springfield", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/eugene-lambert-zt",
        connections_count: 421,
        profile_picture_url: null,
        experiences: [
          { company_name: "Apex Cloud Partners", job_title: "Zero Trust Architecture Lead", company_domain: "apexcloudpartners.com", job_start_date: "2019-11-01", job_end_date: null, job_is_current: true, job_location: { city: "Springfield", state_code: "VA", country_code: "US" } },
          { company_name: "Leidos", job_title: "Senior Cloud Architect", company_domain: "leidos.com", job_start_date: "2014-01-01", job_end_date: "2019-10-31", job_is_current: false, job_location: { city: "Reston", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Information Security" }, { degree: "B.S. Computer Engineering" }],
        skills: ["zero trust", "SASE", "identity and access management", "AWS GovCloud", "Azure Government"],
        certifications: [{ authority: "ISC2", name: "CISSP" }, { authority: "Azure", name: "AZ-500 Security Engineer" }],
      },
      {
        first_name: "Rebecca", last_name: "McIntosh", full_name: "Rebecca McIntosh",
        headline: "Cloud Migration Architect",
        about_me: null,
        location: { city: "Fairfax", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/rebecca-mcintosh-cloud",
        connections_count: 289,
        profile_picture_url: null,
        experiences: [
          { company_name: "Apex Cloud Partners", job_title: "Cloud Migration Architect", company_domain: "apexcloudpartners.com", job_start_date: "2021-04-01", job_end_date: null, job_is_current: true, job_location: { city: "Fairfax", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Information Systems" }],
        skills: ["cloud architecture", "migration planning", "AWS", "Terraform", "CI/CD"],
        certifications: [{ authority: "AWS", name: "AWS Solutions Architect Associate" }],
      },
      {
        first_name: "Randall", last_name: "Figueroa", full_name: "Randall Figueroa",
        headline: "DevSecOps Engineer",
        about_me: null,
        location: { city: null, state_code: null, country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/randall-figueroa-devsecops",
        connections_count: 156,
        profile_picture_url: null,
        experiences: [
          { company_name: "Apex Cloud Partners", job_title: "DevSecOps Engineer", company_domain: "apexcloudpartners.com", job_start_date: "2022-06-01", job_end_date: null, job_is_current: true, job_location: { city: null, state_code: null, country_code: null } },
        ],
        education: [{ degree: "B.S. Cybersecurity" }],
        skills: ["CI/CD pipelines", "container security", "SAST/DAST", "GitHub Actions", "Kubernetes"],
        certifications: [{ authority: "CompTIA", name: "Security+" }],
      },
    ],
  },
  {
    uei: "EFG555666777", // Cascade Training Associates
    people: [
      {
        first_name: "Laura", last_name: "Bergstrom", full_name: "Laura Bergstrom",
        headline: "Director of Leadership Development Programs",
        about_me: "Instructional designer and L&D director creating leadership curricula for DOE employees.",
        location: { city: "Seattle", state_code: "WA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/laura-bergstrom-ld",
        connections_count: 334,
        profile_picture_url: null,
        experiences: [
          { company_name: "Cascade Training Associates", job_title: "Director of Leadership Development", company_domain: "cascadetraining.com", job_start_date: "2018-09-01", job_end_date: null, job_is_current: true, job_location: { city: "Seattle", state_code: "WA", country_code: "US" } },
          { company_name: "OPM Federal Training Institute", job_title: "Training Specialist", company_domain: "opm.gov", job_start_date: "2012-01-01", job_end_date: "2018-08-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Instructional Design" }, { degree: "B.A. Education" }],
        skills: ["instructional design", "leadership development", "adult learning", "e-learning", "Kirkpatrick evaluation"],
        certifications: [{ authority: "ATD", name: "Certified Professional in Talent Development (CPTD)" }],
      },
      {
        first_name: "Martin", last_name: "Hayashi", full_name: "Martin Hayashi",
        headline: "Senior Facilitator",
        about_me: null,
        location: { city: "Bellevue", state_code: "WA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/martin-hayashi-facilitator",
        connections_count: 198,
        profile_picture_url: null,
        experiences: [
          { company_name: "Cascade Training Associates", job_title: "Senior Facilitator", company_domain: "cascadetraining.com", job_start_date: "2020-02-01", job_end_date: null, job_is_current: true, job_location: { city: "Bellevue", state_code: "WA", country_code: "US" } },
        ],
        education: [{ degree: "M.A. Organizational Development" }],
        skills: ["facilitation", "executive coaching", "change management", "workshop design"],
        certifications: [{ authority: "ICF", name: "Associate Certified Coach (ACC)" }],
      },
    ],
  },
  {
    uei: "LMN135024681", // Overwatch Intelligence Group
    people: [
      {
        first_name: "Catherine", last_name: "Doyle", full_name: "Catherine Doyle",
        headline: "Director of Intelligence Analysis",
        about_me: "Former CIA senior analyst now leading OSINT and strategic intelligence for the private sector.",
        location: { city: "McLean", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/catherine-doyle-intel",
        connections_count: 500,
        profile_picture_url: null,
        experiences: [
          { company_name: "Overwatch Intelligence Group", job_title: "Director of Intelligence Analysis", company_domain: "overwatchig.com", job_start_date: "2016-03-01", job_end_date: null, job_is_current: true, job_location: { city: "McLean", state_code: "VA", country_code: "US" } },
          { company_name: "CIA", job_title: null, company_domain: "cia.gov", job_start_date: "2000-07-01", job_end_date: "2016-02-28", job_is_current: false, job_location: { city: null, state_code: null, country_code: "US" } },
        ],
        education: [{ degree: "M.A. Intelligence Studies" }, { degree: "B.A. International Relations" }],
        skills: ["OSINT", "HUMINT", "strategic intelligence", "threat assessment", "briefing senior leadership"],
        certifications: [],
      },
      {
        first_name: "Phillip", last_name: "Russo", full_name: "Phillip Russo",
        headline: "Senior Intelligence Analyst",
        about_me: null,
        location: { city: "Fairfax", state_code: "VA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/phillip-russo-intel",
        connections_count: 234,
        profile_picture_url: null,
        experiences: [
          { company_name: "Overwatch Intelligence Group", job_title: "Senior Intelligence Analyst", company_domain: "overwatchig.com", job_start_date: "2020-11-01", job_end_date: null, job_is_current: true, job_location: { city: "Fairfax", state_code: "VA", country_code: "US" } },
        ],
        education: [{ degree: "M.A. Security Studies" }],
        skills: ["geopolitical analysis", "open-source research", "Palantir", "link analysis"],
        certifications: [],
      },
      {
        first_name: "Grace", last_name: "Yamamoto", full_name: "Grace Yamamoto",
        headline: "Technical Collection Analyst",
        about_me: null,
        location: { city: null, state_code: null, country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/grace-yamamoto-tech",
        connections_count: 189,
        profile_picture_url: null,
        experiences: [
          { company_name: "Overwatch Intelligence Group", job_title: "Technical Collection Analyst", company_domain: "overwatchig.com", job_start_date: "2022-03-01", job_end_date: null, job_is_current: true, job_location: { city: null, state_code: null, country_code: null } },
        ],
        education: [{ degree: "B.S. Computer Science" }],
        skills: ["signals collection", "data exploitation", "Python scripting", "geospatial analysis"],
        certifications: [],
      },
    ],
  },
  {
    uei: "XYZ626364656", // Appalachian Medical Services
    people: [
      {
        first_name: "Dr. Samuel", last_name: "Pruitt", full_name: "Dr. Samuel Pruitt",
        headline: "Chief Medical Officer — Rural Telehealth",
        about_me: "Family medicine physician expanding telehealth access for rural and tribal populations.",
        location: { city: "Charleston", state_code: "WV", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/dr-samuel-pruitt-md",
        connections_count: 334,
        profile_picture_url: null,
        experiences: [
          { company_name: "Appalachian Medical Services", job_title: "Chief Medical Officer", company_domain: "appalachianmed.com", job_start_date: "2016-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Charleston", state_code: "WV", country_code: "US" } },
          { company_name: "Indian Health Service", job_title: "Staff Physician", company_domain: "ihs.gov", job_start_date: "2010-07-01", job_end_date: "2015-12-31", job_is_current: false, job_location: { city: "Clarksburg", state_code: "WV", country_code: "US" } },
        ],
        education: [{ degree: "M.D." }, { degree: "B.S. Pre-Medicine" }],
        skills: ["telemedicine", "family medicine", "rural health", "IHS programs"],
        certifications: [{ authority: "ABFM", name: "Board Certified Family Medicine" }],
      },
      {
        first_name: "Rose", last_name: "Caldwell", full_name: "Rose Caldwell",
        headline: "Telehealth Program Coordinator",
        about_me: null,
        location: { city: "Morgantown", state_code: "WV", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/rose-caldwell-telehealth",
        connections_count: 167,
        profile_picture_url: null,
        experiences: [
          { company_name: "Appalachian Medical Services", job_title: "Program Coordinator", company_domain: "appalachianmed.com", job_start_date: "2020-05-01", job_end_date: null, job_is_current: true, job_location: { city: "Morgantown", state_code: "WV", country_code: "US" } },
        ],
        education: [{ degree: "B.S. Health Services Administration" }],
        skills: ["telehealth platform", "patient scheduling", "EHR systems", "care coordination"],
        certifications: [],
      },
    ],
  },
  {
    uei: "UVW585960616", // Ridgeline Security Consulting
    people: [
      {
        first_name: "Gregory", last_name: "Stafford", full_name: "Gregory Stafford",
        headline: "Principal — Physical Security Assessments",
        about_me: "Former FBI special agent conducting physical security vulnerability assessments at critical installations.",
        location: { city: "Colorado Springs", state_code: "CO", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/gregory-stafford-security",
        connections_count: 378,
        profile_picture_url: null,
        experiences: [
          { company_name: "Ridgeline Security Consulting", job_title: "Principal Security Consultant", company_domain: "ridgelinesec.com", job_start_date: "2017-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Colorado Springs", state_code: "CO", country_code: "US" } },
          { company_name: "FBI", job_title: null, company_domain: "fbi.gov", job_start_date: "2000-01-01", job_end_date: "2016-12-31", job_is_current: false, job_location: { city: null, state_code: null, country_code: "US" } },
        ],
        education: [{ degree: "B.S. Criminal Justice" }],
        skills: ["vulnerability assessment", "CPTED", "access control", "surveillance systems"],
        certifications: [{ authority: "ASIS", name: "Physical Security Professional (PSP)" }],
      },
      {
        first_name: "Kelly", last_name: "Ashworth", full_name: "Kelly Ashworth",
        headline: "Security Assessment Analyst",
        about_me: null,
        location: { city: "Denver", state_code: "CO", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/kelly-ashworth-sec",
        connections_count: 134,
        profile_picture_url: null,
        experiences: [
          { company_name: "Ridgeline Security Consulting", job_title: "Security Assessment Analyst", company_domain: "ridgelinesec.com", job_start_date: "2021-10-01", job_end_date: null, job_is_current: true, job_location: { city: "Denver", state_code: "CO", country_code: "US" } },
        ],
        education: [{ degree: "B.A. Security Management" }],
        skills: ["security auditing", "risk matrix", "report writing", "site surveys"],
        certifications: [{ authority: "ASIS", name: "Associate Protection Professional (APP)" }],
      },
    ],
  },
  {
    uei: "ABC666768697", // Mosaic HR Solutions
    people: [
      {
        first_name: "Tanya", last_name: "Williamson", full_name: "Tanya Williamson",
        headline: "Director of Federal HR Analytics",
        about_me: "HR analytics leader supporting OPM strategic talent and workforce planning initiatives.",
        location: { city: "Atlanta", state_code: "GA", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/tanya-williamson-hr",
        connections_count: 412,
        profile_picture_url: null,
        experiences: [
          { company_name: "Mosaic HR Solutions", job_title: "Director of Federal HR Analytics", company_domain: "mosaichr.com", job_start_date: "2019-06-01", job_end_date: null, job_is_current: true, job_location: { city: "Atlanta", state_code: "GA", country_code: "US" } },
          { company_name: "OPM", job_title: "Human Capital Analyst", company_domain: "opm.gov", job_start_date: "2014-01-01", job_end_date: "2019-05-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Human Resources Management" }, { degree: "B.A. Psychology" }],
        skills: ["workforce analytics", "people data", "OPM regulations", "Workday", "Tableau"],
        certifications: [{ authority: "SHRM", name: "SHRM-SCP" }],
      },
    ],
  },
  {
    uei: "PQR868788899", // Harbor Light Analytics
    people: [
      {
        first_name: "Margaret", last_name: "Dubois", full_name: "Margaret Dubois",
        headline: "Senior Labor Market Statistician",
        about_me: "Statistician providing BLS workforce program analysis and labor market reporting support.",
        location: { city: "Portland", state_code: "ME", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/margaret-dubois-bls",
        connections_count: 198,
        profile_picture_url: null,
        experiences: [
          { company_name: "Harbor Light Analytics", job_title: "Senior Statistician", company_domain: "harborlightanalytics.com", job_start_date: "2017-03-01", job_end_date: null, job_is_current: true, job_location: { city: "Portland", state_code: "ME", country_code: "US" } },
          { company_name: "Bureau of Labor Statistics", job_title: "Economist", company_domain: "bls.gov", job_start_date: "2009-08-01", job_end_date: "2017-02-28", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Applied Statistics" }, { degree: "B.A. Economics" }],
        skills: ["labor economics", "survey methodology", "SAS", "R", "STATA"],
        certifications: [],
      },
    ],
  },
  {
    uei: "JKL787980818", // Lakeside Learning Systems
    people: [
      {
        first_name: "Carol", last_name: "Tanner", full_name: "Carol Tanner",
        headline: "Program Director — Adult Literacy",
        about_me: "Education specialist managing federally-funded adult literacy and workforce readiness programs.",
        location: { city: "Madison", state_code: "WI", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/carol-tanner-literacy",
        connections_count: 287,
        profile_picture_url: null,
        experiences: [
          { company_name: "Lakeside Learning Systems", job_title: "Program Director", company_domain: "lakesidelearning.com", job_start_date: "2018-01-01", job_end_date: null, job_is_current: true, job_location: { city: "Madison", state_code: "WI", country_code: "US" } },
          { company_name: "Dept of Education", job_title: "Education Program Specialist", company_domain: "ed.gov", job_start_date: "2011-09-01", job_end_date: "2017-12-31", job_is_current: false, job_location: { city: "Washington", state_code: "DC", country_code: "US" } },
        ],
        education: [{ degree: "M.Ed. Curriculum and Instruction" }, { degree: "B.A. Education" }],
        skills: ["adult education", "WIOA compliance", "curriculum design", "grant management"],
        certifications: [],
      },
      {
        first_name: "Douglas", last_name: "Petersen", full_name: "Douglas Petersen",
        headline: "Technology Director — Learning Platforms",
        about_me: null,
        location: { city: "Milwaukee", state_code: "WI", country_code: "US", continent: "North America" },
        linkedin_url: "https://www.linkedin.com/in/douglas-petersen-tech",
        connections_count: 167,
        profile_picture_url: null,
        experiences: [
          { company_name: "Lakeside Learning Systems", job_title: "Technology Director", company_domain: "lakesidelearning.com", job_start_date: "2021-07-01", job_end_date: null, job_is_current: true, job_location: { city: "Milwaukee", state_code: "WI", country_code: "US" } },
        ],
        education: [{ degree: "M.S. Educational Technology" }],
        skills: ["LMS administration", "Canvas", "eLearning development", "Articulate 360"],
        certifications: [],
      },
    ],
  },
];

// ── Build flat array and lookup map ───────────────────────────────────────────

export const PEOPLE_FIXTURE: Person[] = _raw.flatMap((entry) => entry.people);

export const PEOPLE_BY_UEI: Record<string, Person[]> = Object.fromEntries(
  _raw.map((entry) => [entry.uei, entry.people])
);

export function getPeopleByUei(uei: string): Person[] {
  return PEOPLE_BY_UEI[uei] ?? [];
}
