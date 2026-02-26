import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnVisibilityState,
  ExpandedState,
  PaginationState,
  Row,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table'

// Re-export TanStack state types so consumers don't need to import from @tanstack/react-table directly
export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnVisibilityState,
  ExpandedState,
  PaginationState,
  Row,
  SortingState,
  RowSelectionState,
}

// ─── Callback types ───────────────────────────────────────────────────────────

export type OnSortingChange = (state: SortingState) => void
export type OnColumnFiltersChange = (state: ColumnFiltersState) => void
export type OnGlobalFilterChange = (value: string) => void
export type OnPaginationChange = (state: PaginationState) => void
export type OnColumnPinningChange = (state: ColumnPinningState) => void
export type OnColumnVisibilityChange = (state: ColumnVisibilityState) => void
export type OnRowSelectionChange = (state: RowSelectionState) => void
export type OnExpandedChange = (state: ExpandedState) => void

// ─── Page size options ────────────────────────────────────────────────────────

export type DataTablePageSizeOptions = number[]

// ─── DataTable props ──────────────────────────────────────────────────────────

export interface DataTableProps<TData> {
  // Data
  columns: ColumnDef<TData, unknown>[]
  data: TData[]

  // Sort — controlled
  sorting?: SortingState
  onSortingChange?: OnSortingChange
  /** Allow shift+click to add secondary sort columns. Default: false */
  enableMultiSort?: boolean
  /** Maximum number of simultaneous sort columns when multi-sort is on. Default: 3 */
  maxMultiSortColCount?: number

  // Column filter — controlled
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnColumnFiltersChange

  // Global filter — controlled
  /** Value used to filter across all columns simultaneously */
  globalFilter?: string
  onGlobalFilterChange?: OnGlobalFilterChange
  /** Placeholder for the global search input */
  globalFilterPlaceholder?: string

  // Pagination — controlled
  // pageIndex is 0-based (TanStack convention), internally translated for display
  pagination?: PaginationState
  onPaginationChange?: OnPaginationChange
  pageCount?: number
  pageSizeOptions?: DataTablePageSizeOptions

  // Column pinning (freeze) — controlled
  columnPinning?: ColumnPinningState
  onColumnPinningChange?: OnColumnPinningChange

  // Column visibility — controlled
  columnVisibility?: ColumnVisibilityState
  onColumnVisibilityChange?: OnColumnVisibilityChange

  // Row selection — controlled
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnRowSelectionChange

  // Row expansion — controlled
  expanded?: ExpandedState
  onExpandedChange?: OnExpandedChange
  /** Renders the expanded sub-row content below the parent row */
  renderSubRow?: (row: Row<TData>) => React.ReactNode

  // UI
  /** Freeze the header row via sticky positioning */
  stickyHeader?: boolean
  /** Shown when data is empty */
  emptyMessage?: string
  className?: string
}
