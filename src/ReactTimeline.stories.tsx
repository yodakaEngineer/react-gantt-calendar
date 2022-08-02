import { ComponentStory } from '@storybook/react'
import { ReactTimeline } from './ReactTimeline'
import './styles.scss'

export default {
  component: ReactTimeline,
  title: 'ReactTimeline',
}

const args = {
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
          id: '1-1',
          label: '1F',
          childRowHeads: [
            {
              id: '1-1-1',
              label: '101',
            },
            {
              id: '1-1-2',
              label: '102',
            }
          ]
        },
        {
          id: '1-2',
          label: '2F',
          childRowHeads: [
            {
              id: '1-2-1',
              label: '201',
            },
            {
              id: '1-2-2',
              label: '202',
            }
          ]
        },
      ]
    },
    {
      id: '2',
      label: 'Hotel2',
    }
  ],
  rowContents: [
    {
      headIds: ['1', '1-1', '1-1-1'],
      events: [
        {
          label: 'Cleaning1',
          startAt: new Date('2022-08-01'),
          endAt: new Date('2022-08-02'),
        },
      ]
    },
    {
      headIds: ['1', '1-1', '1-1-2'],
      events: [
        {
          label: 'Cleaning2',
          startAt: new Date('2022-08-16'),
          endAt: new Date('2022-08-18'),
        },
        {
          label: 'Cleaning4',
          startAt: new Date('2022-08-07'),
          endAt: new Date('2022-08-08'),
        }
      ]
    },
    {
      headIds: ['1', '1-2', '1-2-1'],
      events: [
        {
          label: 'Cleaning3',
          startAt: new Date('2022-08-01'),
          endAt: new Date('2022-08-02'),
        }
      ]
    },
  ]
}

const Template: ComponentStory<typeof ReactTimeline> = () => <ReactTimeline {...args} />

export const Default = Template.bind({})
Default.args = {}
