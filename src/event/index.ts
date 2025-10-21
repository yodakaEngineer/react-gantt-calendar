import { Dayjs, ManipulateType } from 'dayjs'
import { Event } from '../types'
import { calcEventWidthUnit } from './calcEventWidthUnit'
import { changeStartAndEnd } from './changeStartAndEnd'

export const calcEventWidth =
  (
    startDate: Dayjs,
    endDate: Dayjs,
    displayRangeUnit: ManipulateType,
    displayRangeUnitNumber: number,
    displayRangeDateTimes: Dayjs[],
  ) =>
  (event: Event) => {
    const { start, end } = changeStartAndEnd(
      event,
      startDate,
      endDate,
      displayRangeUnit,
    )
    return calcEventWidthUnit(
      start,
      end,
      displayRangeUnit,
      displayRangeUnitNumber,
      displayRangeDateTimes,
    )
  }
