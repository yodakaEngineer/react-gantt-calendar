import { FormattingRowHead } from './index'

export const recursiveMakeLeftIndex = (head: FormattingRowHead, index = -1) => {
  index++
  if (head.childRowHeads) {
    head.childRowHeads = head.childRowHeads.map((v) =>
      recursiveMakeLeftIndex(v, index)
    )
  }
  head.leftIndex = index
  return head
}
