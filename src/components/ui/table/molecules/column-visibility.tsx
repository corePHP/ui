import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { Column } from '@tanstack/react-table'

// ─── Trigger button ───────────────────────────────────────────────────────────

const triggerVariants = cva(
  [
    'inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5',
    'text-sm font-medium text-foreground',
    'ring-offset-background transition-colors',
    'hover:bg-muted',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ],
  { variants: {}, defaultVariants: {} }
)

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ColumnVisibilityProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Column<TData, any>[]
  onVisibilityChange: (columnId: string, visible: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
//
// Renders an inline toolbar with one checkbox per hideable column.
// Intentionally avoids portals/popover dependencies to stay host-neutral.
// Consumers wrap this in a <details> or popover if they need overlay behaviour.

function ColumnVisibility<TData>({
  columns,
  onVisibilityChange,
  className,
  ...props
}: ColumnVisibilityProps<TData>) {
  const hideableColumns = columns.filter((c) => c.getCanHide())

  if (hideableColumns.length === 0) return null

  return (
    <div
      className={cn('flex flex-wrap items-center gap-3', className)}
      {...props}
    >
      <span className="text-sm font-medium text-muted-foreground">Columns</span>
      {hideableColumns.map((col) => {
        const label =
          typeof col.columnDef.header === 'string'
            ? col.columnDef.header
            : col.id

        return (
          <label
            key={col.id}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-foreground select-none"
          >
            <input
              type="checkbox"
              checked={col.getIsVisible()}
              onChange={(e) => onVisibilityChange(col.id, e.target.checked)}
              className="rounded border-input accent-primary"
              aria-label={`Toggle ${label} column`}
            />
            {label}
          </label>
        )
      })}
    </div>
  )
}

ColumnVisibility.displayName = 'ColumnVisibility'

export { ColumnVisibility, triggerVariants }
