// FIXME: I wanna allow user opt in.
import './styles.scss'
import React from 'react'

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
  const recursiveRowSpans = (head: RowHead) => {
    if (head.childRowHeads) {
      head.childRowHeads = head.childRowHeads.map(recursiveRowSpans)
    }
    head.rowSpan = rowContents
      .filter(content => content.headIds.includes(head.id))
      .length
    return head
  }
  const rowHeads = props.rowHeads.map(recursiveRowSpans)
  const renderedHeadIds: RowHead['id'][] = []
  const tableRows: TableRow[] = rowContents.map(content => {
    const row: TableRow = {
      tableHeads: [],
      tableData: content,
    }
    rowHeads.forEach(head => {
      if (content.headIds.includes(head.id)) {
        if (!renderedHeadIds.includes(head.id)) {
          row.tableHeads.push(head)
          renderedHeadIds.push(head.id)
        }
        if (head.childRowHeads) {
          head.childRowHeads.forEach(childHead => {
            if (content.headIds.includes(childHead.id)) {
              if (!renderedHeadIds.includes(childHead.id)) {
                row.tableHeads.push(childHead)
                renderedHeadIds.push(childHead.id)
              }
            }
          })
        }
      }
    })
    return row
  })

  return (
    <table className={'reactTimeline'}>
      <thead>
      </thead>
      <tbody>
      {
        tableRows.map(row => (
          <tr>
            {row.tableHeads.map(head => (<th rowSpan={head.rowSpan}>{head.label}</th>))}
            <td>{row.tableData.label}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
