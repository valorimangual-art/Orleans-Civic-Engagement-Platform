# Database Schema Baseline

## Status and authority

This document records the live-schema information verified by the project owner as of July 21, 2026, together with a separate inventory of frontend-observed usage.

The live Supabase database is newer than the SQL artifacts committed in this repository. The live database is authoritative. Repository SQL files are historical, are not authoritative, and must not be executed or treated as a complete migration history without explicit review.

“Verified” in this document means confirmed by the project owner. It does not mean that column types, constraints, policies, or relationships have been independently inspected from Supabase.

## Verified live baseline

### Authentication and profiles

- Supabase Authentication is in use.
- The `profiles` table exists.
- Volunteers are linked to authentication/profile data through `volunteers.profile_id`.
- Row Level Security is enabled on the relevant public tables.

The exact `profiles` columns, the data type and foreign key definition for `volunteers.profile_id`, authorization roles, grants, and individual RLS policy expressions have not yet been technically verified.

### Operational tables

The following operational tables are verified as present or already established project data domains:

- `volunteers`
- `outreach_events`
- `community_partners`
- `polling_locations`

The repository frontend also references the following tables, but their current live definitions still require technical verification:

- `precincts`
- `outreach_opportunities`
- `event_volunteers`
- `partner_precincts`
- `voter_contacts`

Frontend references establish application expectations, not proof of the live table structure.

### Verified volunteer fields

The live `volunteers` table includes:

- `profile_id`
- `street_address`
- `city`
- `state`
- `zip_code`
- `neighborhood`
- `ward`
- `precinct`
- `polling_location`
- `council_district`
- `planning_district`
- `latitude`
- `longitude`
- `outreach_experience`
- `admin_notes`
- `last_contacted_at`
- `updated_at`

The frontend also expects legacy or existing volunteer attributes such as name, phone, email, languages, skills, transportation, availability, status, creation time, and a volunteer identifier. Their exact live column names and definitions have not yet been technically verified.

No type, default, nullability, uniqueness, check constraint, index, trigger, or column-level access claim is made here unless separately verified.

### Verified normalized geography tables

The live database includes:

- `geography_areas`
- `precinct_area_intersections`
- `import_batches`
- `voter_metric_snapshots`

The following details require verification before development relies on them:

- Primary and foreign keys
- Geography type hierarchy and identifiers
- Geometry or geography column types and coordinate reference systems
- Effective dates and versioning rules
- Import lineage and batch status fields
- Intersection weighting or overlap methodology
- Voter metric dimensions, dates, and aggregation rules
- Indexes, spatial indexes, constraints, triggers, and views
- RLS policies and role access

## Repository-observed data interactions

The canonical frontend under `Website/` currently makes browser-side reads or inserts against:

| Table | Observed application responsibility | Live definition status |
| --- | --- | --- |
| `precincts` | Precinct attributes, registration metrics, map association, and filtering | Requires verification |
| `volunteers` | Intake, directory, contact details, skills, availability, status, and coverage | Presence and expanded fields verified; full definition requires verification |
| `outreach_events` | Event details, geography, outcome totals, and notes | Presence verified; full definition requires verification |
| `polling_locations` | Polling-location directory | Presence verified; full definition requires verification |
| `community_partners` | Partner details and status | Presence verified; full definition requires verification |
| `outreach_opportunities` | Potential outreach activities | Requires verification |
| `event_volunteers` | Event roster, role, hours, score, and notes | Requires verification |
| `partner_precincts` | Partner-to-geography associations | Requires verification |
| `voter_contacts` | Individual outreach-contact outcomes | Requires verification |

This table documents current code expectations only. It does not validate table existence, column names, relationships, or access policies in the live database.

## Relationships requiring technical verification

- Authentication user to `profiles`
- `profiles` to `volunteers.profile_id`
- Volunteers to event rosters and outreach history
- Events to event rosters
- Partners to geographic areas
- Polling locations to precincts or normalized geography areas
- Precinct records to `geography_areas`
- `precinct_area_intersections` relationships and cardinalities
- `import_batches` relationships to imported geography or metric data
- `voter_metric_snapshots` relationships to geography and snapshot dates

## Security verification required

RLS enablement on relevant public tables is verified by the project owner. The following remain unverified:

- Policy names and expressions
- Policies by operation: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`
- Public versus authenticated intake permissions
- Organizer authorization source
- Ownership predicates
- Column exposure through broad frontend `select('*')` queries
- Grants to `anon`, `authenticated`, and other roles
- Views and whether they use invoker security
- Functions, triggers, and any security-definer behavior
- Storage buckets and policies, if any

No security-sensitive frontend change should rely on assumptions about these items.

## Historical repository SQL

The following files are historical artifacts:

- `Website/event_roster_migration.sql`
- `Website/voter_tracking_migration.sql`
- `Website/seed_data.sql`

They may explain earlier application expectations but do not describe the current live schema. In particular, legacy policy statements must not be assumed to match current authentication or RLS requirements.

## Verification checklist

Before this document is promoted from baseline to an authoritative technical reference, verify from the live Supabase project:

1. Tables, views, functions, and exposed schemas.
2. Columns, types, defaults, nullability, generated values, and comments.
3. Primary keys, foreign keys, unique constraints, and check constraints.
4. Indexes, including spatial indexes.
5. RLS enablement and every policy expression.
6. Role grants and Data API exposure.
7. Authentication/profile creation and update flow.
8. Organizer authorization and public-intake boundaries.
9. Geography types, geometries, intersections, and import lineage.
10. Metric snapshot dimensions and update cadence.
11. Differences between live schema and frontend assumptions.
12. A safe, versioned migration baseline for future changes.

Any future schema change requires prior approval and must update this document after verification.
