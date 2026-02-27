import { forwardRef } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ─── Root ─────────────────────────────────────────────────────────────────────

const Select        = SelectPrimitive.Root
const SelectGroup   = SelectPrimitive.Group
const SelectValue   = SelectPrimitive.Value

// ─── Trigger ──────────────────────────────────────────────────────────────────

const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between whitespace-nowrap text-sm transition-colors',
    'ring-offset-background placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
    '[&>span]:line-clamp-1',
  ],
  {
    variants: {
      /**
       * `variant` — structural shape of the trigger.
       * Does NOT encode meaning. Use `color` for that.
       */
      variant: {
        outline: 'rounded-md border bg-transparent px-3 shadow-sm',
        filled:  'rounded-md border-b-2 bg-muted px-3',
        flushed: 'border-b-2 bg-transparent px-0',
      },
      /**
       * `color` — semantic validation state.
       * Does NOT control layout. Use `variant` for that.
       */
      color: {
        default: '',
        error:   '',
        success: '',
        warning: '',
      },
      size: {
        sm: 'h-8 text-xs py-1',
        md: 'h-9 py-2',
        lg: 'h-11 text-base py-2',
      },
    },
    compoundVariants: [
      // outline × color
      { variant: 'outline', color: 'default', class: 'border-input   focus:ring-ring'    },
      { variant: 'outline', color: 'error',   class: 'border-danger  focus:ring-danger'  },
      { variant: 'outline', color: 'success', class: 'border-success focus:ring-success' },
      { variant: 'outline', color: 'warning', class: 'border-warning focus:ring-warning' },
      // filled × color
      { variant: 'filled',  color: 'default', class: 'border-b-transparent focus:ring-ring'    },
      { variant: 'filled',  color: 'error',   class: 'border-b-danger      focus:ring-danger'  },
      { variant: 'filled',  color: 'success', class: 'border-b-success     focus:ring-success' },
      { variant: 'filled',  color: 'warning', class: 'border-b-warning     focus:ring-warning' },
      // flushed × color
      { variant: 'flushed', color: 'default', class: 'border-b-input   focus:ring-ring'    },
      { variant: 'flushed', color: 'error',   class: 'border-b-danger  focus:ring-danger'  },
      { variant: 'flushed', color: 'success', class: 'border-b-success focus:ring-success' },
      { variant: 'flushed', color: 'warning', class: 'border-b-warning focus:ring-warning' },
    ],
    defaultVariants: {
      variant: 'outline',
      color: 'default',
      size: 'md',
    },
  }
)

export interface SelectTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'color'>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, variant, color, size, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, color, size }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      {/* chevron-down */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
        aria-hidden
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// ─── Scroll buttons ───────────────────────────────────────────────────────────

const SelectScrollUpButton = forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </SelectPrimitive.ScrollUpButton>
))

SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </SelectPrimitive.ScrollDownButton>
))

SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

// ─── Content ──────────────────────────────────────────────────────────────────

const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' && [
          'data-[side=bottom]:translate-y-1',
          'data-[side=left]:-translate-x-1',
          'data-[side=right]:translate-x-1',
          'data-[side=top]:-translate-y-1',
        ],
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))

SelectContent.displayName = SelectPrimitive.Content.displayName

// ─── Label ────────────────────────────────────────────────────────────────────

const SelectLabel = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
))

SelectLabel.displayName = SelectPrimitive.Label.displayName

// ─── Item ─────────────────────────────────────────────────────────────────────

const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        {/* checkmark */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))

SelectItem.displayName = SelectPrimitive.Item.displayName

// ─── Separator ────────────────────────────────────────────────────────────────

const SelectSeparator = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))

SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  selectTriggerVariants,
}
