import { changeStartAndEnd } from './changeStartAndEnd'
import { Event } from '../../ReactGanttCalendar'
import { Dayjs, ManipulateType } from 'dayjs'
import { calcEventWidthUnit } from './calcEventWidthUnit'

export const useEvent = () => {
  const calcEventWidth =
    (startDate: Dayjs, endDate: Dayjs, displayRangeUnit: ManipulateType) =>
    (event: Event) => {
      const { start, end } = changeStartAndEnd(
        event,
        startDate,
        endDate,
        displayRangeUnit
      )
      return calcEventWidthUnit(start, end, displayRangeUnit)
    }

  return {
    calcEventWidth,
  }
}
