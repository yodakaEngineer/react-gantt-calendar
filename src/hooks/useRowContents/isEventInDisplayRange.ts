import dayjs, { Dayjs } from 'dayjs'
import { Event } from '../../ReactGanttCalendar'

export const isEventInDisplayRange =
  (startDate: Dayjs, endDate: Dayjs) =>
  (event: Event): boolean => {
    const isDisplayRangeIncludeStart = dayjs(event.startAt).isBetween(
      startDate,
      endDate,
      null,
      '[)'
    )
    const isDisplayRangeIncludeEnd = dayjs(event.endAt).isBetween(
      startDate,
      endDate,
      null,
      '(]'
    )
    const isEventRangeIncludeDisplayRange =
      dayjs(event.endAt).isSameOrAfter(endDate) &&
      dayjs(event.startAt).isSameOrBefore(startDate)
    return (
      isDisplayRangeIncludeStart ||
      isDisplayRangeIncludeEnd ||
      isEventRangeIncludeDisplayRange
    )
  }
