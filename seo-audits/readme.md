# SEO audits

This directory holds the current SEO audit and its active remediation plan.

## Files

- `full-audit.md` — the latest complete SEO audit and verification evidence.
- `action-plan.md` — the current prioritized remediation backlog.
- `changelog.md` — a short record of completed audits, refreshes, score changes, and material findings.
- `readme.md` — this maintenance convention.

## Update convention

Keep only the latest report and action plan in the working tree. Git history preserves earlier versions, so do not create dated copies or monthly subdirectories.

When an audit is rerun:

1. Replace `full-audit.md` with the latest complete report.
2. Replace or reconcile `action-plan.md` with the latest priorities.
3. Add one concise entry to `changelog.md` describing the audit date, score, verification scope, and material changes.
4. Commit the report, action plan, and changelog together.

When a pull request contains more than one version of an audit, merge it with a merge commit or rebase merge. Do not squash it, because squashing removes the intermediate report versions that this convention relies on.

Supporting screenshots, generated test results, and `.seo-cache/` data are local evidence only and should remain uncommitted unless the project explicitly changes that policy.
