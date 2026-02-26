import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tableHeadVariants = cva(
  [
    'h-12 px-4 text-left align-middle',
    'font-medium text-muted-foreground',
    '[&:has([role=checkbox])]:pr-0',
  ],
  {
    variants: {
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      frozen: {
        true: 'sticky z-20 bg-background',
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
export interface TableHeadProps
  extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof tableHeadVariants> {}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, align, frozen, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(tableHeadVariants({ align, frozen }), className)}
      {...props}
    />
  )
)

TableHead.displayName = 'TableHead'

export { TableHead, tableHeadVariants }
