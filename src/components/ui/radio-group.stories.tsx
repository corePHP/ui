import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within, fn } from 'storybook/test'
import { Label } from './label'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta: Meta<typeof RadioGroupItem> = {
  title: 'UI/RadioGroup',
  component: RadioGroupItem,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning'],
      description: 'Semantic intent shown when selected',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    color: 'primary',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <RadioGroup defaultValue="opt1">
        <Story />
      </RadioGroup>
    ),
  ],
  render: ({ color, size, disabled }) => (
    <RadioGroupItem value="opt1" color={color} size={size} disabled={disabled} />
  ),
}

export default meta
type Story = StoryObj<typeof RadioGroupItem>
type PlayCtx = Parameters<NonNullable<Story['play']>>[0]

// ─── Visual ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async (context: PlayCtx) => {
    const radio = within(context.canvasElement).getByRole('radio')
    await expect(radio).toBeInTheDocument()
    await expect(radio).not.toBeDisabled()
  },
}

export const AllColors: Story = {
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      {(['primary', 'secondary', 'danger', 'success', 'warning'] as const).map((color) => (
        <RadioGroup key={color} defaultValue="opt">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="opt" color={color} id={`radio-${color}`} />
            <Label htmlFor={`radio-${color}`} className="capitalize">{color}</Label>
          </div>
        </RadioGroup>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  decorators: [],
  render: () => (
    <div className="flex items-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <RadioGroup key={size} defaultValue="opt">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="opt" size={size} id={`radio-${size}`} />
            <Label htmlFor={`radio-${size}`} className="capitalize">{size}</Label>
          </div>
        </RadioGroup>
      ))}
    </div>
  ),
}

export const WithLabels: Story = {
  decorators: [],
  render: () => (
    <RadioGroup defaultValue="apple">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="apple" id="apple" />
          <Label htmlFor="apple">Apple</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="banana" id="banana" />
          <Label htmlFor="banana">Banana</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="orange" id="orange" />
          <Label htmlFor="orange">Orange</Label>
        </div>
      </div>
    </RadioGroup>
  ),
}

// ─── Behavior ─────────────────────────────────────────────────────────────────

export const Selection: Story = {
  decorators: [],
  render: () => (
    <RadioGroup defaultValue="" onValueChange={fn()}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="sel-a" />
          <Label htmlFor="sel-a">Option A</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="sel-b" />
          <Label htmlFor="sel-b">Option B</Label>
        </div>
      </div>
    </RadioGroup>
  ),
  play: async (context: PlayCtx) => {
    const [radioA, radioB] = within(context.canvasElement).getAllByRole('radio')

    await userEvent.click(radioA)
    await expect(radioA).toBeChecked()
    await expect(radioB).not.toBeChecked()

    await userEvent.click(radioB)
    await expect(radioB).toBeChecked()
    await expect(radioA).not.toBeChecked()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async (context: PlayCtx) => {
    const radio = within(context.canvasElement).getByRole('radio')

    await expect(radio).toBeDisabled()
  },
}

export const KeyboardNavigation: Story = {
  decorators: [],
  render: () => (
    <RadioGroup defaultValue="x">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="x" id="kb-x" />
          <Label htmlFor="kb-x">X</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="y" id="kb-y" />
          <Label htmlFor="kb-y">Y</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="z" id="kb-z" />
          <Label htmlFor="kb-z">Z</Label>
        </div>
      </div>
    </RadioGroup>
  ),
  play: async (context: PlayCtx) => {
    const [radioX] = within(context.canvasElement).getAllByRole('radio')

    radioX.focus()
    await expect(radioX).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    const [, radioY] = within(context.canvasElement).getAllByRole('radio')
    await expect(radioY).toBeChecked()
  },
}
