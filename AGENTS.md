# AGENTS.md

## Cursor Cloud specific instructions

This repository now contains a static frontend lead magnet app:

- `index.html`
- `styles.css`
- `script.js`

### Environment setup

- **No dependencies to install** — no package manager files are present.
- **No backend or database services** — this is a static HTML/CSS/JS app.

### Running locally

- Open `index.html` directly in a browser, or
- Serve the repository as static files (optional), for example:
  - `python3 -m http.server 4173`

### Testing guidance

- There is no configured lint/test/build command.
- Validate behavior through manual browser testing:
  - form validation and salary estimate rendering
  - auto-scrolling one-chip course carousel
