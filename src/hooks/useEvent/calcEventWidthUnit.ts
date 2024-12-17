import dayjs, { Dayjs, ManipulateType } from 'dayjs'

export const calcEventWidthUnit = (
  start: Dayjs,
  end: Dayjs,
  displayRangeUnit: ManipulateType,
  displayRangeUnitNumber: number,
  displayRangeDateTimes: Dayjs[]
): number => {
  const rangeList = displayRangeDateTimes.map((range) => [
    range,
    range.add(displayRangeUnitNumber, displayRangeUnit),
  ])
  
  const startRange = rangeList.find(([rangeStart, rangeEnd]) =>
    dayjs(start).isBetween(rangeStart, rangeEnd, null, '()')
  )
  const endRange = rangeList.find(([rangeStart, rangeEnd]) =>
    dayjs(end).isBetween(rangeStart, rangeEnd, null, '()')
  )

  const newStart = startRange?.[0] ?? start
  const newEnd = endRange?.[1] ?? end

  let diff = dayjs(newEnd).diff(newStart, displayRangeUnit)

  diff = diff / displayRangeUnitNumber
  return diff < 1 ? 1 : diff
}
