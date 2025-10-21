# react-gantt-calendar

A flexible React component for rendering Gantt chart calendars with hierarchical row structures and customizable time ranges.
**⚠️ This Package is in development stage. Breaking changes may be included in the release. ⚠️**

## Installation

```bash
npm install react-gantt-calendar
```

## Usage

```tsx
import React from 'react'
import { ReactGanttCalendar } from 'react-gantt-calendar'
import 'react-gantt-calendar/dist/style.css'

function App() {
  return (
    <ReactGanttCalendar
      options={{
        displayRange: {
          range: 30,
          unit: 'day',
          unitNumber: 1,
          format: 'MM/DD'
        },
        tableCellWidth: 60,
        startDate: new Date()
      }}
      data={{
        columns: [
          { label: 'Hotel' },
          { label: 'Floor' },
          { label: 'Room' }
        ],
        rows: {
          heads: [
            {
              id: '1',
              label: 'Hotel 1',
              children: [
                {
                  id: '1-1',
                  label: '1F',
                  children: [
                    { id: '1-1-1', label: 'Room 101' },
                    { id: '1-1-2', label: 'Room 102' }
                  ]
                }
              ]
            }
          ],
          contents: [
            {
              headIds: ['1', '1-1', '1-1-1'],
              events: [
                {
                  label: 'Reservation',
                  startAt: new Date('2025-01-15'),
                  endAt: new Date('2025-01-20')
                }
              ]
            }
          ]
        }
      }}
    />
  )
}
```

## Props

### Root Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `Options` | No | See below | Display and rendering options |
| `data` | `Data` | Yes | - | Chart data including columns and rows |

### Options Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `displayRange` | `DisplayRange` | No | See below | Time range display configuration |
| `displayRange.range` | `number` | No | `30` | Number of time units to display |
| `displayRange.unit` | `'minute' \| 'hour' \| 'day' \| 'week' \| 'month' \| 'year'` | No | `'day'` | Time unit for display |
| `displayRange.unitNumber` | `number` | No | `1` | Increment of time units |
| `displayRange.format` | `string` | No | `'MM/DD'` | Date format using [dayjs format](https://day.js.org/docs/en/display/format) |
| `tableCellWidth` | `number` | No | `60` | Width of each time unit column in pixels |
| `startDate` | `Date \| string` | No | Current date | Calendar start date |

### Data Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `columns` | `Column[]` | Yes | - | Column headers for the row head section |
| `rows` | `Rows` | Yes | - | Row data structure |
| `rows.heads` | `RowHeadProp[]` | Yes | - | Hierarchical row header structure |
| `rows.contents` | `RowContent[]` | Yes | - | Row content with events |

### Type Definitions

**`Options`**
```typescript
{
  displayRange?: {
    range: number          // Number of time units to display (default: 30)
    unit: ManipulateType   // Time unit ('minute' | 'hour' | 'day' | 'week' | 'month' | 'year') (default: 'day')
    unitNumber: number     // Increment of time units (default: 1)
    format: string         // Date format using dayjs format (default: 'MM/DD')
  }
  tableCellWidth?: number  // Width of each time unit column in pixels (default: 60)
  startDate?: Date | string  // Calendar start date (default: current date)
}
```

**`Data`**
```typescript
{
  columns: Column[]        // Column headers for the row head section
  rows: {
    heads: RowHeadProp[]   // Hierarchical row header structure
    contents: RowContent[] // Row content with events
  }
}
```

**`Column`**
```typescript
{
  label: string | (() => React.ReactNode)
}
```

**`RowHeadProp`**
```typescript
{
  id: string | number
  label: string | (() => React.ReactNode)
  children?: RowHeadProp[]
}
```

**`RowContent`**
```typescript
{
  headIds: Array<string | number>  // Path of row head IDs (e.g., ['1', '1-1', '1-1-1'])
  events: Event[]
}
```

**`Event`**
```typescript
{
  label: string | React.FC<{ width: number }>
  startAt: Date
  endAt: Date
}
```

## Examples

### Daily View (30 days)

```tsx
<ReactGanttCalendar
  options={{
    displayRange: {
      range: 30,
      unit: 'day',
      unitNumber: 1,
      format: 'MM/DD'
    },
    startDate: new Date()
  }}
  data={{
    // ... columns and rows
  }}
/>
```

### Hourly View (24 hours)

```tsx
<ReactGanttCalendar
  options={{
    displayRange: {
      range: 24,
      unit: 'hour',
      unitNumber: 1,
      format: 'HH:mm'
    },
    startDate: new Date()
  }}
  data={{
    // ... columns and rows
  }}
/>
```

### 30-Minute Intervals

```tsx
<ReactGanttCalendar
  options={{
    displayRange: {
      range: 48,
      unit: 'minute',
      unitNumber: 30,
      format: 'HH:mm'
    },
    startDate: new Date()
  }}
  data={{
    // ... columns and rows
  }}
/>
```

### Custom Event Labels

Events can use custom React components that receive the calculated width:

```tsx
data={{
  columns: [{ label: 'Room' }],
  rows: {
    heads: [{ id: '1', label: 'Room 101' }],
    contents: [
      {
        headIds: ['1'],
        events: [
          {
            label: ({ width }) => (
              <button style={{ width, textAlign: 'left' }}>
                Custom Button
              </button>
            ),
            startAt: new Date('2025-01-15'),
            endAt: new Date('2025-01-20')
          }
        ]
      }
    ]
  }
}}
```

## License

MIT