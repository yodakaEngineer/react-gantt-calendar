import { RowContent, RowHead } from '../../../ReactGanttCalendar'
import { recursiveMakeRowSpans } from '../recursiveMakeRowSpans'

test('Success', () => {
  const rowHead: RowHead = {
    id: '1-1',
    label: '',
    leftIndex: 0,
  }
  const rowContents: RowContent[] = [
    {
      headIds: ['1', '1-1', '1-1-1'],
      events: [],
    },
    {
      headIds: ['1', '1-1', '1-1-2'],
      events: [],
    },
    {
      headIds: ['1', '1-1', '1-1-3'],
      events: [],
    },
  ]

  expect(recursiveMakeRowSpans(rowHead, rowContents)).toContain({
    id: '1-1',
    label: '',
    rowSpan: 3,
  })
})
