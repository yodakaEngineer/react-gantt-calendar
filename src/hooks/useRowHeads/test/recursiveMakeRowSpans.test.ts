import { RowContent, RowHeadProp } from '../../../types'
import { recursiveMakeRowSpans } from '../recursiveMakeRowSpans'

test('Success', () => {
  const rowHead: RowHeadProp = {
    id: '1-1',
    label: '',
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

  expect(recursiveMakeRowSpans(rowHead, rowContents)).toEqual({
    id: '1-1',
    label: '',
    rowSpan: 3,
  })
})
