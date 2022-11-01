// FIXME: I wanna allow user opt in.
import './styles.scss'
import dayjs, { ManipulateType } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
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
  leftIndex: number
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

  const [heightList, setHeightList] = useState<number[][]>(
    tableRows.map(() => [])
  )
  const measureHeight = useCallback(
    (node: HTMLDivElement | null, rowIndex: number, eventIndex: number) => {
      if (node != null) {
        setHeightList((prev) => {
          if (
            prev[rowIndex] != null &&
            prev[rowIndex]![eventIndex] !== node.offsetHeight
          ) {
            prev[rowIndex]![eventIndex] = node.offsetHeight
            return [...prev]
          }
          return prev
        })
      }
    },
    []
  )

  const eventStartPositions = tableRows.map((row) => {
    return row.tableContent.events.map((event) => {
      let matchedRangeIndex = displayRange.find((unit) => {
        const current = startDate.add(unit, displayRangeUnit)
        const next = current.add(1, displayRangeUnit)
        return dayjs(event.startAt).isBetween(
          current,
          next,
          displayRangeUnit,
          '[)'
        )
      })
      return matchedRangeIndex == null ? 0 : matchedRangeIndex
    })
  })

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
              style={{
                position: 'sticky',
                zIndex: 2,
                top: 0,
                width: tableDataWidth,
                left: index * tableDataWidth,
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
            {row.tableHeads.map((head) => {
              return (
                <th
                  key={'RTLTH_' + head.id}
                  rowSpan={head.rowSpan}
                  className={'RTLTbodyTr__th'}
                  style={{
                    position: 'sticky',
                    zIndex: 1,
                    left: tableDataWidth * head.leftIndex,
                  }}
                >
                  {head.label}
                </th>
              )
            })}
            {displayRange.map((unit) => (
              <td key={'RTLDR_' + unit} className={'RTLTbodyTr__td'} />
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
                      tableDataWidth * columns.length +
                      eventStartPositions[index]![eventIndex]! * tableDataWidth,
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
