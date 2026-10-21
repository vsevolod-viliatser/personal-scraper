Global Plan

Goal: an agent that finds fully remote jobs on EU-compatible hours, scores them, prepares a tailored CV and cover letter, and lets you confirm each application with one tap in Telegram.

#	Stage	Result
0	Foundation	NestJS, Postgres, Docker Compose, Telegram bot, master CV in JSON
1	Job ingestion	Jobs from APIs/RSS, ATS boards, and Gmail alerts land in the DB without duplicates
2	Filtering and scoring	Rules cut the junk, Claude scores the rest, jobs are sorted into buckets A/B/C
3	Telegram approval	Job cards with Apply / Skip / Later buttons, statuses tracked in the DB
4	CV and cover letter	Tailored PDF resume and cover letter with no fabrication, verified against the master CV
5	Submission	Form autofill for Greenhouse, Lever, Ashby, with confirmation before sending
6	Reliability and analytics	Reply parsing, alerts for broken sources, backups, conversion stats

Stack: NestJS + TypeScript, Postgres, Playwright, Claude API (Haiku for scoring, Sonnet for writing), Telegram, Docker Compose. Hosting starts locally, then moves to Oracle Always Free.

Principles:

Human in the loop until auto-submit proves stable.
The master CV is untouchable: Claude only selects and rephrases.
Safest sources first (API, RSS, email); Playwright only for gaps.
Claude is called only after a cheap prefilter.

Order of work: stages 0-3 already give you a working semi-automatic tool (jobs arrive in Telegram on their own), which is most of the value. Stages 4-5 add application automation.