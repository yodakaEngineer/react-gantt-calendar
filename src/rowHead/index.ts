import { createDraft, finishDraft } from 'immer'
import { RowContent, RowHead, RowHeadProp } from '../types'
import { recursiveAddPrefixToHeadId } from './recursiveAddPrefixToHeadId'
import { recursiveMakeLeftIndex } from './recursiveMakeLeftIndex'
import { recursiveMakeRowSpans } from './recursiveMakeRowSpans'

export type FormattingRowHead = RowHeadProp &
  Partial<Pick<RowHead, 'leftIndex' | 'rowSpan'>>

export const makeRowHeads = (
  rowHeads: RowHeadProp[],
  rowContents: RowContent[]
): RowHead[] => {
  const draft = createDraft<FormattingRowHead[]>(rowHeads)
  draft.forEach((v) => {
    recursiveMakeLeftIndex(v)
    recursiveAddPrefixToHeadId(v)
    recursiveMakeRowSpans(v, rowContents)
  })
  // TODO: remove as RowHead[]
  return finishDraft(draft) as RowHead[]
}
