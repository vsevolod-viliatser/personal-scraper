Global Plan

Goal: an agent that finds fully remote jobs on EU-compatible hours earlier than most candidates, scores them against my CV, prepares a tailored CV and cover letter, and lets me confirm each application with one tap in Telegram.

Hard rules:

Remote only, and the job must actually be open to my location (reject "US only", "must reside in X", etc.).
Working hours compatible with CET ± a few hours.
Company HQ can be anywhere (Ukraine, Europe, US...) except Russia: no Russian companies or Russia-related jobs.
Roles are not fixed: anything that matches my CV.
Any employment type: full-time, contractor / B2B, via EOR (Deel, Remote.com...).

Eligibility profile (config, not hardcoded — flip when I move):
Location: Ukraine now, planning to move to the EU. EU work permit: no (yet).
Accept: Worldwide, EMEA, Europe (without a right-to-work requirement), Ukraine, CET-compatible "anywhere", international contractors.
Bucket B with a flag instead of rejecting: "EU right to work required" (becomes eligible after the move).
Reject: "excluding Ukraine", single-country-only outside Ukraine (e.g. "Remote — Germany only"), US/Americas-only.

Sourcing strategy (be among the first to apply):

ATS watchlist: poll company boards on Greenhouse / Lever / Ashby / Workable / Workday / SmartRecruiters every 15-30 min via their public JSON. This is the original source, zero delay.
Ukrainian sources: DOU RSS (jobs.dou.ua/vacancies/feeds/?remote) and Djinni RSS (djinni.co/jobs/rss/), polled every 15-30 min. Work.ua / robota.ua later via Playwright if needed.
Discovery: aggregators (Remotive, We Work Remotely, Himalayas, RemoteOK...) and LinkedIn guest search every 4 hours, using Playwright where needed. Any apply link pointing to an ATS adds that company to the watchlist automatically.
Watchlist seed: no hand-made list. Import remote companies from github.com/remoteintech/remote-jobs (region worldwide/europe, technologies overlapping the CV), auto-detect each company's ATS (probe slugs on ATS APIs, else find ATS links on the careers page). Companies with no relevant jobs for 2-3 months are polled less often. Manual "always watch" via a bot command.
Free Google channel: Google Alerts delivered as RSS (queries like site:jobs.lever.co remote europe <skill>), plus links I forward to the bot. Both go through a generic extractor: JSON-LD JobPosting first, Claude Haiku fallback.
Bucket A jobs are pushed to Telegram immediately after scoring, not batched.

#	Stage	Result
0	Foundation	NestJS, Postgres, Docker Compose, Telegram bot, master CV in JSON
1	Job ingestion	Watchlist seed from remoteintech + ATS auto-detection, ATS polling (15-30 min), DOU + Djinni RSS, aggregators + LinkedIn guest (4 h, Playwright where needed), auto-discovery of companies into the watchlist, deduplication
2	Filtering and scoring	Hard rules → skill overlap with CV → Claude Haiku; buckets A/B/C
3	Telegram approval	A instantly, B in a digest; Apply / Skip / Later buttons, statuses tracked in the DB
1b	Wider discovery	Google Alerts RSS, links forwarded to the bot, generic extractor (JSON-LD → Haiku), careers pages without an ATS (re-extract only when the page hash changes)
4	CV and cover letter	Select and rephrase from the master CV, validator against fabrication, PDF
5	Submission	Playwright autofill for Greenhouse, Lever, Ashby, Workday, Djinni apply, screenshot confirmation before sending
5b	Agent mode	Claude drives Playwright on arbitrary application forms with screenshot confirmation; on CAPTCHA / sign-up walls send me the link + tailored CV + suggested answers to apply manually
6	Reliability and analytics	Alerts for broken sources, backups, reply parsing, conversion stats

Stack: Bun (runtime + package manager; Node fallback for Playwright if needed), NestJS + TypeScript, Postgres + Drizzle, pg-boss (queues and cron), grammY, Playwright, Claude API (Haiku for scoring, Sonnet for writing), Docker Compose.

Hosting: local (Docker Compose) for now; move to a VPS later. Main candidate is Hetzner (CX23/CAX11, 4 GB RAM, ~€6/month), fallback Contabo. Keep the app portable: everything in Docker Compose, amd64/arm64 images, pg_dump backups off the server. Residential (home) IP is trusted more than a datacenter one, so Playwright/LinkedIn sources may get blocked more often after the move. Budget: ≤ $10/month for the server + ~$2-5/month for the Claude API. No other paid services (no SERP APIs).

Principles:

Human in the loop until auto-submit proves stable.
The master CV is untouchable: Claude only selects and rephrases.
Plain HTTP/JSON where a source allows it; Playwright for sources without an API, LinkedIn, and form submission.
Claude is called only after a cheap prefilter.
Don't get banned: never log in to scrape (no logged-in LinkedIn), rate limits per domain (not per source), conditional requests (ETag / If-Modified-Since), circuit breaker on 429/403 with a Telegram alert, honest User-Agent, no proxy rotation / stealth / CAPTCHA bypass. One application per job, idempotent by job id.

Order of work: stages 0-3 already give a working semi-automatic tool (jobs arrive in Telegram on their own), which is most of the value. Then 1b widens coverage. Stages 4-5b add application automation.
