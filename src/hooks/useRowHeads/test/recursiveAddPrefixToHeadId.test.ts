import { RowHeadProp } from '../../../types'
import { recursiveAddPrefixToHeadId } from '../recursiveAddPrefixToHeadId'

test('success', () => {
  const childRowHead = {
    id: 1,
    label: '',
  }
  const rowHead: RowHeadProp = {
    id: 1,
    label: '',
    childRowHeads: [childRowHead],
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
