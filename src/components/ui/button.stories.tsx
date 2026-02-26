import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within, fn } from 'storybook/test'
import { Button } from './button'

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5v14" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: 'Structural shape of the button',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'muted'],
      description: 'Semantic intent (does not control layout)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    children: 'Button',
    onClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Button>
type PlayCtx = Parameters<NonNullable<Story['play']>>[0]

// --- Visual ---

export const Default: Story = {
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')
    await expect(btn).toBeInTheDocument()
    await expect(btn).not.toBeDisabled()
    await expect(btn).toHaveAttribute('aria-busy', 'false')
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="solid" color="primary">Solid Primary</Button>
      <Button variant="solid" color="secondary">Solid Secondary</Button>
      <Button variant="solid" color="danger">Solid Danger</Button>
      <Button variant="solid" color="success">Solid Success</Button>
      <Button variant="solid" color="warning">Solid Warning</Button>
      <Button variant="solid" color="muted">Solid Muted</Button>
    </div>
  ),
}

export const AllOutline: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" color="primary">Outline Primary</Button>
      <Button variant="outline" color="secondary">Outline Secondary</Button>
      <Button variant="outline" color="danger">Outline Danger</Button>
      <Button variant="outline" color="success">Outline Success</Button>
      <Button variant="outline" color="warning">Outline Warning</Button>
      <Button variant="outline" color="muted">Outline Muted</Button>
    </div>
  ),
}

export const AllGhost: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="ghost" color="primary">Ghost Primary</Button>
      <Button variant="ghost" color="secondary">Ghost Secondary</Button>
      <Button variant="ghost" color="danger">Ghost Danger</Button>
      <Button variant="ghost" color="success">Ghost Success</Button>
      <Button variant="ghost" color="warning">Ghost Warning</Button>
      <Button variant="ghost" color="muted">Ghost Muted</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

// --- Behavior ---

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')

    await expect(btn).toBeDisabled()

    await userEvent.click(btn, { pointerEventsCheck: 0 })
    await expect(context.args.onClick).not.toHaveBeenCalled()
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Saving',
  },
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')

    // Disabled while loading
    await expect(btn).toBeDisabled()
    await expect(btn).toHaveAttribute('aria-busy', 'true')

    // Spinner visible
    const spinner = btn.querySelector('svg')
    await expect(spinner).toBeInTheDocument()

    // Children text still present
    await expect(btn).toHaveTextContent('Saving')

    // Click does not fire
    await userEvent.click(btn, { pointerEventsCheck: 0 })
    await expect(context.args.onClick).not.toHaveBeenCalled()
  },
}

export const LoadingVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button loading variant="solid" color="primary">Saving</Button>
      <Button loading variant="outline" color="primary">Saving</Button>
      <Button loading variant="ghost" color="primary">Saving</Button>
    </div>
  ),
}

export const ClickEvent: Story = {
  args: {
    children: 'Click me',
  },
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')

    await userEvent.click(btn)
    await expect(context.args.onClick).toHaveBeenCalledOnce()
  },
}

export const KeyboardActivation: Story = {
  args: {
    children: 'Press Enter',
  },
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')

    btn.focus()
    await expect(btn).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await expect(context.args.onClick).toHaveBeenCalledOnce()
  },
}

export const WithLeftIcon: Story = {
  args: {
    leftIcon: <PlusIcon />,
    children: 'Add Item',
  },
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')
    await expect(btn.querySelector('svg')).toBeInTheDocument()
  },
}

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ArrowRightIcon />,
    children: 'Next',
  },
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')
    await expect(btn.querySelector('svg')).toBeInTheDocument()
  },
}

export const WithBothIcons: Story = {
  args: {
    leftIcon: <PlusIcon />,
    rightIcon: <ArrowRightIcon />,
    children: 'Action',
  },
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')
    await expect(btn.querySelectorAll('svg')).toHaveLength(2)
  },
}

export const LoadingReplacesLeftIcon: Story = {
  args: {
    leftIcon: <PlusIcon />,
    loading: true,
    children: 'Saving',
  },
  play: async (context: PlayCtx) => {
    const btn = within(context.canvasElement).getByRole('button')
    // Spinner replaces the left icon — still only one svg
    await expect(btn.querySelectorAll('svg')).toHaveLength(1)
    await expect(btn).toHaveAttribute('aria-busy', 'true')
  },
}
