import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tableCellVariants = cva(
  ['p-4 align-middle', '[&:has([role=checkbox])]:pr-0'],
  {
    variants: {
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      frozen: {
        true: 'sticky z-10 bg-background',
        false: '',
      },
    },
    defaultVariants: {
      align: 'left',
      frozen: false,
    },
  }
)

// Omit legacy HTML 'align' attribute — conflicts with our CVA align variant union
export interface TableCellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof tableCellVariants> {}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align, frozen, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(tableCellVariants({ align, frozen }), className)}
      {...props}
    />
  )
)

TableCell.displayName = 'TableCell'

export { TableCell, tableCellVariants }
