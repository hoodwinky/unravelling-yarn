# Capture integration — planned, not connected

## Available now
- Public GitHub issue intake with structured prompts.
- Connected project records in projects.json.
- A browser hub with search, stage filtering and local draft export.

## Required next
1. Select an input that the founder explicitly shares: a chat excerpt, a transcript file or an authorized integration event.
2. Receive it in a separate private service. Never send a raw transcript to a public issue, pull request, Actions log or repository file.
3. Extract candidate ideas with title, summary, source reference, connections and a next step.
4. Match existing thread IDs before proposing new records.
5. Present proposed public summaries privately for approval.
6. Publish only approved summaries to projects.json.
7. Retain ingestion IDs privately to avoid processing the same excerpt twice.

No source credentials or ingestion endpoint are configured. No scheduled job is running. Creating this repository does not give it access to ChatGPT history.

## Proposed private draft record
- ingestion_id
- source_reference
- thread_id or candidate_new_thread
- proposed_public_summary
- next_step
- related_thread_ids
- review_status: pending / approved / rejected

Approval must happen privately before the public write. A public pull request is already publication.
