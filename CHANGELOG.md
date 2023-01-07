# Change Log

All notable changes to the "tothom" extension will be documented in this file.

This file is structured according to the [Keep a Changelog](http://keepachangelog.com/) recommendations.

## [Unreleased]

### Added

- Option to default to running code blocks in a separate shell in the background instead of the in the integrated terminal. Output is appended to the preview. (Closes https://github.com/guicassolato/tothom/issues/6)
- Option to save env variables to temporary file when running code blocks in a separate shell in the background
- New command <kbd>⇧ ⌘ P</kbd> _Tothom: Clear terminal selection_ - removes the binding between the activate preview and a terminal

## [v0.3.0] - 2022-01-05

### Added

- New command <kbd>⇧ ⌘ P</kbd> _Tothom: Markdown Preview (existing terminal)_ - allows to share preexisting terminals across preview windows
- New command <kbd>⇧ ⌘ P</kbd> _Tothom: Select terminal_ - allows to re-bind the active preview to an existing terminal
- Follow links between local markdown files - opening a new preview window automatically for each file

### Fixed

- Relative local image file paths required './' at the beginning of the path

## [v0.3.1] - 2022-01-04

### Fixed

- 'Tothom preview not found' message shown whenever the text editor changes. (Closes https://github.com/guicassolato/tothom/issues/27)

## [v0.3.0] - 2022-01-04

### Added

- Added support for HTML tag attributes (with markdown-it-attrs)
- Option to configure the ▶️ label of the 'Run in terminal' button
- Command to force reload the preview

### Changed

- Image tags can be rendered without directly resorting to `String.replace`, but leveraging a proper Markdown-it renderer rule
- Markdown-it's `heading_open` renderer rule is now part of the `engine` and not coupled into the `Tothom` class

### Fixed

- VSCode Markdown plugin configs removed - _They were broken since Day 1 actually. Oops!_
- Relative paths in the image sources
- Active workspace directory added to webview's local resource roots
- <kbd> tags in the README and samples

## [v0.2.0] - 2022-01-03

### Added

- Find widget enabled in the preview window
- Support for anchor links
- Support for task/todo lists

### Changed

- Link to the extensions in the Visual Studio Marketplace added to the README
- Resolution of the animated usage instructions in the README image improved

## [v0.1.0] - 2022-01-02

### Added

- Auto-generated ▶️ _Run in terminal_ actions for code blocks
- Separate preview windows/tabs for each markdown file
- GitHub styling (support for dark/light mode)
- Syntax highlight for code blocks
