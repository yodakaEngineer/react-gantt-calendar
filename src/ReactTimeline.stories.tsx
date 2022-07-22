import { ComponentStory } from '@storybook/react'
import { ReactTimeline } from './ReactTimeline'
import './styles.scss'

export default {
  component: ReactTimeline,
  title: 'ReactTimeline',
}

const Template: ComponentStory<typeof ReactTimeline> = () => <ReactTimeline />

export const Default = Template.bind({})
Default.args = {}
