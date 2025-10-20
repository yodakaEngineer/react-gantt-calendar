# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

react-gantt-calendar is a React library for rendering Gantt chart calendars with customizable time ranges and row hierarchies. It's built as an NPM package using TypeScript, React, and Vite.

## Common Commands

### Development
- `npm run dev` - Start Vite development server
- `npm run storybook` - Start Storybook on port 6006

### Build
- `npm run build` - TypeScript compile + Vite build (ES and UMD formats)
- `npm run prepare` - Clean dist/types directories and rebuild

### Testing
- `npm run test` - Run tests with Vitest (timezone set to UTC)
- `npm run coverage` - Run tests with coverage report

### Code Quality
- `npm run format` - Format code with Prettier

## Architecture

### Main Component
`src/ReactGanttCalendar.tsx` is the primary exported component that orchestrates the entire Gantt calendar rendering. It uses dayjs for date manipulation with plugins (isBetween, isSameOrAfter, isSameOrBefore).

### Core Hooks
The component logic is split into four custom hooks located in `src/hooks/`:

- **useEvent** (`src/hooks/useEvent/`) - Calculates event widths and handles event dimension logic
  - `calcEventWidthUnit.ts` - Computes width units for events
  - `changeStartAndEnd.ts` - Adjusts event start/end times

- **useRowContents** (`src/hooks/useRowContents/`) - Processes row content data and filters events
  - `isEventInDisplayRange.ts` - Determines if events should be displayed within date range

- **useRowHeads** (`src/hooks/useRowHeads/`) - Manages row header rendering with nested hierarchies
  - `recursiveMakeRowSpans.ts` - Calculates rowspan for hierarchical headers
  - `recursiveAddPrefixToHeadId.ts` - Generates unique IDs for nested headers
  - `recursiveMakeLeftIndex.ts` - Computes left positioning indices

- **useTableRows** (`src/hooks/useTableRows/`) - Combines row heads and contents into table structure
  - `recursiveMakeTableRows.ts` - Builds final table row data structure

### Type System
`src/types/index.ts` defines the public API:
- `Props` - Main component props interface
- `RowHeadProp` - User-provided row header structure
- `RowContent` - Row content with events
- `Event` - Individual event data
- `Column` - Column header configuration

### Entry Point
`src/main.ts` exports the component, types, and styles as the library's public API.

## Testing

Tests are colocated in `test/` directories next to implementation files:
- Each hook has its own test coverage
- Tests use Vitest with global test APIs enabled
- Setup file: `vitest-setup.ts`
- Run in UTC timezone for consistency

## Build Output

The build process generates:
- `dist/index.js` - ES module
- `dist/index.umd.cjs` - UMD module
- `dist/index.d.ts` - TypeScript declarations
- `dist/style.css` - Component styles

External dependencies (react, react-dom) are excluded from the bundle.
