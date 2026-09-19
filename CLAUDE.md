# shorturl (shurlvn.com)

Cloudflare Worker: URL shortener + QR code platform, Vietnamese-first (VI/EN/KO/ZH/HI/JA/FR/ES UI strings).
The app is split into ES modules under **[src/](src/)**, entry point **[src/index.js](src/index.js)** (`export default { fetch, scheduled }`):
- `src/config/` — TIER_CONFIG, global constants.
- `src/i18n/` — server-side i18n (`SERVER_I18N`/`st()`), notification/email templates. The client-side i18n object lives inline inside `src/views/appHtml.js`'s embedded SPA script, not here.
- `src/kv/` — all direct `env.LINKS_KV` access, grouped by entity (users, links, qr, clicks, reports, blacklist, audit, blog).
- `src/utils/` — crypto, HTTP/response helpers, auth guard, quota checks, maintenance-mode toggles, email sending.
- `src/handlers/` — route handlers by domain (auth, links, qr, analytics, feedback, ai, redirect, admin, billing, webhooks, export, teams, campaigns, notifications).
- `src/views/` — `appHtml.js` (renders the SPA shell; contains the ~9,000-line client-side app script embedded verbatim as a template literal — treat that block as client JS, not server code), `blogHtml.js`, `bioHtml.js`, `emailTemplates.js`.
- `src/cron.js` — scheduled-trigger tasks (expired-link purge, analytics cache refresh).
Wrangler bundles everything back into one Worker at deploy time (esbuild) — there's still no separate build step to run yourself.
Config: [wrangler.jsonc](wrangler.jsonc) (`main: src/index.js`, KV binding `LINKS_KV`, cron trigger). No test suite.

## Default workflow: surgical edits, not ceremony

Most requests here are small, bounded changes — a new route, a UI tweak, a bug fix, localized to one or two files under `src/`.
For that shape of task, skip heavyweight process by default:

- **Don't** run brainstorming, TDD, worktree isolation, multi-agent/subagent dispatch, or write a plan doc for a routine edit. Locate the exact file/section with Grep, edit it directly with Edit, done.
- **Do** reserve brainstorming/plan-writing for genuinely new features or architectural changes (e.g., a new subsystem, not "add a field to the QR form").
- No test suite exists — verify behavior by running the worker locally and hitting the actual route, not by writing new test infrastructure.
- When adding a handler that other handlers/utils will call, export it from the right domain file in `src/handlers/` and import explicitly — don't reintroduce implicit global access.

## Verify before claiming done

1. Start the local worker: `preview_start` with the `worker-dev` config in `.claude/launch.json` (runs `wrangler dev --port 8788`), or `npx wrangler dev`.
2. Hit the changed route directly — `curl -sk https://localhost:8788/<path>` (self-signed cert; the in-app Browser pane's `navigate` tool fails on this cert, so prefer `curl -k` via Bash for local checks) or open it in the Browser pane for UI changes.
3. Check response status/body/headers match what was intended.

## Deploy

`npx wrangler deploy` from the repo root. This is a Cloudflare Workers deploy — it ships straight to the production domain (`shurlvn.com`), there is no separate staging environment. Deploy when the user asks for it or has said to deploy without asking each time.

## Conventions already in the codebase

- UI strings live in the client-side `i18n` object inside `src/views/appHtml.js` (per-language keys); add new strings to every language block, not just `vi`/`en`. Server-side strings live separately in `src/i18n/server.js` (`SERVER_I18N`).
- Vietnamese comments in the source explain non-obvious business logic (rate limiting, quota rules) — keep that pattern for similarly non-obvious additions.
- New routes are added as `if (path === "...")` checks in `src/index.js`'s `fetch()` dispatcher, following the existing numbered `// ===== N. SECTION =====` comment structure, calling into a handler exported from the matching `src/handlers/*.js` file (add the handler there, then import + wire the route in `src/index.js`).
