import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
      description: 'Structural shape of the input',
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
    placeholder: {
      control: 'text',
    },
  },
  args: {
    variant: 'outline',
    color: 'default',
    size: 'md',
    placeholder: 'Type something…',
  },
}

export default meta
type Story = StoryObj<typeof Input>
type PlayCtx = Parameters<NonNullable<Story['play']>>[0]

// ─── Visual ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async (context: PlayCtx) => {
    const input = within(context.canvasElement).getByRole('textbox')
    await expect(input).toBeInTheDocument()
    await expect(input).not.toBeDisabled()
  },
}

export const ValidationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input variant="outline" color="default"  placeholder="Default"  />
      <Input variant="outline" color="error"    placeholder="Error"    />
      <Input variant="outline" color="success"  placeholder="Success"  />
      <Input variant="outline" color="warning"  placeholder="Warning"  />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input variant="outline" placeholder="Outline" />
      <Input variant="filled"  placeholder="Filled"  />
      <Input variant="flushed" placeholder="Flushed" />
    </div>
  ),
}

export const FilledValidation: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input variant="filled" color="default"  placeholder="Default"  />
      <Input variant="filled" color="error"    placeholder="Error"    />
      <Input variant="filled" color="success"  placeholder="Success"  />
      <Input variant="filled" color="warning"  placeholder="Warning"  />
    </div>
  ),
}

export const FlushedValidation: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input variant="flushed" color="default"  placeholder="Default"  />
      <Input variant="flushed" color="error"    placeholder="Error"    />
      <Input variant="flushed" color="success"  placeholder="Success"  />
      <Input variant="flushed" color="warning"  placeholder="Warning"  />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input size="sm" placeholder="Small"  />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large"  />
    </div>
  ),
}

// ─── Behavior ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
  play: async (context: PlayCtx) => {
    const input = within(context.canvasElement).getByRole('textbox')

    await expect(input).toBeDisabled()

    await userEvent.type(input, 'hello', { pointerEventsCheck: 0 })
    await expect(input).toHaveValue('')
  },
}

export const TypeText: Story = {
  args: {
    placeholder: 'Type here…',
  },
  play: async (context: PlayCtx) => {
    const input = within(context.canvasElement).getByRole('textbox')

    await userEvent.click(input)
    await expect(input).toHaveFocus()

    await userEvent.type(input, 'Hello world')
    await expect(input).toHaveValue('Hello world')
  },
}

export const ClearOnType: Story = {
  args: {
    defaultValue: 'old value',
  },
  play: async (context: PlayCtx) => {
    const input = within(context.canvasElement).getByRole('textbox')

    await userEvent.tripleClick(input)
    await userEvent.type(input, 'new value')
    await expect(input).toHaveValue('new value')
  },
}

export const ErrorState: Story = {
  args: {
    color: 'error',
    defaultValue: 'invalid@',
    'aria-invalid': true,
    'aria-describedby': 'email-error',
  },
  play: async (context: PlayCtx) => {
    const input = within(context.canvasElement).getByRole('textbox')

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveValue('invalid@')
  },
}
