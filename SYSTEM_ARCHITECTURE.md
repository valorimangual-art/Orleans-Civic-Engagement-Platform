# System Architecture

## Purpose

The Orleans Civic Engagement Platform supports nonpartisan organizations that organize, coordinate, and measure in-person community outreach. Geography connects volunteers, events, partners, polling locations, administrative areas, and outreach history.

Version 1 should prioritize work that answers:

- Who can help?
- Where should we go?
- What happened there?

## Current system context

The application is a static, multi-page website. Each page runs in the browser and communicates directly with Supabase through the Supabase JavaScript client.

```text
Browser
  |-- Static HTML pages
  |-- Shared CSS
  |-- Inline page-specific JavaScript
  |-- Leaflet map rendering
  |-- OpenStreetMap tiles
  |-- Local precinct GeoJSON
  `-- Supabase JavaScript client
          `-- Supabase Data API, Auth, and PostgreSQL
```

There is no active frontend framework, application server, bundler, or required build step. `Website/app.py` is a historical Flask proof of concept and is not part of the deployed application architecture.

## Source and deployment boundaries

- `Website/` is the canonical application source.
- `docs/` is the temporary GitHub Pages deployment and rollback copy.
- `docs/` is not an independent source tree and should not receive feature changes directly.
- A later approved phase may replace the duplicate deployment copy with GitHub Actions publishing `Website/` directly.
- No deployment workflow change is part of the current documentation baseline.

## Frontend organization

The application uses normal HTML navigation between pages. Most page-specific behavior is contained in inline `<script>` blocks. Shared presentation rules are in `Website/style.css`, and `Website/supabase-config.js` creates the browser Supabase client.

### Operational areas

| Area | Current pages and behavior |
| --- | --- |
| Overview | Summary metrics, volunteer status, priority areas, and a mini map |
| GIS map | Precinct polygons grouped by precinct, ward, or neighborhood with operational metrics |
| Precincts | Geographic directory, filters, sorting, and selected-precinct activity |
| Volunteers | Intake, directory, detail, event history, and roster-derived hours |
| Events | Event logging, detail, outcomes, and volunteer rosters |
| Partners | Partner intake, directory, detail, and geographic associations |
| Polling locations | Searchable location directory |
| Opportunities | Outreach-opportunity scouting and listing |
| Outreach tracking | Event totals and individual contact outcomes |

## Geography architecture

The deployed frontend currently joins local precinct polygons to Supabase precinct records using a precinct/ward identifier. Ward and neighborhood summaries are calculated in browser JavaScript by grouping precinct records. Volunteer coverage currently depends on the geographic values available on volunteer records.

The live Supabase tables and their columns have been inspected. Primary keys, listed foreign keys, enums, row counts, and RLS-enabled status were retrieved from the live Supabase project. Full RLS policy expressions, grants, indexes, triggers, functions, and operational behavior still require separate verification. `DATABASE_SCHEMA.md` remains the detailed schema inventory.

Future geography work should reuse the live normalized model rather than create competing geographic fields or infer schema from legacy SQL.

## Supabase boundary

Supabase provides:

- Authentication
- User profiles
- Operational PostgreSQL data
- Row Level Security for relevant public tables
- Browser-accessible data APIs

The live database is authoritative. SQL files committed under `Website/` are historical artifacts and are not a reliable description of the deployed schema.

The browser must never receive a service-role or secret key. Access to public intake, authenticated records, and organizer-only data must be enforced by verified RLS policies and appropriate frontend session behavior.

## Authentication and authorization

The verified live baseline includes `profiles` and a volunteer-to-authentication association through `volunteers.profile_id`. Relevant public tables have RLS enabled.

The exact foreign key, profile columns, roles, policy expressions, grants, and organizer authorization model still require technical verification. Frontend code must not assume that authentication alone grants organizer access.

## Public and organizer data

Volunteer-supplied information includes identity, contact information, address, languages, skills, transportation, availability, and previous outreach experience. Geographic attributes should be determined by the system rather than requested from volunteers.

Organizer-only information includes contact status, training certifications, administrative notes, volunteer hours, event history, and last-contacted information. Organizer-only fields must not be exposed by public intake queries or public-facing reads.

## Current architectural debt

- `Website/` and `docs/` duplicate the deployed application manually.
- Page-specific JavaScript and navigation are repeated across HTML files.
- Many reads request all columns instead of selecting only required fields.
- Database error handling and loading states are inconsistent.
- Some database values are rendered through HTML template strings and require an output-escaping review.
- Repository SQL does not track the current live database.
- No automated application tests or deployment checks are committed.
- Prototype, GIS, archive, and active application files are not yet cleanly separated.

These issues should be addressed through focused, separately approved phases rather than a large rewrite.

## Architectural constraints

- Preserve vanilla HTML, CSS, and JavaScript.
- Do not redesign authentication unless explicitly requested.
- Do not change the database schema without prior approval.
- Treat geography as a shared platform capability.
- Prefer existing code and small changes over duplicated or replacement implementations.
- Keep the map central to operational workflows.
