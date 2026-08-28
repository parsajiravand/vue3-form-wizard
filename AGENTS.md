# Agent Notes

Single-package Vue 3 component library. `src/` contains both the published library and the local sample playground.

## Commands

- `npm run dev` — Vite dev server at `http://localhost:5173`; serves the 15-sample playground in `src/App.vue`.
- `npm run build` — `vite build && vue-tsc --emitDeclarationOnly`. Produces `dist/` (JS bundles, CSS, and `.d.ts` types).
- `npm run test` — `vitest run` in jsdom environment.
- `npm run preview` — Preview the last production build.

## Project boundaries

- Library entry: `src/index.ts` (exports `FormWizard`, `TabContent`, `WizardButton`, `WizardStep`, and types).
- Demo/playground entry: `src/main.ts` mounted by `index.html`.
- Styles: `src/assets/wizard.scss` (imported by `FormWizard.vue`).
- Tests: `tests/*.spec.tsx` use `@vue/test-utils` + JSX + `jsdom`.
- `vue` is the only runtime dependency; `vue-router` is optional and discovered at runtime.

## Notable quirks

- `FormWizard.vue` imports helpers via `import { ... } from './helpers.js'` even though the file is `helpers.ts`. Do not change this extension; Vite resolves it during build/dev.
- `tsconfig.json` has `"strict": false`. Avoid adding strict-only TypeScript assumptions.
- Schema mode renders active step components from `schemaComponents` by string key (or falls back to `step.id`).
- `TabContent.vue` uses inject from `FormWizard` to register itself; running it outside a `FormWizard` will leave it inactive.

## Technical Constraints

- **Indentation**: 4 spaces.
- **Naming**: camelCase for variables and functions, PascalCase for classes, UPPERCASE for constants.
- **Error Handling**: Every async function must use try-catch with `Logger.error` logging of detailed errors.
- **No Magic Numbers**: Use constants for timeouts, database names, or version numbers.
- **Core Principle**: Follow SOLID principles. Keep functions small and focused.
