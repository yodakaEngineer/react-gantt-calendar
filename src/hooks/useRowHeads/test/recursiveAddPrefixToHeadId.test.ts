import { RowHead } from '../../../ReactGanttCalendar'
import { recursiveAddPrefixToHeadId } from '../recursiveAddPrefixToHeadId'

test('success', () => {
  const childRowHead = {
    id: 1,
    label: '',
    leftIndex: 0,
  }
  const rowHead: RowHead = {
    id: 1,
    label: '',
    childRowHeads: [childRowHead],
    leftIndex: 1,
  }

  expect(recursiveAddPrefixToHeadId(rowHead)).toEqual({
    id: 1,
    label: '',
    childRowHeads: [
      {
        id: '1_1',
        label: '',
      },
    ],
  })
})
