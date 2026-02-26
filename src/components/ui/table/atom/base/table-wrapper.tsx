import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

const TableWrapper = forwardRef<HTMLDivElement, TableWrapperProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative w-full overflow-auto', className)}
      {...props}
    />
  )
)

TableWrapper.displayName = 'TableWrapper'

export { TableWrapper }
