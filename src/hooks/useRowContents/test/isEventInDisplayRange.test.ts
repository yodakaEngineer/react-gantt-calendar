import { Event } from '../../../ReactGanttCalendar'
import dayjs from 'dayjs'
import { isEventInDisplayRange } from '../isEventInDisplayRange'

// Edit an assertion and save to see HMR in action

test('Events with a duration equal to the period return true.', () => {
  const start = dayjs('2022-08-24T00:00:00')
  const end = dayjs('2022-08-25T00:00:00')
  const event: Event = {
    label: '',
    startAt: new Date('2022-08-24T00:00:00'),
    endAt: new Date('2022-08-25T00:00:00'),
  }
  const filter = isEventInDisplayRange(start, end, 'day')

  expect(filter(event)).toBe(true)
})

test("Returns true if the event's duration includes the display period", () => {
  const start = dayjs('2022-08-24T00:00:00')
  const end = dayjs('2022-08-25T00:00:00')
  const event: Event = {
    label: '',
    startAt: new Date('2022-08-23T00:00:00'),
    endAt: new Date('2022-08-26T00:00:00'),
  }
  const filter = isEventInDisplayRange(start, end, 'day')

  expect(filter(event)).toBe(true)
})

test('Returns false if the event duration is before the display period', () => {
  const start = dayjs('2022-08-24T00:00:00')
  const end = dayjs('2022-08-25T00:00:00')
  const event: Event = {
    label: '',
    startAt: new Date('2022-08-23T00:00:00'),
    endAt: new Date('2022-08-24T00:00:00'),
  }
  const filter = isEventInDisplayRange(start, end, 'day')

  expect(filter(event)).toBe(false)
})

test('Returns false if the event duration is after the display period', () => {
  const start = dayjs('2022-08-24T00:00:00')
  const end = dayjs('2022-08-25T00:00:00')
  const event: Event = {
    label: '',
    startAt: new Date('2022-08-25T00:00:00'),
    endAt: new Date('2022-08-26T00:00:00'),
  }
  const filter = isEventInDisplayRange(start, end, 'day')

  expect(filter(event)).toBe(false)
})
