# react-gantt-calendar

A flexible React component for rendering Gantt chart calendars with hierarchical row structures and customizable time ranges.

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
      startDate={new Date()}
      displayRangeNumber={30}
      displayRangeUnit="day"
      displayRangeUnitNumber={1}
      dateColumnFormat="MM/DD"
      columns={[
        { label: 'Hotel' },
        { label: 'Floor' },
        { label: 'Room' }
      ]}
      rowHeads={[
        {
          id: '1',
          label: 'Hotel 1',
          childRowHeads: [
            {
              id: '1-1',
              label: '1F',
              childRowHeads: [
                { id: '1-1-1', label: 'Room 101' },
                { id: '1-1-2', label: 'Room 102' }
              ]
            }
          ]
        }
      ]}
      rowContents={[
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
      ]}
    />
  )
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `columns` | `Column[]` | Yes | - | Column headers for the row head section |
| `rowHeads` | `RowHeadProp[]` | Yes | - | Hierarchical row header structure |
| `rowContents` | `RowContent[]` | Yes | - | Row content with events |
| `startDate` | `Date` | No | Current date | Calendar start date |
| `displayRangeNumber` | `number` | No | `30` | Number of time units to display |
| `displayRangeUnit` | `ManipulateType` | No | `'day'` | Time unit for display ('minute' \| 'hour' \| 'day' \| 'week' \| 'month' \| 'year') |
| `displayRangeUnitNumber` | `number` | No | `1` | Increment of time units |
| `dateColumnFormat` | `string` | No | `'MM/DD'` | Date format for column headers using [dayjs format](https://day.js.org/docs/en/display/format) |
| `tableDataWidth` | `number` | No | `60` | Width of each time unit column in pixels |

### Type Definitions

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
  childRowHeads?: RowHeadProp[]
}
```

**`RowContent`**
```typescript
{
  headIds: Array<string | number>  // Path of row head IDs (e.g., ['hotel-id', 'floor-id', 'room-id'])
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
  startDate={new Date()}
  displayRangeNumber={30}
  displayRangeUnit="day"
  displayRangeUnitNumber={1}
  dateColumnFormat="MM/DD"
  // ... other props
/>
```

### Hourly View (24 hours)

```tsx
<ReactGanttCalendar
  startDate={new Date()}
  displayRangeNumber={24}
  displayRangeUnit="hour"
  displayRangeUnitNumber={1}
  dateColumnFormat="HH:mm"
  // ... other props
/>
```

### 30-Minute Intervals

```tsx
<ReactGanttCalendar
  startDate={new Date()}
  displayRangeNumber={48}
  displayRangeUnit="minute"
  displayRangeUnitNumber={30}
  dateColumnFormat="HH:mm"
  // ... other props
/>
```

### Custom Event Labels

Events can use custom React components that receive the calculated width:

```tsx
rowContents={[
  {
    headIds: ['1', '1-1', '1-1-1'],
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
]}
```

## License

MIT