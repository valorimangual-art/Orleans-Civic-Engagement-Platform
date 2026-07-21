# Deployment

## Current state

The application is currently deployed as a static GitHub Pages site from the repository's `docs/` directory.

- `Website/` is the canonical application source.
- `docs/` is the temporary deployment and rollback copy.
- The two directories are currently maintained separately.
- `.github/workflows/deploy-pages.yml` is a draft, manual-only GitHub Actions Pages workflow.
- The draft workflow has not been run, and the repository's Pages publishing source has not been changed.
- Pushing the workflow will not deploy the site.

Do not implement feature changes directly in `docs/`. Until an automated deployment workflow is approved and verified, any production release must explicitly check source/deployment parity.

## Current release checklist

Before updating the temporary deployment copy:

1. Confirm the working tree does not include unrelated user changes in the proposed release.
2. Review the intended changes under `Website/`.
3. Compare affected files with their `docs/` equivalents.
4. Confirm all relative links and asset paths work with the GitHub Pages project path.
5. Serve `Website/` locally over HTTP and run the smoke tests below.
6. Update `docs/` only as an intentional deployment operation.
7. Review the complete diff before staging.
8. Stage only an explicit allowlist of release files.

This document does not authorize or perform synchronization between the directories.

## Local verification

Serve the canonical directory through a local static HTTP server. For example:

```sh
python3 -m http.server --directory Website 8000
```

Then verify at `http://localhost:8000`:

- Overview page and mini map
- Main map and precinct GeoJSON
- Navigation between all pages
- Supabase reads and visible error states
- List, detail, and query-parameter pages
- Existing form validation and submission behavior in an appropriate test environment
- Leaflet, OpenStreetMap tiles, fonts, and CDN dependencies
- Browser console and network requests
- Mobile-width layout

Do not submit test records to production without explicit authorization.

## Draft deployment workflow

The draft workflow builds a temporary, filtered artifact from the canonical `Website/` source. It requires and publishes only the current application HTML files, `style.css`, `supabase-config.js`, and `precinct_boundaries.geojson`. It excludes SQL, Python, local development settings, archives, OS metadata, and every file not explicitly allowlisted.

Before upload, the workflow fails if a required application file is missing, rejects root-absolute local paths, and checks that static relative HTML references resolve inside the filtered artifact. Dynamic detail links are covered by the explicit required-file allowlist.

The workflow is configured only for manual execution during the initial cutover. It uses the official GitHub Pages artifact and deployment actions. Creating or pushing the workflow does not deploy the site or change the repository's Pages publishing source. Automatic deployment for pushes that change `Website/` will be enabled only in a later, separately approved change after the first production deployment succeeds and is verified.

## Planned deployment sequence

The planned sequence is:

1. Verify that `Website/` is complete and independently deployable.
2. Commit and push the approved manual-only Pages workflow.
3. Keep `docs/` unchanged as rollback material.
4. Change the repository's Pages source from branch `/docs` to GitHub Actions during the controlled cutover.
5. Manually run the workflow.
6. Verify the production site.
7. In a later, separately approved change, enable automatic deployment for pushes that change `Website/`.
8. Retain `docs/` through at least one verified deployment cycle.
9. Remove `docs/` only in a later, separately approved change.

The repository still publishes from `docs/`. No GitHub setting has been changed, and no deployment has been run.

## Configuration and secrets

The static browser application may contain only a Supabase project URL and a key intended for public client use. It must never contain:

- A Supabase service-role key
- A Supabase secret key
- Database passwords
- Private API credentials

Authorization must be enforced by the verified live Supabase schema, grants, and RLS policies. Repository SQL is historical and must not be used as the production security authority.

## Rollback

### Before automated deployment cutover

The current `/docs` branch deployment remains the known rollback path. If a proposed workflow or artifact fails, leave the Pages setting unchanged and continue serving `docs/`.

### After a future GitHub Actions cutover

If an automated deployment fails after Pages settings change:

1. Restore GitHub Pages to branch deployment from `main` and `/docs`.
2. Leave the rollback copy unchanged.
3. Confirm the previous site is available.
4. Revert or correct the responsible workflow/application change.
5. Repeat production smoke tests before another cutover.

### After a future removal of `docs/`

Removal must be isolated in its own commit. Restore it by reverting that commit, then restore branch-based Pages deployment if required.

## Release discipline

- Do not use broad staging commands in the current dirty working tree.
- Stage explicit file paths only.
- Keep documentation, deployment changes, source changes, and cleanup changes in separate commits.
- Do not combine prototype archival or GIS cleanup with a production release.
- Do not modify Supabase or execute SQL as part of a static-site deployment.
- Record production verification results and rollback-relevant commit identifiers.
