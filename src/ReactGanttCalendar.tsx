// FIXME: I wanna allow user opt in.
import './styles.scss'
import React, {createRef, RefObject, useCallback, useEffect, useRef, useState} from 'react'
import dayjs, {ManipulateType} from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import produce from 'immer'

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
  tableDataWidth?: number
}

export const ReactGanttCalendar = (props: Props) => {
  const { columns } = props
  const displayRangeNumber = props.displayRangeNumber ?? 31
  const displayRangeUnitNumber = props.displayRangeUnitNumber ?? 1
  const displayRange = [...Array(displayRangeNumber)].map((_, i) => i * displayRangeUnitNumber)
  const displayRangeUnit = props.displayRangeUnit ?? 'day'
  const dateColumnFormat = props.dateColumnFormat ?? 'MM/DD'
  const startDate = dayjs(props.startDate).startOf(displayRangeUnit)
  const endDate = startDate.add(displayRangeNumber * displayRangeUnitNumber, displayRangeUnit)
  const tableDataWidth = props.tableDataWidth ?? 60
  const rowContents = produce(props.rowContents, (draft) => {
    draft.forEach(content => {
      content.events = content.events
        .filter(event => dayjs(event.startAt).isBetween(startDate, endDate, displayRangeUnit, '[)'))
        .sort((prevEvent, currentEvent) => dayjs(prevEvent.startAt).diff(currentEvent.startAt))
      const headIds: RowHead['id'][] = []
      content.headIds.forEach((v, i) => {
        headIds.push(i !== 0 ? `${headIds[i-1]}_${v}` : v)
      })
      content.headIds = headIds
    })
  })

  const recursiveRowSpans = (head: RowHead) => {
    if (head.childRowHeads) {
      head.childRowHeads = head.childRowHeads.map(recursiveRowSpans)
    }
    head.rowSpan = rowContents
      .filter(content => content.headIds.includes(head.id))
      .length
    return head
  }
  const recursiveAddPrefixToHeadId = (head: RowHead, parentHead?: RowHead) => {
    if (parentHead?.id) {
      head.id = `${parentHead.id}_${head.id}`
    }
    if (head.childRowHeads) {
      head.childRowHeads = head.childRowHeads.map(v => recursiveAddPrefixToHeadId(v, head))
    }
    return head
  }
  const rowHeads = produce(props.rowHeads, (draft) => {
    draft.forEach(v => recursiveAddPrefixToHeadId(v))
    draft.forEach(recursiveRowSpans)
  })

  const renderedHeadIds: RowHead['id'][] = []
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

  const tableRows: TableRow[] = rowContents.map(content => {
    const row: TableRow = {
      tableHeads: [],
      tableContent: content,
    }
    rowHeads.forEach(head => { recursiveMakeTableRows(content, head, renderedHeadIds, row) })
    return row
  })

  const heightRefs = useRef<RefObject<HTMLDivElement>[][]>(tableRows.map(row => {
    return row.tableContent.events.map(() => createRef<HTMLDivElement>())
  }))
  const [heightList, setHeightList] = useState<number[]>([])

  const [eventStartPositions, setEventStartPositions] = useState<number[][]>(tableRows.map(row => row.tableContent.events.map(() => 0)))
  const measureRef = useCallback(
    (node: HTMLTableDataCellElement | null, index: number, rangeIndex: number) => {
      if (node != null) {
        setEventStartPositions(prev => {
          return produce(prev, (draft) => {
            tableRows.forEach((row, rowIndex) => {
              if (rowIndex === index) {
                return row.tableContent.events.forEach((event, eventIndex) => {
                  const matchedRangeIndex = displayRange.findIndex(unit => {
                    const current = startDate.add(unit, displayRangeUnit)
                    const next = current.add(1, displayRangeUnit)
                    return dayjs(event.startAt).isBetween(current, next, displayRangeUnit, '[)')
                  })
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
    []
  )

  // FIXME: Avoid to use useEffect.
  useEffect(() => {
    setHeightList(heightRefs.current.map(row => {
      return row
        .map(v => v.current?.clientHeight ?? 0)
        .reduce((prev, current) => prev + current, 0)
    }))
  },[props, heightRefs])

  return (
    <table className={'RTL'} style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', overflow: 'hidden' }}>
      <thead className={'RTLThead'}>
      <tr className={'RTLTheadTr'}>
        {columns.map((column, index) => (<th className={'RTLTheadTr__th'} key={`RTLTheadTr__th_${index}`} style={{ width: tableDataWidth }}>{column.label}</th>))}
        {displayRange.map(unit => {
          const date = startDate.add(unit, displayRangeUnit)
          return (
            <td key={'RTLDR_' + unit} className={'RTLTheadTr__td'} style={{ width: tableDataWidth, boxSizing: 'border-box', }}>
              {date.format(dateColumnFormat)}
            </td>
          )
        })}
      </tr>
      </thead>
      <tbody>
      {
        tableRows.map((row, index) => (
          <tr key={'RTLTR_' + index} style={{ position: 'relative', height: heightList.length && heightList[index] }}>
            {row.tableHeads.map((head) => {
              return (
                <th key={'RTLTH_' + head.id}
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
                ref={ref => measureRef(ref, index, displayRangeIndex)}
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
              {
                row.tableContent.events.map((event, eventIndex) => (
                  <div
                    ref={heightRefs.current[index][eventIndex]}
                    key={`RTLevent_${eventIndex}`}
                    className={typeof event.label === 'string' ? 'RTLevent' : undefined}
                    style={{
                      boxSizing: 'border-box',
                      marginLeft: eventStartPositions.length !== 0 ? eventStartPositions[index][eventIndex] : 0,
                      width: tableDataWidth * dayjs(event.endAt).diff(event.startAt, displayRangeUnit),
                    }}
                  >
                    {event.label}
                  </div>
                ))
              }
            </td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
