import { FormattingRowHead } from './index'

export const recursiveMakeLeftIndex = (head: FormattingRowHead, index = -1) => {
  index++
  if (head.children) {
    head.children = head.children.map((v) => recursiveMakeLeftIndex(v, index))
  }
  head.leftIndex = index
  return head
}
