import produce from 'immer'
import dayjs, { Dayjs, ManipulateType } from 'dayjs'
import { RowContent, RowHead } from '../../ReactGanttCalendar'
import { isEventInDisplayRange } from './isEventInDisplayRange'

export const useRowContents = () => {
  const makeRowContents = (
    rowContents: RowContent[],
    startDate: Dayjs,
    endDate: Dayjs,
    displayRangeUnit: ManipulateType
  ): RowContent[] => {
    const filter = isEventInDisplayRange(startDate, endDate, displayRangeUnit)
    return produce(rowContents, (draft) => {
      draft.forEach((content) => {
        content.events = content.events
          .filter(filter)
          .sort((prevEvent, currentEvent) =>
            dayjs(prevEvent.startAt).diff(currentEvent.startAt)
          )
        const headIds: RowHead['id'][] = []
        content.headIds.forEach((v, i) => {
          headIds.push(i !== 0 ? `${headIds[i - 1]}_${v}` : v)
        })
        content.headIds = headIds
      })
    })
  }

  return {
    makeRowContents,
  }
}
