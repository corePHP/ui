import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const filterBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium tabular-nums',
  {
    variants: {
      variant: {
        solid: 'bg-primary text-primary-foreground',
        outline: 'border border-primary text-primary bg-transparent',
      },
      size: {
        sm: 'h-4 min-w-4 px-1 text-xs',
        md: 'h-5 min-w-5 px-1.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'sm',
    },
  }
)

export interface FilterBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof filterBadgeVariants> {
  count?: number
}

const FilterBadge = forwardRef<HTMLSpanElement, FilterBadgeProps>(
  ({ className, variant, size, count, children, ...props }, ref) => (
    <span
      ref={ref}
      aria-label={count !== undefined ? `${count} active filters` : undefined}
      className={cn(filterBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {count ?? children}
    </span>
  )
)

FilterBadge.displayName = 'FilterBadge'

export { FilterBadge, filterBadgeVariants }
