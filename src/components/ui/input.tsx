import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  [
    'flex w-full text-sm transition-colors',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      /**
       * `variant` — structural shape of the input.
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
        md: 'h-9 py-1',
        lg: 'h-11 text-base py-2',
      },
    },
    compoundVariants: [
      // outline × color
      { variant: 'outline', color: 'default', class: 'border-input   focus-visible:ring-ring'    },
      { variant: 'outline', color: 'error',   class: 'border-danger  focus-visible:ring-danger'  },
      { variant: 'outline', color: 'success', class: 'border-success focus-visible:ring-success' },
      { variant: 'outline', color: 'warning', class: 'border-warning focus-visible:ring-warning' },
      // filled × color
      { variant: 'filled',  color: 'default', class: 'border-b-transparent focus-visible:ring-ring'    },
      { variant: 'filled',  color: 'error',   class: 'border-b-danger      focus-visible:ring-danger'  },
      { variant: 'filled',  color: 'success', class: 'border-b-success     focus-visible:ring-success' },
      { variant: 'filled',  color: 'warning', class: 'border-b-warning     focus-visible:ring-warning' },
      // flushed × color
      { variant: 'flushed', color: 'default', class: 'border-b-input   focus-visible:ring-ring'    },
      { variant: 'flushed', color: 'error',   class: 'border-b-danger  focus-visible:ring-danger'  },
      { variant: 'flushed', color: 'success', class: 'border-b-success focus-visible:ring-success' },
      { variant: 'flushed', color: 'warning', class: 'border-b-warning focus-visible:ring-warning' },
    ],
    defaultVariants: {
      variant: 'outline',
      color: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color' | 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, color, size, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(inputVariants({ variant, color, size }), className)}
      {...props}
    />
  )
)

Input.displayName = 'Input'

export { Input, inputVariants }
