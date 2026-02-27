import { forwardRef } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const radioItemVariants = cva(
  [
    'aspect-square rounded-full border shadow',
    'focus:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      /**
       * `color` — semantic intent shown when selected.
       * Controls border color and indicator fill via `text-*` (currentColor).
       */
      color: {
        primary:   'border-primary   text-primary',
        secondary: 'border-secondary text-secondary',
        danger:    'border-danger    text-danger',
        success:   'border-success   text-success',
        warning:   'border-warning   text-warning',
      },
      size: {
        sm: 'h-3.5 w-3.5',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      color: 'primary',
      size: 'md',
    },
  }
)

// ─── Root ─────────────────────────────────────────────────────────────────────

const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('grid gap-2', className)}
    {...props}
  />
))

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface RadioGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'color'>,
    VariantProps<typeof radioItemVariants> {}

const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, color, size, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(radioItemVariants({ color, size }), className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5">
        <circle cx="12" cy="12" r="6" />
      </svg>
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem, radioItemVariants }
