# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-08
### Fixed
- **Removing a step left it in the wizard.** `removeTab` compared object identity against a copy `addTab` had stored, so it never matched. A `<tab-content>` hidden with `v-if` unmounted its panel but kept its entry in the navigation, progress bar and step count. Steps are now unregistered by the child's uid.
- **Steps mounted later were appended instead of ordered.** A step revealed by `v-if` registered last and appeared at the end of the navigation regardless of its position in the markup. Order now follows DOM position, reconciled once the DOM settles.
- **`<tab-content>` prop changes were ignored.** The wizard registered a step once and never saw later changes to `title`, `icon`, `route`, `before-change` or `after-change` — a problem when Vue reuses a step in place, or when titles are translated at runtime.
- **Every wizard on a page rendered `id="fw_1"`.** The instance counter lived inside `<script setup>`, so it reset for each instance. Generated step ids are now scoped to the wizard id too, so arrow-key focus can no longer jump into a different wizard.
- **Removing the active first step set `activeTabIndex` to `-1`**, leaving no step selected and `maxStep` negative.
- **`reset()` threw** on a wizard with no steps (`Cannot set properties of undefined`). Validation state is now written defensively.
- Generated step ids are sanitized, so untitled steps no longer produce ids like `0` that are invalid in CSS selectors.
- Schema step ids no longer include the step index, so the active step is retained when a conditional step is added or removed.
- Vue no longer warns that a component was made reactive when using `schema-components`.
- The progress bar no longer computes an infinite width when there are no steps.

### Accessibility
- Steps respond to <kbd>Space</kbd> as well as <kbd>Enter</kbd>, as do the Back/Next/Finish controls (WCAG 2.1.1).
- `aria-disabled` was inverted: the current step was announced as disabled while unreachable steps were announced as enabled. It now reflects whether a step has been reached.
- Unreachable steps render `tabindex="-1"` instead of an invalid empty `tabindex`.
- `<li>` wrappers inside the tablist are marked `role="presentation"` so the tablist/tab structure is exposed correctly.
- Arrow keys follow the visual order and are mirrored under `reverse-horizontal`.
- The Finish button is disabled while an async `beforeChange` is in flight, matching Back and Next.

### Changed
- A step inserted ahead of the active one no longer pulls the user back to it and no longer resets `maxStep`; the user keeps their place. This code path was unreachable in every released version, so no existing behaviour changes.
- Generated `tabId` values are now `<wizardId>-<slug>-<n>` (schema mode: `<wizardId>-<stepId>`). The documented `step-${tabId}` convention is unchanged; only the generated value differs.

### Added
- `updateTab` is provided to `<tab-content>` and exposed on the wizard instance, so a step's registration can be refreshed after its props change.
- Docs: RTL prop reference, dynamic steps, and an accessibility section in the README.


## [1.0.0] - 2025-03
### Added
- **Schema mode**: Declarative API with `schema`, `schema-components`, and `v-model` for shared wizard data
- Schema step support for `condition` (hide steps dynamically) and `validate` (block navigation)
- Richer slot props: `tabs`, `tabCount`, `wizardData`, `updateWizardData`
- 15 local samples in `App.vue`: basic, icons, layouts, shapes, validation, schema mode
- Test suite: Vitest + Vue Test Utils (navigation, validation, router, accessibility, TabContent, WizardStep)
- `jsdom` and `vue-router` as devDependencies for tests
- `npm run test` script
- Vue JSX plugin for `.tsx` test files
- Improved accessibility: unified IDs, ARIA linkage, keyboard navigation (left/right keys)
- Vue Router support for string and location-object `route` props
- SSR safeguards: guarded DOM access when `document` is unavailable
- Stable per-instance `wizardId` generation
- Type re-exports for `FormWizardSchema`, `WizardData`, etc.

### Changed
- Router integration: normalized route handling, no-op when vue-router not installed
- FormWizard as single source of truth for `active`, `checked`, `validationError`; TabContent uses callbacks
- Clarified packaging: `sideEffects` for styles, `types` entry in package.json

### Migration
- Classic slot mode and `route` strings remain supported
- Schema mode is optional; omit `schema` to use classic flow
- Ensure vue-router v4 is installed for URL ↔ tab sync

## [0.3.2] - 2025-09-06
### Added
- Vue Router integration for automatic route synchronization
- Route-based navigation support with `route` prop on tab-content components
- Automatic URL updates when switching tabs
- Browser history support (back/forward buttons)
- Deep linking support for shareable URLs
- Route watching and navigation handling
- Router test functionality

### Changed
- Enhanced FormWizard component with router integration
- Updated component lifecycle with proper router setup and cleanup

## [0.3.1] - 2025-09-01
### Changed
- Version bump for maintenance release

## [0.3.0] - 2025-08-29
### Added
- Function exposure in form-wizard component
- Composition API updates

### Fixed
- Tab content not showing issue

## [0.2.8] - 2025-08-29
### Changed
- Version bump for maintenance release

## [0.2.7] - 2025-08-29
### Changed
- Internal improvements and bug fixes

## [0.2.2]
### Fixed
- TypeScript import component issue

## [0.1.9]
### Added
- Additional features and improvements

### Changed
- Component structure updates

### Fixed
- Fixed decentered progress bar at step-sizes < 'md'

## [0.1.1]
### Added
- Custom icon props
- Text and background color checking functionality

### Changed
- Icon section structure improvements
- Add tab function structure (removed get index by slot)

### Removed
- Some transition effects
- Source folder in dist