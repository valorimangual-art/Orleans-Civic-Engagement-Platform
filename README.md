# Orleans Civic Engagement Platform

The Orleans Civic Engagement Platform is a nonpartisan civic operations platform for volunteer organizations coordinating and measuring in-person community outreach.

Geography is the central organizing principle. Features should help answer:

1. Who can help?
2. Where should we go?
3. What happened there?

## Current stack

- Vanilla HTML
- CSS
- JavaScript
- Supabase
- Leaflet and OpenStreetMap
- GitHub Pages

No frontend framework or build system is currently required.

## Canonical source

`Website/` is the canonical source for the static application.

`docs/` is the current GitHub Pages deployment and temporary rollback copy. Do not make feature changes directly in `docs/`. A draft, manual-only GitHub Actions workflow now builds a filtered Pages artifact from `Website/`, but it has not been run and the repository's Pages publishing source has not been changed. Pushing the workflow will not deploy the site. Until the controlled cutover is approved and verified, production continues to use `docs/`; automatic deployment from `Website/` changes will be enabled only in a later, separately approved change after successful production verification.

The SQL files currently under `Website/` are historical implementation artifacts. They do not represent the authoritative live Supabase schema and must not be executed or used to infer production structure without verification.

## Repository guide

| Location | Purpose |
| --- | --- |
| `Website/` | Canonical static application source |
| `docs/` | Temporary GitHub Pages deployment and rollback copy |
| `.github/workflows/deploy-pages.yml` | Draft manual-only, filtered-artifact Pages workflow; not yet activated |
| `Maps/` | QGIS project, raw geographic inputs, and GIS working data |
| `Documents/` | Planning notes and project records |
| `WV/` | Unclassified prototype material; not production source |
| Root-level prototype files | Unclassified historical or working material; not production source |

No prototype, archive, GIS source, or historical SQL file should be removed or reorganized without a separate review and approval.

## Running locally

Serve `Website/` through a local static HTTP server. Opening pages directly with a `file://` URL may prevent browser requests for GeoJSON or other resources.

For example, if Python is available:

```sh
python3 -m http.server --directory Website 8000
```

Then visit `http://localhost:8000`.

Do not place Supabase service-role or secret keys in browser-delivered files. The browser application may use only the project URL and a key intended for public client use, with access enforced by Row Level Security.

## Documentation

- [System architecture](SYSTEM_ARCHITECTURE.md)
- [Database schema baseline](DATABASE_SCHEMA.md)
- [Deployment and rollback](DEPLOYMENT.md)

## Change rules

- Understand the existing implementation before changing it.
- Preserve vanilla HTML, CSS, and JavaScript unless a migration is explicitly approved.
- Prefer focused changes and shared logic over page rewrites or duplication.
- Ask for approval before changing the database schema.
- Treat the live Supabase database—not repository SQL artifacts—as the current database authority.
- Keep public volunteer intake separate from organizer-only data and interfaces.
- Do not manually edit `docs/` as an independent application.
