import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tableCellVariants = cva(
  ['p-4 align-middle', '[&:has([role=checkbox])]:pr-0'],
  {
    variants: {
      align: {
        left:   'text-left',
        center: 'text-center',
        right:  'text-right',
      },
      frozen: {
        true:  'sticky z-10 bg-background',
        false: '',
      },
      /**
       * `interaction` — describes the cell's interactive capability.
       * - `none`     default, no interaction affordance
       * - `editable` cell can be activated (double-click / Enter); shows edit cursor + hover tint
       * - `editing`  cell is currently in edit mode; editor handles its own visual state
       */
      interaction: {
        none:     '',
        editable: 'cursor-cell hover:bg-primary/5',
        editing:  '',
      },
      /**
       * `focusable` — enables keyboard-navigation focus ring.
       * Should be true whenever the cell participates in arrow-key navigation.
       */
      focusable: {
        true:  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
        false: '',
      },
    },
    defaultVariants: {
      align:       'left',
      frozen:      false,
      interaction: 'none',
      focusable:   false,
    },
  }
)

// Omit legacy HTML 'align' attribute — conflicts with our CVA align variant union
export interface TableCellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof tableCellVariants> {}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align, frozen, interaction, focusable, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(tableCellVariants({ align, frozen, interaction, focusable }), className)}
      {...props}
    />
  )
)

TableCell.displayName = 'TableCell'

export { TableCell, tableCellVariants }
