import { Event } from '../../types'
import dayjs, { Dayjs, ManipulateType } from 'dayjs'

type ReturnType = {
  start: Dayjs
  end: Dayjs
}

export const changeStartAndEnd = (
  event: Event,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
  displayRangeUnit: ManipulateType
): ReturnType => {
  const eventStart = dayjs(event.startAt)
  const eventEnd = dayjs(event.endAt)
  const start = eventStart.isSameOrBefore(startDate)
    ? startDate
    : eventStart.startOf(displayRangeUnit)
  const end = eventEnd.isSameOrAfter(endDate)
    ? endDate
    : eventEnd.isSame(eventEnd.startOf(displayRangeUnit))
    ? eventEnd
    : eventEnd.startOf(displayRangeUnit).add(1, displayRangeUnit)

  return {
    start,
    end,
  }
}
