import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

const buttonVariants = cva(
  // Base styles — layout, transition, focus ring
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-md text-sm font-medium whitespace-nowrap',
    'ring-offset-background transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      /**
       * `variant` — structural shape of the button.
       * Does NOT encode meaning. Use `color` for that.
       */
      variant: {
        solid: '',
        outline: 'border bg-transparent',
        ghost: 'bg-transparent',
      },
      /**
       * `color` — semantic intent.
       * Does NOT control layout. Use `variant` for that.
       */
      color: {
        primary: '',
        secondary: '',
        danger: '',
        success: '',
        warning: '',
        muted: '',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    compoundVariants: [
      // solid + primary
      {
        variant: 'solid',
        color: 'primary',
        class: 'bg-primary text-primary-foreground hover:bg-primary/90',
      },
      // solid + secondary
      {
        variant: 'solid',
        color: 'secondary',
        class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      // solid + danger
      {
        variant: 'solid',
        color: 'danger',
        class: 'bg-danger text-danger-foreground hover:bg-danger/90',
      },
      // solid + success
      {
        variant: 'solid',
        color: 'success',
        class: 'bg-success text-success-foreground hover:bg-success/90',
      },
      // solid + warning
      {
        variant: 'solid',
        color: 'warning',
        class: 'bg-warning text-warning-foreground hover:bg-warning/90',
      },
      // solid + muted
      {
        variant: 'solid',
        color: 'muted',
        class: 'bg-muted text-muted-foreground hover:bg-muted/80',
      },
      // outline + primary
      {
        variant: 'outline',
        color: 'primary',
        class: 'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
      },
      // outline + secondary
      {
        variant: 'outline',
        color: 'secondary',
        class: 'border-secondary text-secondary-foreground hover:bg-secondary',
      },
      // outline + danger
      {
        variant: 'outline',
        color: 'danger',
        class: 'border-danger text-danger hover:bg-danger hover:text-danger-foreground',
      },
      // outline + success
      {
        variant: 'outline',
        color: 'success',
        class: 'border-success text-success hover:bg-success hover:text-success-foreground',
      },
      // outline + warning
      {
        variant: 'outline',
        color: 'warning',
        class: 'border-warning text-warning hover:bg-warning hover:text-warning-foreground',
      },
      // outline + muted
      {
        variant: 'outline',
        color: 'muted',
        class: 'border-border text-muted-foreground hover:bg-muted',
      },
      // ghost + primary
      {
        variant: 'ghost',
        color: 'primary',
        class: 'text-primary hover:bg-primary/10',
      },
      // ghost + secondary
      {
        variant: 'ghost',
        color: 'secondary',
        class: 'text-secondary-foreground hover:bg-secondary',
      },
      // ghost + danger
      {
        variant: 'ghost',
        color: 'danger',
        class: 'text-danger hover:bg-danger/10',
      },
      // ghost + success
      {
        variant: 'ghost',
        color: 'success',
        class: 'text-success hover:bg-success/10',
      },
      // ghost + warning
      {
        variant: 'ghost',
        color: 'warning',
        class: 'text-warning hover:bg-warning/10',
      },
      // ghost + muted
      {
        variant: 'ghost',
        color: 'muted',
        class: 'text-muted-foreground hover:bg-muted',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'md',
    },
  }
)

// Omit 'color' because HTMLButtonElement has a legacy `color: string` attribute
// that conflicts with our semantic color variant union type.
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, asChild = false, loading = false, disabled = false, leftIcon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, color, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Spinner /> : leftIcon}
        {children}
        {rightIcon}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
