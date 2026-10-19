# Verification and handoff

1. Inspect the affected behavior and existing tests. Choose relevant checks before broad integration runs.
2. Run formatting, lint and strict types for changed source. Add tests for meaningful behavior or integration boundaries; avoid assertions that merely repeat an implementation.
3. Check pointer and keyboard behavior, both themes and mobile layout. Verify the public docs independently of the noindex variant harness.
4. Use actual shadcn CLI JS/TS consumer tests for distribution changes. Use packed tarball consumers for package exports; workspace links are not package evidence.
5. Preserve previous screenshots before intentional updates, inspect every changed image and rerun comparisons without snapshot updates.
6. Record exact commands, outcomes, source fingerprints and exceptions in `docs/audits/`. Historical logs keep their original paths and results. Do not rewrite failed attempts into successes or reuse stale counters as current acceptance.
7. `pnpm check` reserves multiple ports and runs broader legacy coverage. Stop only identified project-owned processes, never all Node/browser processes. Restore the local preview and verify its health after consumer tests.
8. Never read or print environment secrets while diagnosing tests. Do not run live provider calls that spend credits unless the task calls for them.
9. Report what passed, what was not run and what remains uncertain. Automated accessibility checks do not establish screen-reader acceptance; selected reference observations do not establish complete pixel/API parity.
10. Keep all work local until explicitly authorized otherwise. Do not commit, push, publish, deploy or change external ownership as a side effect of verification.
