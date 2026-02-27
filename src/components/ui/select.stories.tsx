import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within, fn } from 'storybook/test'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'

// Wrapper to expose props to Storybook controls
const SelectDemo = ({
  variant,
  color,
  size,
  disabled,
  placeholder = 'Select an option',
  onValueChange,
}: {
  variant?: React.ComponentProps<typeof SelectTrigger>['variant']
  color?: React.ComponentProps<typeof SelectTrigger>['color']
  size?: React.ComponentProps<typeof SelectTrigger>['size']
  disabled?: boolean
  placeholder?: string
  onValueChange?: (value: string) => void
}) => (
  <Select onValueChange={onValueChange} disabled={disabled}>
    <SelectTrigger variant={variant} color={color} size={size} className="w-56">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectContent>
  </Select>
)

const meta: Meta<typeof SelectDemo> = {
  title: 'UI/Select',
  component: SelectDemo,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
      description: 'Structural shape of the trigger',
    },
    color: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Semantic validation state (does not control layout)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    onValueChange: { action: 'valueChange' },
  },
  args: {
    variant: 'outline',
    color: 'default',
    size: 'md',
    onValueChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof SelectDemo>
type PlayCtx = Parameters<NonNullable<Story['play']>>[0]

// ─── Visual ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async (context: PlayCtx) => {
    const trigger = within(context.canvasElement).getByRole('combobox')
    await expect(trigger).toBeInTheDocument()
    await expect(trigger).not.toBeDisabled()
  },
}

export const ValidationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SelectDemo color="default"  placeholder="Default"  />
      <SelectDemo color="error"    placeholder="Error"    />
      <SelectDemo color="success"  placeholder="Success"  />
      <SelectDemo color="warning"  placeholder="Warning"  />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SelectDemo variant="outline" placeholder="Outline" />
      <SelectDemo variant="filled"  placeholder="Filled"  />
      <SelectDemo variant="flushed" placeholder="Flushed" />
    </div>
  ),
}

export const FilledValidation: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SelectDemo variant="filled" color="default"  placeholder="Default"  />
      <SelectDemo variant="filled" color="error"    placeholder="Error"    />
      <SelectDemo variant="filled" color="success"  placeholder="Success"  />
      <SelectDemo variant="filled" color="warning"  placeholder="Warning"  />
    </div>
  ),
}

export const FlushedValidation: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SelectDemo variant="flushed" color="default"  placeholder="Default"  />
      <SelectDemo variant="flushed" color="error"    placeholder="Error"    />
      <SelectDemo variant="flushed" color="success"  placeholder="Success"  />
      <SelectDemo variant="flushed" color="warning"  placeholder="Warning"  />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SelectDemo size="sm" placeholder="Small"  />
      <SelectDemo size="md" placeholder="Medium" />
      <SelectDemo size="lg" placeholder="Large"  />
    </div>
  ),
}

// ─── Behavior ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async (context: PlayCtx) => {
    const trigger = within(context.canvasElement).getByRole('combobox')

    await expect(trigger).toBeDisabled()

    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(within(context.canvasElement).queryByRole('option')).not.toBeInTheDocument()
  },
}

export const SelectOption: Story = {
  play: async (context: PlayCtx) => {
    const trigger = within(context.canvasElement).getByRole('combobox')

    await userEvent.click(trigger)

    const listbox = await within(document.body).findByRole('listbox')
    const option = within(listbox).getByText('Banana')

    await userEvent.click(option)

    await expect(context.args.onValueChange).toHaveBeenCalledWith('banana')
    await expect(trigger).toHaveTextContent('Banana')
  },
}

export const KeyboardOpen: Story = {
  play: async (context: PlayCtx) => {
    const trigger = within(context.canvasElement).getByRole('combobox')

    trigger.focus()
    await expect(trigger).toHaveFocus()

    await userEvent.keyboard(' ')
    await within(document.body).findByRole('listbox')
  },
}

export const ErrorState: Story = {
  args: {
    color: 'error',
    placeholder: 'Select a value',
  },
  play: async (context: PlayCtx) => {
    const trigger = within(context.canvasElement).getByRole('combobox')
    await expect(trigger).toBeInTheDocument()
    await expect(trigger).not.toBeDisabled()
  },
}
