import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TableRootProps extends React.HTMLAttributes<HTMLTableElement> {}

const TableRoot = forwardRef<HTMLTableElement, TableRootProps>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  )
)

TableRoot.displayName = 'TableRoot'

export { TableRoot }
