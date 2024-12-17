import { changeStartAndEnd } from './changeStartAndEnd'
import { Event } from '../../types'
import { Dayjs, ManipulateType } from 'dayjs'
import { calcEventWidthUnit } from './calcEventWidthUnit'

export const useEvent = () => {
  const calcEventWidth =
    (
      startDate: Dayjs,
      endDate: Dayjs,
      displayRangeUnit: ManipulateType,
      displayRangeUnitNumber: number,
      displayRangeDateTimes: Dayjs[]
    ) =>
    (event: Event) => {
      const { start, end } = changeStartAndEnd(
        event,
        startDate,
        endDate,
        displayRangeUnit
      )
      return calcEventWidthUnit(
        start,
        end,
        displayRangeUnit,
        displayRangeUnitNumber,
        displayRangeDateTimes
      )
    }

  return {
    calcEventWidth,
  }
}
