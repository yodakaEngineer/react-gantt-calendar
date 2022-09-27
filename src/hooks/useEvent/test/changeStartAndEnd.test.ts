import dayjs, { ManipulateType } from 'dayjs'
import { Event } from '../../../ReactGanttCalendar'
import { changeStartAndEnd } from '../changeStartAndEnd'

test('If the event is within the display period, returns the start and end of the event as is.', () => {
  const start = dayjs('2022-08-23T00:00:00')
  const end = dayjs('2022-08-26T00:00:00')
  const eventStart = new Date('2022-08-24T00:00:00')
  const eventEnd = new Date('2022-08-25T00:00:00')
  const event: Event = {
    label: '',
    startAt: eventStart,
    endAt: eventEnd,
  }

  expect(changeStartAndEnd(event, start, end, 'day')).toEqual({
    start: dayjs(eventStart),
    end: dayjs(eventEnd),
  })
})

test.each<
  [
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    eventStart: Date,
    eventEnd: Date,
    displayRangeUnit: ManipulateType,
    exptected: ReturnType<typeof changeStartAndEnd>
  ]
>([
  [
    dayjs('2022-08-23T00:00:00'),
    dayjs('2022-08-26T00:00:00'),
    new Date('2022-08-24T00:00:00'),
    new Date('2022-08-25T00:00:01'),
    'day',
    {
      start: dayjs('2022-08-24T00:00:00'),
      end: dayjs('2022-08-26T00:00:00'),
    },
  ],
  [
    dayjs('2022-08-23T00:00:00'),
    dayjs('2022-08-26T00:00:00'),
    new Date('2022-08-24T00:00:00'),
    new Date('2022-08-24T01:00:01'),
    'hour',
    {
      start: dayjs('2022-08-24T00:00:00'),
      end: dayjs('2022-08-24T02:00:00'),
    },
  ],
])('Round Up %#', (start, end, eventStart, eventEnd, u, expected) => {
  const unit = u as ManipulateType
  const event: Event = {
    label: '',
    startAt: eventStart,
    endAt: eventEnd,
  }

  expect(changeStartAndEnd(event, start, end, unit)).toEqual(expected)
})

test.each<
  [
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    eventStart: Date,
    eventEnd: Date,
    displayRangeUnit: ManipulateType,
    exptected: ReturnType<typeof changeStartAndEnd>
  ]
>([
  [
    dayjs('2022-08-23T00:00:00'),
    dayjs('2022-08-26T00:00:00'),
    new Date('2022-08-24T00:00:00'),
    new Date('2022-08-25T00:00:00'),
    'day',
    {
      start: dayjs('2022-08-24T00:00:00'),
      end: dayjs(new Date('2022-08-25T00:00:00')),
    },
  ],
  [
    dayjs('2022-08-23T00:00:00'),
    dayjs('2022-08-26T00:00:00'),
    new Date('2022-08-24T00:00:00'),
    new Date('2022-08-24T01:00:00'),
    'hour',
    {
      start: dayjs('2022-08-24T00:00:00'),
      end: dayjs('2022-08-24T01:00:00'),
    },
  ],
])("Don't Round Up %#", (start, end, eventStart, eventEnd, u, expected) => {
  const unit = u as ManipulateType
  const event: Event = {
    label: '',
    startAt: eventStart,
    endAt: eventEnd,
  }

  expect(changeStartAndEnd(event, start, end, unit)).toEqual(expected)
})
