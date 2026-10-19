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

## Preparing the first release

1. Confirm the original LoL Math copyright/permission notice and distribution rights. Keep the existing attribution and separate ISC/MIT provenance. Do not replace the missing notice with an inferred copyright line.
2. Select the intended release version and verify ownership of the npm scope and registry namespace. Update package versions, descriptions, package READMEs and the changelog together; keep publication guards until approval.
3. Run the local integration pipeline and Windows visual suite. Preserve source hashes and exact outcomes. GitHub Actions are intentionally absent; a push is not a validation result.
4. Inspect packed tarballs and independent registry JS/TS consumers, then check the deployed install URLs, canonical metadata and social image on the approved domain.
5. Obtain separate approval for repository visibility, package publication and deployment. Tag and document the approved release only after those checks pass.
