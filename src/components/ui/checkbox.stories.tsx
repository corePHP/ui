import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within, fn } from 'storybook/test'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning'],
      description: 'Semantic intent shown when checked',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
    onCheckedChange: { action: 'checkedChange' },
  },
  args: {
    color: 'primary',
    size: 'md',
    onCheckedChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>
type PlayCtx = Parameters<NonNullable<Story['play']>>[0]

// ─── Visual ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async (context: PlayCtx) => {
    const checkbox = within(context.canvasElement).getByRole('checkbox')
    await expect(checkbox).toBeInTheDocument()
    await expect(checkbox).not.toBeDisabled()
    await expect(checkbox).not.toBeChecked()
  },
}

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox color="primary"   defaultChecked />
      <Checkbox color="secondary" defaultChecked />
      <Checkbox color="danger"    defaultChecked />
      <Checkbox color="success"   defaultChecked />
      <Checkbox color="warning"   defaultChecked />
    </div>
  ),
}

export const AllColorsUnchecked: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox color="primary"   />
      <Checkbox color="secondary" />
      <Checkbox color="danger"    />
      <Checkbox color="success"   />
      <Checkbox color="warning"   />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox size="sm" defaultChecked />
      <Checkbox size="md" defaultChecked />
      <Checkbox size="lg" defaultChecked />
    </div>
  ),
}

// ─── Behavior ─────────────────────────────────────────────────────────────────

export const Toggle: Story = {
  play: async (context: PlayCtx) => {
    const checkbox = within(context.canvasElement).getByRole('checkbox')

    await expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(context.args.onCheckedChange).toHaveBeenCalledWith(true)

    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
    await expect(context.args.onCheckedChange).toHaveBeenCalledWith(false)
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async (context: PlayCtx) => {
    const checkbox = within(context.canvasElement).getByRole('checkbox')

    await expect(checkbox).toBeDisabled()

    await userEvent.click(checkbox, { pointerEventsCheck: 0 })
    await expect(checkbox).not.toBeChecked()
    await expect(context.args.onCheckedChange).not.toHaveBeenCalled()
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
  play: async (context: PlayCtx) => {
    const checkbox = within(context.canvasElement).getByRole('checkbox')

    await expect(checkbox).toBeDisabled()
    await expect(checkbox).toBeChecked()
  },
}

export const KeyboardActivation: Story = {
  play: async (context: PlayCtx) => {
    const checkbox = within(context.canvasElement).getByRole('checkbox')

    checkbox.focus()
    await expect(checkbox).toHaveFocus()

    await userEvent.keyboard(' ')
    await expect(checkbox).toBeChecked()
    await expect(context.args.onCheckedChange).toHaveBeenCalledWith(true)
  },
}
