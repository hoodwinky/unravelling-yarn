# Capture status

## Working now
- Paste a selected conversation or choose TXT, SRT or a ChatGPT JSON export (up to 5 MB).
- Keyword rules suggest candidate ideas. This is a deterministic first pass, not an AI interpretation.
- Supported role-labelled text/SRT and ChatGPT JSON processing includes user messages and excludes assistant messages.
- Exact normalized duplicate suggestions are skipped. Related public threads are suggested by matching title words; semantic duplicates can remain.
- Drafts persist in browser localStorage on that device; raw input is cleared after extraction. This is not a synced or account-protected private inbox.
- Edit title, public summary and next step before public submission.
- An approval checkbox is required before preparing a public GitHub issue. The issue still needs to be submitted on GitHub.
- Only the edited public fields go into the issue URL. The transcript is not attached.
- Download the inbox as JSON to retain or move drafts. Clear the device inbox to remove stored drafts.

## Automatic checks
The GitHub Actions check job rejects missing required fields, duplicate IDs/titles, unknown stages, invalid connections and public records without explicit approval. Capture regression tests and syntax validation run before a checked asset bundle is uploaded. Deployment depends on this check job.

These checks cannot judge whether a summary is accurate or safe to publish. They do not provide semantic deduplication or access to other chats.

## Still not connected
There is no background connection to all ChatGPT history. No chat-ingestion API credential, private server inbox or scheduled capture task is configured. An authorized input integration is required to make future conversation capture unattended.

Raw transcripts, personal matters and Evidence Engine case records must stay outside this public repository. Public issues, pull requests and commits are already public.
