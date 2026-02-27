import { forwardRef } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const checkboxVariants = cva(
  [
    'peer shrink-0 rounded-sm border shadow',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      /**
       * `color` — semantic intent shown when checked.
       * Controls border color and checked background/foreground.
       */
      color: {
        primary:   'border-primary   data-[state=checked]:bg-primary   data-[state=checked]:text-primary-foreground',
        secondary: 'border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground',
        danger:    'border-danger    data-[state=checked]:bg-danger    data-[state=checked]:text-danger-foreground',
        success:   'border-success   data-[state=checked]:bg-success   data-[state=checked]:text-success-foreground',
        warning:   'border-warning   data-[state=checked]:bg-warning   data-[state=checked]:text-warning-foreground',
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

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'color'>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, color, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ color, size }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, checkboxVariants }
