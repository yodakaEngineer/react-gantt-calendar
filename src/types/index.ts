import { ManipulateType } from 'dayjs'
import React from 'react'

export type RowHead = {
  id: string | number
  label: string | (() => React.ReactNode)
  childRowHeads?: RowHead[]
  rowSpan: number
  leftIndex: number
}

export type RowHeadProp = Omit<
  RowHead,
  'childRowHeads' | 'rowSpan' | 'leftIndex'
> & {
  childRowHeads?: RowHeadProp[]
}

export type EventLabelCallbackProps = {
  width: number
}

export type Event = {
  label: string | React.FC<EventLabelCallbackProps>
  startAt: Date
  endAt: Date
}

export type RowContent = {
  headIds: RowHead['id'][]
  events: Event[]
}

export type Column = {
  label: string | (() => React.ReactNode)
}

export type DisplayRange = {
  range: number
  unit: ManipulateType
  unitNumber: number
  format: string
}

export type Options = {
  displayRange?: DisplayRange
  tableCellWidth?: number
  startDate?: Date | string
}

export type Rows = {
  heads: RowHeadProp[]
  contents: RowContent[]
}

export type Data = {
  columns: Column[]
  rows: Rows
}

export type Props = {
  options?: Options
  data: Data
}
