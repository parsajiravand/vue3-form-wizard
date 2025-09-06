# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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