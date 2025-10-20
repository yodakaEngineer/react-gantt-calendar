import { ManipulateType } from 'dayjs'
import React from 'react'

export type RowHead = {
  id: string | number
  label: string | (() => React.ReactNode)
  children?: RowHead[]
  rowSpan: number
  leftIndex: number
}

export type RowHeadProp = Omit<
  RowHead,
  'children' | 'rowSpan' | 'leftIndex'
> & {
  children?: RowHeadProp[]
}

export type EventLabelCallbackProps = {
  width: number
}

export type Event = {
  // label can be a string or a function that returns a React node(except Promise<React.ReactNode>).
  label: string | ((props: EventLabelCallbackProps) => React.ReactNode)
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
