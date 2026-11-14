# ddszeinali.ir

Personal website of **Dr. Mohammad Reza Zeinali** (دکتر محمد رضا زینلی), cosmetic dentist.
Astro 5 · Persian / RTL · Bauhaus design · GitHub Pages.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # output in dist/
```

Push to `main` → deployed automatically to https://ddszeinali.ir.

## Documentation

- [`AGENTS.md`](AGENTS.md): master blueprint (rules, design system, recipes, TODOs)
- [`docs/CODEBASE.md`](docs/CODEBASE.md): file-by-file map of the code

## Switching to a new AI assistant

**Coding agents** (opencode, Claude Code, Codex, Cursor, Copilot, Gemini CLI, etc.): open this folder.
They read `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` automatically.

**Chat-only AIs** (no file access): paste the contents of `AGENTS.md` and `docs/CODEBASE.md`, then this prompt:

```
You are taking over development of my website project. The two documents above are the
master blueprint and the codebase map. Treat them as binding rules: follow the design
system, RTL/Persian rules, and "don'ts" exactly, never invent facts about me, and keep
changes small. Confirm you understood by summarizing the project in 5 bullet points,
then wait for my instructions.
```
