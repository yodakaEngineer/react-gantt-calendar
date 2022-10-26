import { ComponentStory } from '@storybook/react'
import { ReactGanttCalendar } from '../src/ReactGanttCalendar'
import '../src/styles.scss'
import dayjs from 'dayjs'

export default {
  component: ReactGanttCalendar,
  title: 'ReactGanttCalendar',
}

const args = {
  startDate: dayjs().startOf('day').toDate(),
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
            <button style={{ width, textAlign: 'left' }}>A day</button>
          ),
          startAt: dayjs().subtract(-3, 'hour').toDate(),
          endAt: dayjs().subtract(-8, 'hour').toDate(),
        },
      ],
    },
    {
      headIds: ['1', '2', '3'],
      events: [
        {
          label: 'hoge',
          startAt: dayjs().subtract(-3, 'day').subtract(-3, 'hour').toDate(),
          endAt: dayjs().subtract(-8, 'day').toDate(),
        },
      ],
    },
  ],
}

const Template: ComponentStory<typeof ReactGanttCalendar> = (args) => (
  <div style={{ overflow: 'auto', width: '500px', height: '150px' }}>
    <ReactGanttCalendar {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = args
