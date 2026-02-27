import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tableRowVariants = cva(
  ['border-b transition-colors'],
  {
    variants: {
      /**
       * `selected` — row is part of the active selection.
       * Mutually exclusive with the hover tint (selected rows don't re-tint on hover).
       */
      selected: {
        true:  'bg-muted',
        false: 'hover:bg-muted/50',
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
)

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      className={cn(tableRowVariants({ selected }), className)}
      {...props}
    />
  )
)

TableRow.displayName = 'TableRow'

export { TableRow, tableRowVariants }
