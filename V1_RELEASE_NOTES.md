## Vue3 Form Wizard v1.0.0 Release Notes

### Highlights

- **Schema mode**: new declarative API for defining steps, conditions, validation, and components via a `schema` prop, without `<tab-content>` children.
- **Stable Vue Router integration** with support for both string paths and route location objects on `route` props.
- **Improved accessibility**: consistent IDs, ARIA wiring, and keyboard navigation between steps and panels.
- **More robust core**: safer DOM access and clearer tab state management, preparing the library for broader usage contexts.
- **Better DX**: clarified exports, types, packaging, and a basic automated test suite using Vitest and Vue Test Utils.

### Router & route handling

- Normalized `route` handling inside `FormWizard` so that:
  - String paths (e.g. `route="/step1"`) and location objects (e.g. `route="{ name: 'step1', params: { id: 1 } }"`) are both supported.
  - Internal helpers resolve route objects via `router.resolve` to compare the effective `fullPath`/`path`.
  - Redundant navigations are avoided and duplicate-navigation errors are ignored while other navigation errors are still surfaced as warnings.
- Route watching now:
  - Uses a centralized helper to read the current route from either `vue-router` or app global properties.
  - Triggers tab changes when the URL changes (back/forward or direct navigation) and a matching tab `route` is found.
  - Becomes a no-op (with a dev-only warning) when `vue-router` is not installed so the component can still be used without a router.

### Schema mode

- **Schema-only configuration**: when `schema` is provided and no `<tab-content>` children are used, `FormWizard` runs in schema mode.
- **Declarative steps**: each step in `schema.steps` supports `id`, `title`, `component`, `icon`, `customIcon`, `route`, `condition`, and `validate`:
  - `condition`: `(ctx) => boolean | Promise<boolean>` — hides the step when it returns `false`; re-evaluated when `wizardData` changes.
  - `validate`: `(ctx) => boolean | string | Promise<boolean | string>` — runs before navigating away; return `true` to allow, or a string for an error message.
- **Shared wizard data**: `wizardData` and `updateWizardData` are passed to step components as `data` and `update-data` props; bind with `v-model` for two-way sync.
- **Component mapping**: pass `schemaComponents` as a map of step `component` (or `id`) keys to Vue components; the active step is resolved via `currentSchemaComponent`.
- **Backward compatible**: classic slot-based mode and `addTab` / `initializeTabs` continue to work unchanged when no schema is provided.

### IDs, ARIA, and keyboard navigation

- Unified ID generation between `WizardStep` and `TabContent`:
  - `FormWizard` generates a stable `tabId` for each step and passes it down to the child via the `updateActiveState` callback.
  - `WizardStep` uses `id="step-${tab.tabId}"` and `aria-controls="tab.tabId"`.
  - `TabContent` uses `id="tabId"` and `aria-labelledby="step-${tabId}"`, ensuring a correct `tab`/`tabpanel` relationship.
- Updated keyboard helpers to work with the actual DOM IDs:
  - `getFocusedTabIndex` now compares the focused element id against `step-${tab.tabId}`.
  - `focusNextTab` / `focusPrevTab` focus the appropriate `step-${tabId}` elements and respect `checked` steps.
