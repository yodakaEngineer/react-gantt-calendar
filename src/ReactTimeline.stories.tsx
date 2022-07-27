import { ComponentStory } from '@storybook/react'
import { ReactTimeline } from './ReactTimeline'
import './styles.scss'

export default {
  component: ReactTimeline,
  title: 'ReactTimeline',
}

const args = {
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
      label: 'Cleaning1',
      startAt: new Date('2020-01-01'),
      endAt: new Date('2020-01-02'),
    },
    {
      headIds: ['1', '1-1', '1-1-2'],
      label: 'Cleaning2',
      startAt: new Date('2020-01-01'),
      endAt: new Date('2020-01-02'),
    },
    {
      headIds: ['1', '1-2', '1-2-1'],
      label: 'Cleaning3',
      startAt: new Date('2020-01-01'),
      endAt: new Date('2020-01-02'),
    },
  ]
}

const Template: ComponentStory<typeof ReactTimeline> = () => <ReactTimeline {...args} />

export const Default = Template.bind({})
Default.args = {}
