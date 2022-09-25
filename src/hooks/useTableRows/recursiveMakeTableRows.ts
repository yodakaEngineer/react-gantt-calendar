import {RowContent, RowHead, TableRow} from '../../ReactGanttCalendar'

export const recursiveMakeTableRows = (
  content: RowContent,
  head: RowHead,
  renderedHeadIds: RowHead['id'][],
  row: TableRow
) => {
  if (content.headIds.includes(head.id)) {
    if (!renderedHeadIds.includes(head.id)) {
      row.tableHeads.push(head)
      renderedHeadIds.push(head.id)
    }
    if (head.childRowHeads) {
      head.childRowHeads.forEach((childHead) => {
        recursiveMakeTableRows(content, childHead, renderedHeadIds, row)
      })
    }
  }
  return row
}