- Added basic accessibility coverage in tests to assert:
  - Presence of `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
  - A working link between `aria-controls` on tabs and the corresponding panel ids.

### Robustness & SSR-related safeguards

- Guarded direct DOM access in `helpers.ts`:
  - `getFocusedElementId` and `findElementAndFocus` now early-return when `document` is not available, avoiding crashes in non-DOM environments.
- Adjusted `FormWizard` ID generation:
  - Replaced `new Date().valueOf()` with a per-process, per-instance counter so each wizard instance gets a stable fallback id like `fw_1`, `fw_2`, etc.
  - The final `wizardId` still prefers a user-provided `id` prop when present.
- Clarified tab state responsibilities:
  - `FormWizard` remains the single source of truth for `active`, `checked`, and `validationError`.
  - `TabContent` no longer maintains its own `checked` or `validationError` state and instead relies on callbacks from the parent to update its `active` flag and `tabId`.

### DX & packaging

- `package.json`:
  - Added a top-level `"types": "./dist/types/index.d.ts"` entry.
  - Added `"sideEffects": ["./dist/vue3-form-wizard.css"]` so bundlers can tree-shake JS safely while preserving styles.
  - Removed the self-dev-dependency on `vue3-form-wizard`.
  - Added test-related devDependencies:
    - `vitest`, `@vitest/ui`, `@vue/test-utils`.
- `vite.config.ts`:
  - Confirmed proper library build configuration with `src/index.ts` as the entry, `vue` listed as an external, and a stable global name (`Vue3FormWizard`) for the UMD build.
  - Added a `test` configuration block for Vitest with a `jsdom` environment and globals enabled.
- `src/index.ts`:
  - Continues to export:
    - Default plugin (`VueFormWizard`) with `install`.
    - Named exports: `FormWizard`, `TabContent`, `WizardButton`, `WizardStep`.
  - Re-exports all public types from `src/types.ts` for TypeScript users.

### Tests

- Introduced Vitest + Vue Test Utils and added the following test suites:
  - `tests/FormWizard.navigation.spec.ts`
    - Verifies that the wizard starts at the first step and that `nextTab` / `prevTab` correctly update `activeTabIndex`.
  - `tests/FormWizard.validation.spec.ts`
    - Ensures `beforeChange` returning `false` prevents navigation to the next step.
    - (Additional cases can be expanded to cover async `beforeChange` and error paths.)
  - `tests/FormWizard.router.spec.ts`
    - Uses `vue-router` to assert that changing tabs updates the route, including a mix of string and object `route` props.
  - `tests/FormWizard.accessibility.spec.ts`
    - Checks roles, ARIA attributes, and linkage between tabs and panels.
  - `tests/TabContent.spec.ts`
    - Confirms that a `TabContent` registers with `FormWizard` and that its panel is visible (`aria-hidden="false"`) for the active step.
  - `tests/WizardStep.spec.ts`
    - Verifies that `WizardStep` renders with the expected `id` and `aria-controls` attributes derived from `tabId`.

### Features & polish

- **Richer slot props**:
  - Extended the `slotProps` provided by `FormWizard` to include:
    - `tabs`: the internal tab array.
    - `tabCount`: total number of tabs.
    - `wizardData`: reactive wizard data (used by schema mode; also available to slot consumers).
    - `updateWizardData`: function to update wizard data and emit `update:modelValue`.
    - In addition to the existing `nextTab`, `prevTab`, `activeTabIndex`, `isLastStep`, and `fillButtonStyle`.
  - Updated the `FormWizardSlotProps` type in `src/types.ts` accordingly so TypeScript users get full IntelliSense for these values.
- **Validation error model (foundation)**:
  - Kept the existing `beforeChange` API (boolean/Promise<boolean>) and `validationError` flag, but ensured that error states are consistently stored on the active tab by `FormWizard`.
  - These error flags are surfaced to `WizardStep` for styling (error color, `has_error` class) and can be consumed by custom step slots.
- **Keyboard/ARIA tightening**:
  - Ensured `WizardStep` and `TabContent` use a consistent `tabId`/`step-${tabId}` scheme so ARIA attributes remain in sync even when steps change dynamically.
  - Updated focus helpers to respect `checked` steps and align with the DOM id convention used in the markup.

### Migration notes

- Existing basic usage continues to work:
  - `route` props that were strings are still supported.
  - Default slot structure (`<form-wizard><tab-content ... /></form-wizard>`) and public props/events remain the same.
- **Schema mode** is optional: use `schema`, `schema-components`, and `v-model` when you prefer declarative step config; omit `schema` to keep the classic slot-based flow.
- If you relied on undocumented or internal behaviors:
  - The exact shape of internal tab objects (`Tab`) is now more clearly managed by `FormWizard`, and `TabContent` no longer maintains its own `checked` / `validationError` copies.
  - Keyboard focus helpers now assume the `step-${tabId}` id convention; custom markup that diverges from that pattern should align with the default `WizardStep` structure.
- To adopt the new router behavior:
  - You can now freely use either string or location-object `route` props on `TabContent`.
  - Ensure `vue-router` v4 is installed and registered via `app.use(router)` if you want URL ↔ tab synchronization.

