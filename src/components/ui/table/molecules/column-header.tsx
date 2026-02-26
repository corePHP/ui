import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { SortIndicator } from '../atom/sort/sort-indicator'

const columnHeaderVariants = cva(
  [
    'group inline-flex items-center gap-1.5',
    'text-left font-medium text-muted-foreground',
    'transition-colors',
  ],
  {
    variants: {
      sortable: {
        true: 'cursor-pointer select-none hover:text-foreground',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      sortable: false,
    },
  }
)

export type SortDirection = 'asc' | 'desc' | false

export interface ColumnHeaderProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof columnHeaderVariants> {
  sorted?: SortDirection
  onSort?: () => void
}

const ColumnHeader = forwardRef<HTMLButtonElement, ColumnHeaderProps>(
  ({ className, sortable, sorted = false, onSort, children, ...props }, ref) => {
    if (!sortable) {
      return (
        <span className={cn(columnHeaderVariants({ sortable }), className)}>
          {children}
        </span>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={onSort}
        className={cn(columnHeaderVariants({ sortable }), className)}
        {...props}
      >
        {children}
        <SortIndicator
          direction={sorted === false ? 'none' : sorted}
          size="sm"
        />
      </button>
    )
  }
)

ColumnHeader.displayName = 'ColumnHeader'

export { ColumnHeader, columnHeaderVariants }
