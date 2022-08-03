// FIXME: I wanna allow user opt in.
import './styles.scss'
import React, {createRef, RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import dayjs, {ManipulateType} from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

type RowHead = {
  id: string | number
  label: string | React.ReactNode
  childRowHeads?: RowHead[]
  rowSpan?: number
}

type Event = {
  label: string | React.ReactNode
  startAt: Date
  endAt: Date
}

type RowContent = {
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
}

export const ReactGanttCalendar = (props: Props) => {
  const { columns } = props
  const startDate = dayjs(props.startDate)
  const displayRangeNumber = props.displayRangeNumber ?? 31
  const displayRangeUnitNumber = props.displayRangeUnitNumber ?? 1
  const displayRange = [...Array(displayRangeNumber)].map((_, i) => i * displayRangeUnitNumber)
  const displayRangeUnit = props.displayRangeUnit ?? 'day'
  const dateColumnFormat = props.dateColumnFormat ?? 'MM/DD'
  const endDate = startDate.add(displayRangeNumber * displayRangeUnitNumber, displayRangeUnit)
  const rowContents = props.rowContents.map(content => {
    content.events = content.events.filter(event => dayjs(event.startAt).isBetween(startDate, endDate, displayRangeUnit, '[]'))
    return content
  })

  const thTargetRef = useRef(null)
  const [lastHeadLeft, setLastHeadLeft] = useState(0)
  const rowHeads = useMemo(() => {
    const recursiveRowSpans = (head: RowHead) => {
      if (head.childRowHeads) {
        head.childRowHeads = head.childRowHeads.map(recursiveRowSpans)
      }
      head.rowSpan = rowContents
        .filter(content => content.headIds.includes(head.id))
        .length
      return head
    }
    return props.rowHeads.map(recursiveRowSpans)
  }, [props.rowHeads, rowContents])

  const renderedHeadIds: RowHead['id'][] = []
  const tableRows: TableRow[] = useMemo(() => {
    const recursiveMakeTableRows = (content: RowContent, head: RowHead, renderedHeadIds: RowHead['id'][], row: TableRow) => {
      if (content.headIds.includes(head.id)) {
        if (!renderedHeadIds.includes(head.id)) {
          row.tableHeads.push(head)
          renderedHeadIds.push(head.id)
        }
        if (head.childRowHeads) {
          head.childRowHeads.forEach(childHead => { recursiveMakeTableRows(content, childHead, renderedHeadIds, row) })
        }
      }
      return row
    }
    return rowContents.map(content => {
      const row: TableRow = {
        tableHeads: [],
        tableContent: content,
      }
      rowHeads.forEach(head => { recursiveMakeTableRows(content, head, renderedHeadIds, row) })
      return row
    })
  }, [rowContents, rowHeads, renderedHeadIds])

  const dateRefs = useRef<RefObject<HTMLTableDataCellElement>[][]>(rowContents.map(v => {
    return v.events.map(() => createRef<HTMLTableDataCellElement>())
  }))
  const calculateTableDataLeftPosition = useCallback(
    ({ index, eventIndex }: { index: number, eventIndex: number }) => {
      const startPosition = dateRefs.current[index][eventIndex]?.current?.offsetLeft ?? 0
      return lastHeadLeft + startPosition
    },
    [dateRefs, lastHeadLeft]
  )
  const isScheduleStartPosition = useCallback(
    (index: number, unit: number, content: RowContent) => {
      const current = startDate.add(unit, displayRangeUnit)
      const next = current.add(unit, displayRangeUnit)
      const refIndex = content.events.findIndex(event => dayjs(event.startAt).isBetween(current, next, displayRangeUnit, '[)'))
      return refIndex === -1 ? undefined : dateRefs.current[index][refIndex]
    },
    [startDate, displayRangeUnit, dateRefs]
  )

  useEffect(() => {
    if (thTargetRef.current == null) return
    const target: HTMLElement = thTargetRef.current
    const targetLeftPosition = target.offsetLeft ?? 0
    const targetWidth = target.getBoundingClientRect().width ?? 0
    setLastHeadLeft(targetLeftPosition + targetWidth)
  }, [setLastHeadLeft, thTargetRef])

  return (
    <table className={'RTL'}>
      <thead className={'RTLThead'}>
      <tr className={'RTLTheadTr'}>
        {columns.map((column, index) => (<th className={'RTLTheadTr__th'} key={`RTLTheadTr__th_${index}`}>{column.label}</th>))}
        {displayRange.map(unit => {
          const date = startDate.add(unit, displayRangeUnit)
          return (
            <td key={'RTLDR_' + unit} className={'RTLTheadTr__td'}>
              {date.format(dateColumnFormat)}
            </td>
          )
        })}
      </tr>
      </thead>
      <tbody>
      {
        tableRows.map((row, index) => (
          <tr key={'RTLTR_' + index} className={'RTLTBodyTrTd'}>
            {row.tableHeads.map((head, headIndex, heads) => {
              return (
                <th key={'RTLTH_' + head.id}
                    rowSpan={head.rowSpan}
                    className={'RTLTbodyTr__th'}
                    ref={headIndex === heads.length - 1 ? thTargetRef : undefined}
                >
                  {head.label}
                </th>
              )
            })}
            {displayRange.map((unit) => (
              <td
                key={'RTLDR_' + unit}
                className={'RTLTbodyTr__td'}
                ref={isScheduleStartPosition(index, unit, row.tableContent)}
              />
            ))}
            {
              row.tableContent.events.map((event, eventIndex) => (
                <td
                  key={`RTLevent_${eventIndex}`}
                  className={'RTLevent'}
                  style={{ left: calculateTableDataLeftPosition({ index, eventIndex }) }}
                >
                  {event.label}
                </td>
              ))
            }
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
