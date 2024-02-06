import dayjs, { Dayjs, ManipulateType } from 'dayjs'

export const calcEventWidthUnit = (
  start: Dayjs,
  end: Dayjs,
  displayRangeUnit: ManipulateType,
  displayRangeUnitNumber: number
): number => {
  let diff = dayjs(end).diff(start, displayRangeUnit)
  diff = diff / displayRangeUnitNumber
  return diff < 1 ? 1 : diff
}
