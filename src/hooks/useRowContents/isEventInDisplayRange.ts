import dayjs, { Dayjs, ManipulateType } from 'dayjs'
import { Event } from '../../ReactGanttCalendar'

export const isEventInDisplayRange =
  (startDate: Dayjs, endDate: Dayjs, displayRangeUnit: ManipulateType) =>
  (event: Event): boolean => {
    const isDisplayRangeIncludeStart = dayjs(event.startAt).isBetween(
      startDate,
      endDate,
      displayRangeUnit,
      '[)'
    )
    const isDisplayRangeIncludeEnd = dayjs(event.endAt).isBetween(
      startDate,
      endDate,
      displayRangeUnit,
      '(]'
    )
    const isEventRangeIncludeDisplayRange =
      dayjs(event.endAt).isSameOrAfter(endDate, displayRangeUnit) &&
      dayjs(event.startAt).isSameOrBefore(startDate, displayRangeUnit)
    return (
      isDisplayRangeIncludeStart ||
      isDisplayRangeIncludeEnd ||
      isEventRangeIncludeDisplayRange
    )
  }
