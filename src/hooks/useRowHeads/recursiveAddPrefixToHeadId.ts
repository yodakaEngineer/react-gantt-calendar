import { RowHead } from '../../ReactGanttCalendar'

// Make HeadId unique across Heads. (HeadId is unique only same level.)
export const recursiveAddPrefixToHeadId = (
  head: RowHead,
  parentHead?: RowHead
): RowHead => {
  if (parentHead?.id) {
    head.id = `${parentHead.id}_${head.id}`
  }
  if (head.childRowHeads) {
    head.childRowHeads = head.childRowHeads.map((v) =>
      recursiveAddPrefixToHeadId(v, head)
    )
  }
  return head
}
