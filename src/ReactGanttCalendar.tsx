// FIXME: I wanna allow user opt in.
import './styles.scss'
import dayjs, { ManipulateType } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import produce from 'immer'
import React, { useCallback, useState } from 'react'
import { useRowContents } from './hooks/useRowContents'

dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export type RowHead = {
  id: string | number
  label: string | React.ReactNode
  childRowHeads?: RowHead[]
  rowSpan?: number
}

type EventLabelCallbackProps = {
  width: number
}

export type Event = {
  label: string | React.FC<EventLabelCallbackProps>
  startAt: Date
  endAt: Date
}

export type RowContent = {
  headIds: RowHead['id'][]
  events: Event[]
}

type TableRow = {
  tableHeads: RowHead[]
  tableContent: RowContent
}

type Column = {
  label: string | React.ReactNode
}

type Props = {
  columns: Column[]
  rowHeads: RowHead[]
  rowContents: RowContent[]
  startDate?: Date
  displayRangeNumber?: number
  displayRangeUnit?: ManipulateType
  displayRangeUnitNumber?: number
  dateColumnFormat?: string
  tableDataWidth?: number
}

export const ReactGanttCalendar = (props: Props) => {
  const { makeRowContents } = useRowContents()
  const { columns } = props
  const displayRangeNumber = props.displayRangeNumber ?? 3
  const displayRangeUnitNumber = props.displayRangeUnitNumber ?? 1
  const displayRange = [...Array(displayRangeNumber)].map(
    (_, i) => i * displayRangeUnitNumber
  )
  const displayRangeUnit = props.displayRangeUnit ?? 'day'
  const dateColumnFormat = props.dateColumnFormat ?? 'MM/DD'
  const startDate = dayjs(props.startDate).startOf(displayRangeUnit)
  const endDate = startDate.add(
    displayRangeNumber * displayRangeUnitNumber,
    displayRangeUnit
  )
  const tableDataWidth = props.tableDataWidth ?? 60
  const rowContents = makeRowContents(
    props.rowContents,
    startDate,
    endDate,
    displayRangeUnit
  )
  const recursiveRowSpans = (head: RowHead) => {
    if (head.childRowHeads) {
      head.childRowHeads = head.childRowHeads.map(recursiveRowSpans)
    }
    head.rowSpan = rowContents.filter((content) =>
      content.headIds.includes(head.id)
    ).length
    return head
  }
  const recursiveAddPrefixToHeadId = (head: RowHead, parentHead?: RowHead) => {
    if (parentHead?.id) {
      head.id = `${parentHead.id}_${head.id}`
    }
    if (head.childRowHeads) {
      head.childRowHeads = head.childRowHeads.map((v) =>
        recursiveAddPrefixToHeadId(v, head)
      )
    }
    return head
  }
  const rowHeads = produce(props.rowHeads, (draft) => {
    draft.forEach((v) => recursiveAddPrefixToHeadId(v))
    draft.forEach(recursiveRowSpans)
  })
  const calcWidth = (event: Event) => {
    const start = startDate.isSameOrAfter(event.startAt, displayRangeUnit)
      ? startDate
      : event.startAt
    const end = endDate.isSameOrBefore(event.endAt, displayRangeUnit)
      ? endDate
      : event.endAt
    const diff = dayjs(end).diff(start, displayRangeUnit)
    return diff < 1 ? tableDataWidth : tableDataWidth * diff
  }

  const renderedHeadIds: RowHead['id'][] = []
  const recursiveMakeTableRows = (
    content: RowContent,
    head: RowHead,
    renderedHeadIds: RowHead['id'][],
    row: TableRow
  ) => {
    if (content.headIds.includes(head.id)) {
      if (!renderedHeadIds.includes(head.id)) {
        row.tableHeads.push(head)
        renderedHeadIds.push(head.id)
      }
      if (head.childRowHeads) {
        head.childRowHeads.forEach((childHead) => {
          recursiveMakeTableRows(content, childHead, renderedHeadIds, row)
        })
      }
    }
    return row
  }

  const tableRows: TableRow[] = rowContents.map((content) => {
    const row: TableRow = {
      tableHeads: [],
      tableContent: content,
    }
    rowHeads.forEach((head) => {
      recursiveMakeTableRows(content, head, renderedHeadIds, row)
    })
    return row
  })

  const [heightList, setHeightList] = useState<number[][]>(
    tableRows.map((row) => row.tableContent.events.map(() => 0))
  )

  const [eventStartPositions, setEventStartPositions] = useState<number[][]>(
    tableRows.map((row) => row.tableContent.events.map(() => 0))
  )
  const measureRef = useCallback(
    (
      node: HTMLTableDataCellElement | null,
      index: number,
      rangeIndex: number
    ) => {
      if (node != null) {
        setEventStartPositions((prev) => {
          return produce(prev, (draft) => {
            tableRows.forEach((row, rowIndex) => {
              if (rowIndex === index) {
                return row.tableContent.events.forEach((event, eventIndex) => {
                  let matchedRangeIndex = displayRange.findIndex((unit) => {
                    const current = startDate.add(unit, displayRangeUnit)
                    const next = current.add(1, displayRangeUnit)
                    return dayjs(event.startAt).isBetween(
                      current,
                      next,
                      displayRangeUnit,
                      '[)'
                    )
                  })
                  // if it doesn't match, its startAt is before startDate. So it should be 0
                  matchedRangeIndex =
                    matchedRangeIndex === -1 ? 0 : matchedRangeIndex
                  if (rangeIndex === matchedRangeIndex) {
                    draft[index][eventIndex] = node.offsetLeft
                  }
                })
              }
            })
          })
        })
      }
    },
    [tableRows, startDate, displayRangeUnit, displayRange]
  )
  const measureHeight = useCallback(
    (node: HTMLDivElement | null, rowIndex: number, eventIndex: number) => {
      if (node != null) {
        setHeightList((prev) => {
          return produce(prev, (draft) => {
            draft[rowIndex][eventIndex] = node.offsetHeight
          })
        })
      }
    },
    []
  )

  return (
    <table
      className={'RTL'}
      style={{
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'separate',
        borderSpacing: 0,
      }}
    >
      <thead className={'RTLThead'}>
        <tr className={'RTLTheadTr'}>
          {columns.map((column, index) => (
            <th
              className={'RTLTheadTr__th'}
              key={`RTLTheadTr__th_${index}`}
              style={{ width: tableDataWidth }}
            >
              {column.label}
            </th>
          ))}
          {displayRange.map((unit) => {
            const date = startDate.add(unit, displayRangeUnit)
            return (
              <td
                key={'RTLDR_' + unit}
                className={'RTLTheadTr__td'}
                style={{ width: tableDataWidth, boxSizing: 'border-box' }}
              >
                {date.format(dateColumnFormat)}
              </td>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {tableRows.map((row, index) => (
          <tr
            key={'RTLTR_' + index}
            style={{
              position: 'relative',
              height: heightList[index].reduce((a, b) => a + b, 0),
            }}
          >
            {row.tableHeads.map((head) => {
              return (
                <th
                  key={'RTLTH_' + head.id}
                  rowSpan={head.rowSpan}
                  className={'RTLTbodyTr__th'}
                >
                  {head.label}
                </th>
              )
            })}
            {displayRange.map((unit, displayRangeIndex) => (
              <td
                key={'RTLDR_' + unit}
                className={'RTLTbodyTr__td'}
                ref={(ref) => measureRef(ref, index, displayRangeIndex)}
              />
            ))}
            <td
              style={{
                width: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
              }}
            >
              {row.tableContent.events.map((event, eventIndex) => (
                <div
                  ref={(ref) => measureHeight(ref, index, eventIndex)}
                  key={`RTLevent_${eventIndex}`}
                  className={
                    typeof event.label === 'string' ? 'RTLevent' : undefined
                  }
                  style={{
                    boxSizing: 'border-box',
                    marginLeft:
                      eventStartPositions.length !== 0
                        ? eventStartPositions[index][eventIndex]
                        : 0,
                    width: calcWidth(event),
                  }}
                >
                  {typeof event.label === 'string'
                    ? event.label
                    : event.label({ width: calcWidth(event) })}
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
