// FIXME: I wanna allow user opt in.
import './styles.scss'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import dayjs from 'dayjs'

type RowHead = {
  id: string | number
  label: string | React.ReactNode
  onClick?: (row: RowHead) => void
  childRowHeads?: RowHead[]
  rowSpan?: number
}

type RowContent = {
  headIds: RowHead['id'][]
  label: string | React.ReactNode
  startAt: Date
  endAt: Date
}

type TableRow = {
  tableHeads: RowHead[]
  tableData: RowContent
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
  displayRangeUnit?: 'day' | 'week' | 'month' | 'year'
  dateColumnFormat?: string
}

export const ReactTimeline = (props: Props) => {
  const { rowContents, columns } = props
  const startDate = dayjs(props.startDate)
  const displayRangeNumber = props.displayRangeNumber ?? 31
  const displayRange = [...Array(displayRangeNumber)].map((_, i) => i)
  const displayRangeUnit = props.displayRangeUnit ?? 'day'
  const dateColumnFormat = props.dateColumnFormat ?? 'MM/DD'

  const targetRef = useRef(null)
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
        tableData: content,
      }
      rowHeads.forEach(head => { recursiveMakeTableRows(content, head, renderedHeadIds, row) })
      return row
    })
  }, [rowContents, rowHeads, renderedHeadIds])

  useEffect(() => {
    if (targetRef.current == null) return
    const target: HTMLElement = targetRef.current
    const targetLeftPosition = target.offsetLeft ?? 0
    const targetWidth = target.offsetWidth ?? 0
    setLastHeadLeft(targetLeftPosition + targetWidth)
  }, [setLastHeadLeft, targetRef])

  return (
    <table className={'RTL'}>
      <thead className={'RTLThead'}>
      <tr className={'RTLTheadTr'}>
        {columns.map(column => (<th className={'RTLTheadTr__th'}>{column.label}</th>))}
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
                    ref={headIndex === heads.length - 1 ? targetRef : undefined}
                >
                  {head.label}
                </th>
              )
            })}
            {displayRange.map(unit => <td key={'RTLDR_' + unit} className={'RTLTbodyTr__td'} />)}
            <div className={'RTLcontent'} style={{ left: lastHeadLeft }}>{row.tableData.label}</div>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
