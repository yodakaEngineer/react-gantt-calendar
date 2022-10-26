// FIXME: I wanna allow user opt in.
import './styles.scss'
import dayjs, { ManipulateType } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import produce from 'immer'
import React, { useCallback, useState } from 'react'
import { useEvent } from './hooks/useEvent'
import { useRowContents } from './hooks/useRowContents'
import { useRowHeads } from './hooks/useRowHeads'
import { useTableRows } from './hooks/useTableRows'

dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export type RowHead = {
  id: string | number
  label: string | React.ReactNode
  childRowHeads?: RowHead[]
  rowSpan?: number
}

export type EventLabelCallbackProps = {
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

export type TableRow = {
  tableHeads: RowHead[]
  tableContent: RowContent
}

export type Column = {
  label: string | React.ReactNode
}

export type Props = {
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
  const { makeRowHeads } = useRowHeads()
  const { makeTableRows } = useTableRows()
  const { calcEventWidth } = useEvent()
  const { columns } = props
  const displayRangeNumber = props.displayRangeNumber ?? 30
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
  const rowContents = makeRowContents(props.rowContents, startDate, endDate)
  const rowHeads = makeRowHeads(props.rowHeads, rowContents)
  const calcWidth = calcEventWidth(startDate, endDate, displayRangeUnit)

  const renderedHeadIds: RowHead['id'][] = []
  const tableRows: TableRow[] = makeTableRows(
    rowContents,
    rowHeads,
    renderedHeadIds
  )

  const [tableHeadLeftPositions, setTableHeadLeftPositions] = useState<
    number[][]
  >(tableRows.map(() => []))
  const measureLeft = useCallback(
    (
      node: HTMLTableHeaderCellElement | null,
      rowIndex: number,
      headIndex: number
    ) => {
      if (node != null) {
        setTableHeadLeftPositions((prev) => {
          if (prev[rowIndex][headIndex] == null) {
            prev[rowIndex][headIndex] = node.offsetLeft
          }
          return prev
        })
      }
    },
    []
  )

  const [headLeftPositions, setHeadLeftPositions] = useState<number[]>([])
  const measureHeadLeft = useCallback(
    (node: HTMLTableHeaderCellElement | null, index: number) => {
      if (node != null) {
        setHeadLeftPositions((prev) => {
          if (prev[index] == null) {
            prev[index] = node.offsetLeft
          }
          return prev
        })
      }
    },
    []
  )

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
    [setHeightList]
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
        <tr
          className={'RTLTheadTr'}
          style={{
            position: 'relative',
          }}
        >
          {columns.map((column, index) => (
            <th
              className={'RTLTheadTr__th'}
              key={`RTLTheadTr__th_${index}`}
              ref={(ref) => measureHeadLeft(ref, index)}
              style={{
                position: 'sticky',
                zIndex: 2,
                top: 0,
                width: tableDataWidth,
                left: headLeftPositions[index],
              }}
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
                style={{
                  width: tableDataWidth,
                  boxSizing: 'border-box',
                  zIndex: 1,
                  top: 0,
                  position: 'sticky',
                }}
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
              height: heightList[index]?.reduce((a, b) => a + b, 0),
            }}
          >
            {row.tableHeads.map((head, headIndex) => {
              return (
                <th
                  key={'RTLTH_' + head.id}
                  rowSpan={head.rowSpan}
                  className={'RTLTbodyTr__th'}
                  ref={(ref) => measureLeft(ref, index, headIndex)}
                  style={{
                    position: 'sticky',
                    zIndex: 1,
                    left: tableHeadLeftPositions[index][headIndex],
                  }}
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
                    marginLeft:
                      eventStartPositions.length !== 0
                        ? eventStartPositions[index][eventIndex]
                        : 0,
                    width: calcWidth(event) * tableDataWidth,
                  }}
                >
                  {typeof event.label === 'string'
                    ? event.label
                    : event.label({
                        width: calcWidth(event) * tableDataWidth,
                      })}
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
