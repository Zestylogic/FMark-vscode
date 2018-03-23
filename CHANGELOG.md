# Change Log
All notable changes to the "fmark" extension will be documented in this file.

## [Unreleased]
- Initial release

## 0.0.2

- Fixed small bug that was stopping any function from running.

## 0.1.0

- Released first working version of the FMark plugin for vscode.
- It now supports
  - Tables with spreadsheet functionality
  - Macros
  - Markdown syntax

## 0.1.1

- Fixed stack overflow that occured.

## 0.1.3

- Added include of other fmark files
- Added function calls inside argument lists
- Added examples to repo

## 0.1.4

- Adding windows file path fix for relative includes

## 0.2.0

- Fixed most bugs, and will now fail smoothly when an error occurs,
by displaying the raw input instead of hanging

- Added TOC support for Table of Contents, which can be created anywhere using
the %%TOC token

- Added more documentation and examples of how to use FMark and cool things that

- Syntax highlighting underscores correctly. Triple asterisks/underscores highlighted as italic
can be done with it

## 0.2.1

- Fixing windows issue with wrong relative filepath
- Removed the recompilation option as that is done automatically now

## 0.2.2

- Fixed bug where no window would appear
- updated to newest branch

## 0.2.3

- Fixed another small bug with js-beautify

## 0.2.7

- Major bug fix with dependencies

## 0.2.10

- Adding back beautify

## 0.3.0

- First semi-stable release
- More bug fixes, such as fixing header id's when some headers are hidden.
- Made the plugin more stable
