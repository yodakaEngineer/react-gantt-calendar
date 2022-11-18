import dayjs, { Dayjs, ManipulateType } from 'dayjs'

export const calcEventWidthUnit = (
  start: Dayjs,
  end: Dayjs,
  displayRangeUnit: ManipulateType
): number => {
  const diff = dayjs(end).diff(start, displayRangeUnit)
  return diff < 1 ? 1 : diff
}
