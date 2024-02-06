import dayjs from 'dayjs'
import { calcEventWidthUnit } from '../calcEventWidthUnit'

test('Even if the event is less than one unit from start to end, it is still considered one unit.', () => {
  const start = dayjs('2022-08-22T00:00:00')
  const end = dayjs('2022-08-22T04:00:00')

  expect(calcEventWidthUnit(start, end, 'day', 1)).toBe(1)
})
