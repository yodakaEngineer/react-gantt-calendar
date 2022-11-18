import { createDraft, finishDraft } from 'immer'
import { recursiveAddPrefixToHeadId } from './recursiveAddPrefixToHeadId'
import { RowContent, RowHead, RowHeadProp } from '../../types'
import { recursiveMakeRowSpans } from './recursiveMakeRowSpans'
import { recursiveMakeLeftIndex } from './recursiveMakeLeftIndex'

export type FormattingRowHead = RowHeadProp &
  Partial<Pick<RowHead, 'leftIndex' | 'rowSpan'>>

export const useRowHeads = () => {
  const makeRowHeads = (
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

  return {
    makeRowHeads,
  }
}
