# Contributing to SwiitchBank

Thanks for helping improve SwiitchBank! Please follow the guidelines below to make review and integration smooth.

## How to contribute

- Open an issue to discuss large changes before starting work.
- Create a descriptive branch name: `feat/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`.
- Keep PRs small and focused. Include screenshots and reproduction steps where helpful.

## Commit messages

- Use conventional commits-like style:
  - feat: add new feature
  - fix: bug fix
  - chore: maintenance
  - docs: documentation only changes
- Example: `feat(wallet): add multi-currency conversion endpoint`

## Code quality

- Run lints and tests locally before opening a PR.
- Follow the code style (ESLint + Prettier). We will enforce these in CI and via Husky hooks.

## Tests

- Add unit tests for new features and bug fixes.
- Aim for meaningful coverage on critical flows (auth, payments, transfers).

## Review and merge

- Each PR should have at least one reviewer.
- Fix review comments and push changes to the same branch. Squash or rebase as requested by the maintainer.
- Do not merge your own PRs to main unless explicitly permitted.

## Security

- Never commit secrets or private keys. Use the project `.env.example` as the template and store real values in CI secret storage.

Thank you for contributing!
