import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean
}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        '[&_tr]:border-b',
        sticky && 'sticky top-0 z-10 bg-background',
        className
      )}
      {...props}
    />
  )
)

TableHeader.displayName = 'TableHeader'

export { TableHeader }
