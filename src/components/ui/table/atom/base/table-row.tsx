import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected = false, ...props }, ref) => (
    <tr
      ref={ref}
      data-selected={selected || undefined}
      className={cn(
        'border-b transition-colors',
        'hover:bg-muted/50',
        'data-[selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
)

TableRow.displayName = 'TableRow'

export { TableRow }
