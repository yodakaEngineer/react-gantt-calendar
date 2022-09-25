import produce from 'immer'
import { recursiveAddPrefixToHeadId } from './recursiveAddPrefixToHeadId'
import { RowContent, RowHead } from '../../ReactGanttCalendar'
import { recursiveMakeRowSpans } from './recursiveMakeRowSpans'

export const useRowHeads = () => {
  const makeRowHeads = (
    rowHeads: RowHead[],
    rowContents: RowContent[]
  ): RowHead[] => {
    return produce(rowHeads, (draft) => {
      draft.forEach((v) => recursiveAddPrefixToHeadId(v))
      draft.forEach((v) => recursiveMakeRowSpans(v, rowContents))
    })
  }

  return {
    makeRowHeads,
  }
}
