import { RowHeadProp } from '../types'
// Make HeadId unique across Heads. (HeadId is unique only same level.)
export const recursiveAddPrefixToHeadId = (
  head: RowHeadProp,
  parentHead?: RowHeadProp,
) => {
  if (parentHead?.id) {
    head.id = `${parentHead.id}_${head.id}`
  }
  if (head.children) {
    head.children = head.children.map((v) =>
      recursiveAddPrefixToHeadId(v, head),
    )
  }
  return head
}
