Global Plan

Goal: an agent that finds fully remote jobs on EU-compatible hours earlier than most candidates, scores them against my CV, prepares a tailored CV and cover letter, and lets me confirm each application with one tap in Telegram.

Hard rules:

Remote only.
Working hours compatible with CET ± a few hours.
No Russian companies or Russia-related jobs.
Roles are not fixed: anything that matches my CV.

Sourcing strategy (be among the first to apply):

ATS watchlist: poll company boards on Greenhouse / Lever / Ashby / Workable every 15-30 min via their public JSON. This is the original source, zero delay.
Discovery: aggregators (Remotive, We Work Remotely, Himalayas, RemoteOK...) and LinkedIn guest search every 4 hours, using Playwright where needed. Any apply link pointing to an ATS adds that company to the watchlist automatically.
Seed the watchlist upfront from search (site:jobs.ashbyhq.com etc.) and public lists of ATS slugs.
Bucket A jobs are pushed to Telegram immediately after scoring, not batched.

#	Stage	Result
0	Foundation	NestJS, Postgres, Docker Compose, Telegram bot, master CV in JSON
1	Job ingestion	ATS watchlist polling (15-30 min), aggregators + LinkedIn guest (4 h, Playwright where needed), auto-discovery of companies into the watchlist, deduplication
2	Filtering and scoring	Hard rules → skill overlap with CV → Claude Haiku; buckets A/B/C
3	Telegram approval	A instantly, B in a digest; Apply / Skip / Later buttons, statuses tracked in the DB
4	CV and cover letter	Select and rephrase from the master CV, validator against fabrication, PDF
5	Submission	Playwright autofill for Greenhouse, Lever, Ashby, screenshot confirmation before sending
6	Reliability and analytics	Alerts for broken sources, backups, reply parsing, conversion stats

Stack: Bun (runtime + package manager; Node fallback for Playwright if needed), NestJS + TypeScript, Postgres + Drizzle, pg-boss (queues and cron), grammY, Playwright, Claude API (Haiku for scoring, Sonnet for writing), Docker Compose.

Hosting: local (Docker Compose) for now; move to a VPS later. Main candidate is Hetzner (CX23/CAX11, 4 GB RAM, ~€6/month), fallback Contabo. Keep the app portable: everything in Docker Compose, amd64/arm64 images, pg_dump backups off the server. Budget: ≤ $10/month for the server + ~$2-5/month for the Claude API.

Principles:

Human in the loop until auto-submit proves stable.
The master CV is untouchable: Claude only selects and rephrases.
Plain HTTP/JSON where a source allows it; Playwright for sources without an API, LinkedIn, and form submission.
Claude is called only after a cheap prefilter.

Order of work: stages 0-3 already give a working semi-automatic tool (jobs arrive in Telegram on their own), which is most of the value. Stages 4-5 add application automation.
