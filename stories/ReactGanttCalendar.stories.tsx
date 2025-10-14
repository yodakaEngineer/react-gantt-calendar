import React from 'react'
import { ComponentStory } from '@storybook/react'
import { ReactGanttCalendar } from '../src/ReactGanttCalendar'
import '../src/styles.scss'
import dayjs from 'dayjs'

export default {
  component: ReactGanttCalendar,
  title: 'ReactGanttCalendar',
}

const startAt = dayjs().startOf('day').subtract(-30, 'minute').toDate()
const endAt = dayjs().startOf('day').subtract(-60, 'minute').toDate()

const args = {
  options: {
    displayRange: {
      range: 30,
      unit: 'minute' as const,
      unitNumber: 30,
      format: 'HH:mm',
    },
    startDate: dayjs().startOf('day').toDate(),
  },
  // day
  // options: {
  //   displayRange: {
  //     range: 30,
  //     unit: 'day' as const,
  //     unitNumber: 1,
  //     format: 'MM/DD',
  //   },
  //   startDate: dayjs().startOf('day').toDate(),
  // },
  data: {
    columns: [
      {
        label: () => (
          <button
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            Hotel1
          </button>
        ),
      },
      {
        label: 'Floor',
      },
      {
        label: 'Room',
      },
    ],
    rows: {
      heads: [
        {
          id: '1',
          label: 'Hotel1',
          childRowHeads: [
            {
              id: '1',
              label: '1F',
              childRowHeads: [
                {
                  id: '1',
                  label: () => (
                    <button
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      101
                    </button>
                  ),
                },
                {
                  id: '2',
                  label: '102',
                },
              ],
            },
            {
              id: '2',
              label: '2F',
              childRowHeads: [
                {
                  id: '3',
                  label: '201',
                },
                {
                  id: '4',
                  label: '202',
                },
              ],
            },
          ],
        },
        {
          id: '2',
          label:
            'HotelあおいうえおHotelあおいうえおHotelあおいうえおHotelあおいうえおHotelあおいうえお',
          childRowHeads: [
            {
              id: '3',
              label: '1F',
              childRowHeads: [
                {
                  id: '5',
                  label: '101',
                },
                {
                  id: '6',
                  label: '102',
                },
              ],
            },
          ],
        },
      ],
      contents: [
        {
          headIds: ['1', '1', '1'],
          events: [
            {
              label: 'Before',
              startAt: dayjs().subtract(2, 'day').toDate(),
              endAt: dayjs().toDate(),
            },
          ],
        },
        {
          headIds: ['1', '1', '2'],
          events: [
            {
              label: 'Between',
              startAt: dayjs().subtract(3, 'day').toDate(),
              // If we update storybook 7.0, then we can use add. https://github.com/storybookjs/storybook/issues/12208
              endAt: dayjs().subtract(-35, 'day').toDate(),
            },
            {
              label: ({ width }: { width: number }) => (
                <button style={{ width, textAlign: 'left' }}>Flexible</button>
              ),
              startAt,
              endAt,
            },
          ],
        },
        {
          headIds: ['1', '2', '3'],
          events: [
            {
              label: 'hoge',
              startAt: dayjs()
                .subtract(-3, 'day')
                .subtract(-3, 'hour')
                .toDate(),
              endAt: dayjs().subtract(-8, 'day').toDate(),
            },
          ],
        },
        {
          headIds: ['2', '3', '5'],
          events: [
            {
              label: 'hoge',
              startAt: dayjs()
                .subtract(-3, 'day')
                .subtract(-3, 'hour')
                .toDate(),
              endAt: dayjs().subtract(-8, 'day').toDate(),
            },
          ],
        },
        {
          headIds: ['2', '3', '6'],
          events: [
            {
              label: 'hoge',
              startAt: dayjs()
                .subtract(-3, 'day')
                .subtract(-3, 'hour')
                .toDate(),
              endAt: dayjs().subtract(-8, 'day').toDate(),
            },
          ],
        },
      ],
    },
  },
}

const Template: ComponentStory<typeof ReactGanttCalendar> = (args) => (
  <div style={{ overflow: 'auto', width: '500px', height: '150px' }}>
    <ReactGanttCalendar {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = args
