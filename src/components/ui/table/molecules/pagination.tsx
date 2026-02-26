import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const paginationButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium',
    'ring-offset-background transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'h-8 w-8 border border-input bg-background hover:bg-muted',
  ],
  {
    variants: {},
    defaultVariants: {},
  }
)

const pageSizeSelectVariants = cva(
  [
    'h-8 rounded-md border border-input bg-background px-2 text-sm',
    'ring-offset-background transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ],
  {
    variants: {},
    defaultVariants: {},
  }
)

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof paginationButtonVariants> {
  page: number
  pageCount: number
  pageSize: number
  totalRows?: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className,
      page,
      pageCount,
      pageSize,
      totalRows,
      pageSizeOptions = [10, 20, 50, 100],
      onPageChange,
      onPageSizeChange,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between gap-4 px-1 py-2', className)}
      {...props}
    >
      {/* Row count + page size */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {totalRows !== undefined && (
          <span>{totalRows} row{totalRows !== 1 ? 's' : ''}</span>
        )}
        {onPageSizeChange && (
          <>
            <span>·</span>
            <label className="flex items-center gap-1.5">
              Rows per page
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className={pageSizeSelectVariants()}
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          aria-label="Go to first page"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          className={paginationButtonVariants()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
            <path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Go to previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={paginationButtonVariants()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Go to next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={paginationButtonVariants()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Go to last page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(pageCount)}
          className={paginationButtonVariants()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
            <path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" />
          </svg>
        </button>
      </div>
    </div>
  )
)

Pagination.displayName = 'Pagination'

export { Pagination }
