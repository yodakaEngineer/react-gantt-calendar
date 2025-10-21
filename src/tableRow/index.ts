import { TableRow } from '../rowContent'
import { RowContent, RowHead } from '../types'
import { recursiveMakeTableRows } from './recursiveMakeTableRows'

export const makeTableRows = (
  rowContents: RowContent[],
  rowHeads: RowHead[],
  renderedHeadIds: RowHead['id'][],
): TableRow[] => {
  return rowContents.map((content) => {
    const row: TableRow = {
      tableHeads: [],
      tableContent: content,
    }
    rowHeads.forEach((head) => {
      recursiveMakeTableRows(content, head, renderedHeadIds, row)
    })
    return row
  })
}
