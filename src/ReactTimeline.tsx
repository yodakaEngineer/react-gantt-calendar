// FIXME: I wanna allow user opt in.
import './styles.scss'
import React, { useMemo } from 'react'

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

type Props = {
  rowHeads: RowHead[]
  rowContents: RowContent[]
}

export const ReactTimeline = (props: Props) => {
  const { rowContents } = props

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
