import { ComponentStory } from '@storybook/react'
import { ReactGanttCalendar } from '../src/ReactGanttCalendar'
import '../src/styles.scss'
import dayjs from 'dayjs'

export default {
  component: ReactGanttCalendar,
  title: 'ReactGanttCalendar',
}

const args = {
  startDate: dayjs().subtract(1, 'day').toDate(),
  columns: [
    {
      label: 'Hotel',
    },
    {
      label: 'Floor',
    },
    {
      label: 'Room',
    },
  ],
  rowHeads: [
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
              label: '101',
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
      label: 'Hotel2',
    },
  ],
  rowContents: [
    {
      headIds: ['1', '1', '1'],
      events: [
        {
          label: 'Cleaning1',
          startAt: new Date('2022-09-25T16:00:00'),
          endAt: new Date('2022-09-27T00:00:00'),
        },
      ],
    },
    {
      headIds: ['1', '1', '2'],
      events: [
        {
          label: 'Cleaning2',
          startAt: new Date('2022-09-25T23:00:00'),
          endAt: new Date('2022-09-28T00:00:00'),
        },
        {
          label: ({ width }: { width: number }) => (
            <button style={{ width, textAlign: 'left' }}>Cleaning4</button>
          ),
          startAt: new Date('2022-09-25T20:00:00'),
          endAt: new Date('2022-09-27T00:00:00'),
        },
      ],
    },
    {
      headIds: ['1', '2', '3'],
      events: [
        {
          label: 'Cleaning3',
          startAt: new Date('2022-09-28T16:00:00'),
          endAt: new Date('2022-09-29T16:00:00'),
        },
      ],
    },
  ],
}

const Template: ComponentStory<typeof ReactGanttCalendar> = (args) => (
  <ReactGanttCalendar {...args} />
)

export const Default = Template.bind({})
Default.args = args
