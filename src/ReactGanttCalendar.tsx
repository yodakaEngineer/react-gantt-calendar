// FIXME: I wanna allow user opt in.
import './styles.scss'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import React, { useCallback, useState } from 'react'
import { useEvent } from './hooks/useEvent'
import { TableRow, useRowContents } from './hooks/useRowContents'
import { useRowHeads } from './hooks/useRowHeads'
import { useTableRows } from './hooks/useTableRows'
import { Props, RowHead } from './types'

dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

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

  const [tHeadHeightList, setTHeadHeightList] = useState<number[]>([])
  const measureTHeadHeight = useCallback(
    (node: HTMLDivElement | null, rowIndex: number) => {
      if (node != null) {
        setTHeadHeightList((prev) => {
          if (prev[rowIndex] !== node.offsetHeight) {
            prev[rowIndex] = node.offsetHeight
            return [...prev]
          }
          return prev
        })
      }
    },
    []
  )

  const calcHeight = useCallback(
    (index: number) => {
      const height = heightList[index]!.reduce((a, b) => a + b, 0)
      const isAutoCalcHeight = height === 0 || tHeadHeightList[index]! > height
      return isAutoCalcHeight ? undefined : height
    },
    [heightList, tHeadHeightList]
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
    <div className={'RTL'}>
      <div
        className={'RTLTheadTr'}
        style={{
          width: 'fit-content',
          display: 'flex',
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}
      >
        {columns.map((column, index) => (
          <div
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
          </div>
        ))}
        {displayRange.map((unit) => {
          const date = startDate.add(unit, displayRangeUnit)
          return (
            <div
              key={'RTLDR_' + unit}
              className={'RTLTheadTr__td'}
              style={{
                width: tableDataWidth,
                boxSizing: 'border-box',
              }}
            >
              {date.format(dateColumnFormat)}
            </div>
          )
        })}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${
            displayRangeNumber + columns.length
          }, 1fr)`,
          gridTemplateRows: `repeat(${
            tableRows.length
          }, fit-content: ${Math.max(
            ...heightList.map((v) => v.reduce((a, b) => a + b, 0))
          )})`,
          position: 'relative',
          width: 'fit-content',
        }}
      >
        {tableRows.map((row, index) => (
          <React.Fragment key={'RTLTR_' + index}>
            {row.tableHeads.map((head, headIndex) => {
              return (
                <div
                  ref={(node) =>
                    row.tableHeads.length - 1 === headIndex &&
                    measureTHeadHeight(node, index)
                  }
                  key={'RTLTH_' + head.id}
                  className={'RTLTbodyTr__th'}
                  style={{
                    position: 'sticky',
                    zIndex: 1,
                    left: tableDataWidth * head.leftIndex,
                    gridRow: 'span ' + head.rowSpan,
                    width: tableDataWidth,
                  }}
                >
                  {head.label}
                </div>
              )
            })}
            {displayRange.map((unit) => (
              <div
                key={'RTLDR_' + unit}
                className={'RTLTbodyTr__td'}
                style={{
                  width: tableDataWidth,
                  height: calcHeight(index),
                }}
              />
            ))}
            {row.tableContent.events.map((event, eventIndex) => (
              <div
                ref={(ref) => measureHeight(ref, index, eventIndex)}
                key={`RTLevent_${eventIndex}`}
                className={
                  typeof event.label === 'string' ? 'RTLevent' : undefined
                }
                style={{
                  width: calcWidth(event) * tableDataWidth,
                  position: 'absolute',
                  top: heightList[index]!.slice(0, eventIndex).reduce(
                    (a, b) => a + b,
                    0
                  ),
                  gridColumn: `${
                    eventStartPositions[index]![eventIndex]! +
                    columns.length +
                    1
                  } / ${
                    eventStartPositions[index]![eventIndex]! +
                    columns.length +
                    2
                  }`,
                  gridRow: `${index + 1} / ${index + 2}`,
                }}
              >
                {typeof event.label === 'string'
                  ? event.label
                  : event.label({
                      width: calcWidth(event) * tableDataWidth,
                    })}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
