import {RowHead} from '../../ReactGanttCalendar'

export const recursiveMakeLeftIndex = (head: RowHead, index = -1) => {
  index++
  if (head.childRowHeads) {
    head.childRowHeads = head.childRowHeads.map((v) =>
      recursiveMakeLeftIndex(v, index)
    )
  }
  head.leftIndex = index
  return head
}
