# Release checklist

Review this checklist for each proposed release. Results belong to that release's verification run; an older passing report does not certify current source.

- [ ] Run the complete ordered `pnpm check` pipeline against the proposed source and preserve its results.
- [ ] Review light/dark visuals, hover, held press, keyboard focus, disabled states, portals and reduced motion.
- [ ] Review complex controls with assistive technology and disclose untested behavior.
- [ ] Check compatibility contracts and documented examples against actual JS/TS registry installs and packed package consumers.
- [ ] Review source security and current production/optional/tooling advisories, including provider access and spending controls.
- [ ] Preserve dependency licenses, font notices, asset provenance and platform-specific binary obligations.
- [ ] Confirm the LoL Math copyright/permission notice for the exact adapted sources before making the repository, packages or registry public; retain ISC attribution separately from the MIT additions.
- [ ] Review naming/trademark questions and the Riot independence notice; confirm there are no unauthorized assets.
- [ ] Confirm GitHub destination, npm scope and registry namespace permissions for the intended publication.
- [ ] Inspect the exact Git candidate files: no credentials, local settings, generated consumers, work notes or verification artifacts.
- [ ] Check canonical URLs, sitemap, robots, social previews and install commands on the approved deployment.
- [ ] Review package versions, metadata, changelog and tarball contents before changing private/publication guards.
- [ ] Obtain explicit approval for each push, package publication, production deployment or external submission.

Local reports in ignored `docs/audits/` and `.artifacts/` may support a review, but are not required source files. Keep reusable contracts in [COMPATIBILITY.md](COMPATIBILITY.md) and portable expectations in `tests/fixtures/`.
