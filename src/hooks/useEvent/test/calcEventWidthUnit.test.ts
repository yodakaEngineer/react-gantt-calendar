import dayjs from 'dayjs'
import { calcEventWidthUnit } from '../calcEventWidthUnit'

test('Even if the event is less than one unit from start to end, it is still considered one unit.', () => {
  const start = dayjs('2022-08-22T00:00:00')
  const end = dayjs('2022-08-22T04:00:00')
  const displayRangeDateTimes = [
    dayjs('2022-08-21T00:00:00'),
    dayjs('2022-08-22T00:00:00'),
    dayjs('2022-08-23T00:00:00'),
  ]
  expect(calcEventWidthUnit(start, end, 'day', 1, displayRangeDateTimes)).toBe(1)
})
