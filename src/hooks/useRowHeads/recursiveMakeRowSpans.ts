import { RowContent } from '../../types'
import { FormattingRowHead } from './index'

export const recursiveMakeRowSpans = (
  head: FormattingRowHead,
  rowContents: RowContent[]
) => {
  if (head.childRowHeads) {
    head.childRowHeads = head.childRowHeads.map((v) =>
      recursiveMakeRowSpans(v, rowContents)
    )
  }
  head.rowSpan = rowContents.filter((v) => v.headIds.includes(head.id)).length
  return head
}
