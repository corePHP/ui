import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const filterInputVariants = cva(
  [
    'flex h-8 w-full rounded-md border border-input bg-background px-3 py-1',
    'text-sm text-foreground placeholder:text-muted-foreground',
    'ring-offset-background transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        ghost: 'border-transparent bg-muted focus-visible:bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface FilterInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>,
    VariantProps<typeof filterInputVariants> {
  value: string
  onFilter: (value: string) => void
  column?: string
}

const FilterInput = forwardRef<HTMLInputElement, FilterInputProps>(
  ({ className, variant, value, onFilter, column, placeholder, ...props }, ref) => (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onFilter(e.target.value)}
      placeholder={placeholder ?? (column ? `Filter ${column}…` : 'Filter…')}
      aria-label={column ? `Filter by ${column}` : 'Filter'}
      className={cn(filterInputVariants({ variant }), className)}
      {...props}
    />
  )
)

FilterInput.displayName = 'FilterInput'

export { FilterInput, filterInputVariants }
