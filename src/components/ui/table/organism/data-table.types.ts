import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  PaginationState,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table'

// Re-export TanStack state types so consumers don't need to import from @tanstack/react-table directly
export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  PaginationState,
  SortingState,
  RowSelectionState,
}

// ─── Callback types ──────────────────────────────────────────────────────────

export type OnSortingChange = (state: SortingState) => void
export type OnColumnFiltersChange = (state: ColumnFiltersState) => void
export type OnPaginationChange = (state: PaginationState) => void
export type OnColumnPinningChange = (state: ColumnPinningState) => void
export type OnRowSelectionChange = (state: RowSelectionState) => void

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

  // Filter — controlled
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnColumnFiltersChange

  // Pagination — controlled
  // pageIndex is 0-based (TanStack convention), internally translated for display
  pagination?: PaginationState
  onPaginationChange?: OnPaginationChange
  pageCount?: number
  pageSizeOptions?: DataTablePageSizeOptions

  // Column pinning (freeze) — controlled
  columnPinning?: ColumnPinningState
  onColumnPinningChange?: OnColumnPinningChange

  // Row selection — controlled
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnRowSelectionChange

  // UI
  /** Freeze the header row via sticky positioning */
  stickyHeader?: boolean
  /** Shown when data is empty */
  emptyMessage?: string
  className?: string
}
