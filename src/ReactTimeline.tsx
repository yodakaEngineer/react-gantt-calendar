// FIXME: I wanna allow user opt in.
import './styles.scss'
import React, { useMemo } from 'react'
import dayjs from 'dayjs'

type RowHead = {
  id: string | number
  label: string | React.ReactNode
  onClick?: (row: RowHead) => void
  childRowHeads?: RowHead[]
  rowSpan?: number
}

type RowContent = {
  headIds: RowHead['id'][]
  label: string | React.ReactNode
  startAt: Date
  endAt: Date
}

type TableRow = {
  tableHeads: RowHead[]
  tableData: RowContent
}

type Column = {
  label: string | React.ReactNode
}

type Props = {
  columns: Column[]
  rowHeads: RowHead[]
  rowContents: RowContent[]
  startDate?: Date
  displayRangeNumber?: number
  displayRangeUnit?: 'day' | 'week' | 'month' | 'year'
  dateColumnFormat?: string
}

export const ReactTimeline = (props: Props) => {
  const { rowContents, columns } = props
  const startDate = dayjs(props.startDate)
  const displayRangeNumber = props.displayRangeNumber ?? 31
  const displayRange = [...Array(displayRangeNumber)].map((_, i) => i)
  const displayRangeUnit = props.displayRangeUnit ?? 'day'
  const dateColumnFormat = props.dateColumnFormat ?? 'MM/DD'

  const rowHeads = useMemo(() => {
    const recursiveRowSpans = (head: RowHead) => {
      if (head.childRowHeads) {
        head.childRowHeads = head.childRowHeads.map(recursiveRowSpans)
      }
      head.rowSpan = rowContents
        .filter(content => content.headIds.includes(head.id))
        .length
      return head
    }
    return props.rowHeads.map(recursiveRowSpans)
  }, [props.rowHeads, rowContents])

  const renderedHeadIds: RowHead['id'][] = []
  const tableRows: TableRow[] = useMemo(() => {
    const recursiveMakeTableRows = (content: RowContent, head: RowHead, renderedHeadIds: RowHead['id'][], row: TableRow) => {
      if (content.headIds.includes(head.id)) {
        if (!renderedHeadIds.includes(head.id)) {
          row.tableHeads.push(head)
          renderedHeadIds.push(head.id)
        }
        if (head.childRowHeads) {
          head.childRowHeads.forEach(childHead => { recursiveMakeTableRows(content, childHead, renderedHeadIds, row) })
        }
      }
      return row
    }
    return rowContents.map(content => {
      const row: TableRow = {
        tableHeads: [],
        tableData: content,
      }
      rowHeads.forEach(head => { recursiveMakeTableRows(content, head, renderedHeadIds, row) })
      return row
    })
  }, [rowContents, rowHeads, renderedHeadIds])

  return (
    <table className={'reactTimeline'}>
      <thead>
      <tr>
        {columns.map(column => (<th>{column.label}</th>))}
        {displayRange.map(unit => {
          const date = startDate.add(unit, displayRangeUnit)
          return (
            <td key={'RTLDR_' + unit}>
              {date.format(dateColumnFormat)}
            </td>
          )
        })}
      </tr>
      </thead>
      <tbody>
      {
        tableRows.map((row, index) => (
          <tr key={'RTLTR_' + index}>
            {row.tableHeads.map(head => (<th key={'RTLTH_' + head.id} rowSpan={head.rowSpan}>{head.label}</th>))}
            <td>{row.tableData.label}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
