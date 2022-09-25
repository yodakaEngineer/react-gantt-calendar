import { RowContent, RowHead } from '../../ReactGanttCalendar'

export const recursiveMakeRowSpans = (
  head: RowHead,
  rowContents: RowContent[]
): RowHead => {
  if (head.childRowHeads) {
    head.childRowHeads = head.childRowHeads.map((v) =>
      recursiveMakeRowSpans(v, rowContents)
    )
  }
  head.rowSpan = rowContents.filter((content) =>
    content.headIds.includes(head.id)
  ).length
  return head
}
