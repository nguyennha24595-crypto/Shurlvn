# shorturl (shurlvn.com)

Cloudflare Worker: URL shortener + QR code platform, Vietnamese-first (VI/EN/KO/ZH/HI/JA/FR/ES UI strings).
Entire app — routing, HTML, CSS, client JS, i18n strings — lives in **one file**: [worker.js](worker.js) (~1.1MB).
Config: [wrangler.jsonc](wrangler.jsonc) (KV binding `LINKS_KV`, cron trigger). No test suite, no build step, no other source files.

## Default workflow: surgical edits, not ceremony

Most requests here are small, bounded changes to an existing single file — a new route, a UI tweak, a bug fix.
For that shape of task, skip heavyweight process by default:

- **Don't** run brainstorming, TDD, worktree isolation, multi-agent/subagent dispatch, or write a plan doc for a routine edit. Locate the exact section with Grep, edit it directly with Edit, done.
- **Do** reserve brainstorming/plan-writing for genuinely new features or architectural changes (e.g., a new subsystem, not "add a field to the QR form").
- No test suite exists — verify behavior by running the worker locally and hitting the actual route, not by writing new test infrastructure.

## Verify before claiming done

1. Start the local worker: `preview_start` with the `worker-dev` config in `.claude/launch.json` (runs `wrangler dev --port 8788`), or `npx wrangler dev`.
2. Hit the changed route directly — `curl -sk https://localhost:8788/<path>` (self-signed cert; the in-app Browser pane's `navigate` tool fails on this cert, so prefer `curl -k` via Bash for local checks) or open it in the Browser pane for UI changes.
3. Check response status/body/headers match what was intended.

## Deploy

`npx wrangler deploy` from the repo root. This is a Cloudflare Workers deploy — it ships straight to the production domain (`shurlvn.com`), there is no separate staging environment. Deploy when the user asks for it or has said to deploy without asking each time.

## Conventions already in the codebase

- UI strings live in the `i18n` object (per-language keys); add new strings to every language block, not just `vi`/`en`.
- Vietnamese comments in the source explain non-obvious business logic (rate limiting, quota rules) — keep that pattern for similarly non-obvious additions.
- New routes are added as `if (path === "...")` checks in the main fetch handler, following the existing numbered `// ===== N. SECTION =====` comment structure.
