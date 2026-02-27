import type {
  ColumnDef as TanstackColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ExpandedState,
  PaginationState,
  Row,
  SortingState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table'

// ColumnVisibilityState is an alias for TanStack's VisibilityState, exposed
// under a more descriptive name so consumers don't need to know the internal name.
export type ColumnVisibilityState = VisibilityState

// Re-export TanStack state types so consumers don't need to import from @tanstack/react-table directly
export type {
  ColumnFiltersState,
  ColumnPinningState,
  ExpandedState,
  PaginationState,
  Row,
  SortingState,
  RowSelectionState,
}

// ─── Cell editor contract ─────────────────────────────────────────────────────
//
// Props that the DataTable organism injects into the editor element via
// React.cloneElement when a cell enters edit mode.
//
// Editor components must declare these as optional (the consumer never passes
// them — the organism always provides them at render time).

export interface CellEditorInjectedProps {
  /** Current cell value — provided by the organism */
  value?: unknown
  /** Call with the new value to commit the edit and fire onCellValueChange */
  onCommit?: (value: unknown) => void
  /** Call to discard the edit without firing onCellValueChange */
  onCancel?: () => void
}

// ─── ColumnDef extension ──────────────────────────────────────────────────────
//
// Our ColumnDef extends TanStack's with `editCell` as a first-class property.
// `editCell` is a React element (not a render function) — the organism clones
// it and injects value / onCommit / onCancel at render time.
//
// Pattern:
//
//   const columns: ColumnDef<User>[] = [{
//     accessorKey: 'role',
//     header: 'Role',
//     editCell: <SelectEditor options={ROLE_OPTIONS} />,
//   }]

export type ColumnDef<TData, TValue = unknown> = TanstackColumnDef<TData, TValue> & {
  /**
   * React element rendered in-place when a cell enters edit mode.
   * The organism injects `value`, `onCommit`, and `onCancel` via cloneElement.
   *
   * Pass only the editor-specific props (e.g. `options`).
   * Do not pass value / onCommit / onCancel — those are injected automatically.
   */
  editCell?: React.ReactElement<CellEditorInjectedProps>
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

// ─── Cell editing ─────────────────────────────────────────────────────────────

/** Identifies the active editing cell by row and column */
export interface EditingCell {
  rowId: string
  columnId: string
}

/**
 * Emitted when the user commits an edit via onCommit.
 * `newValue` is `unknown` — typed by the column's TValue at the call site.
 */
export interface CellChangeEvent<TData> {
  rowId: string
  columnId: string
  rowIndex: number
  oldValue: unknown
  newValue: unknown
  row: Row<TData>
}

export type OnEditingCellChange = (cell: EditingCell | null) => void
export type OnCellValueChange<TData> = (event: CellChangeEvent<TData>) => void

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
  /** Maximum simultaneous sort columns when multi-sort is on. Default: 3 */
  maxMultiSortColCount?: number

  // Column filter — controlled
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnColumnFiltersChange

  // Global filter — controlled
  globalFilter?: string
  onGlobalFilterChange?: OnGlobalFilterChange
  globalFilterPlaceholder?: string

  // Pagination — controlled
  pagination?: PaginationState
  onPaginationChange?: OnPaginationChange
  pageCount?: number
  pageSizeOptions?: DataTablePageSizeOptions

  // Column pinning — controlled
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
  renderSubRow?: (row: Row<TData>) => React.ReactNode

  // Cell editing
  //
  // Opt-in: provide `onCellValueChange` to enable editing.
  // Each editable column declares its editor via the `editCell` element prop.
  //
  // Editing state (which cell is active) is internal by default.
  // Provide `editingCell` + `onEditingCellChange` for full external control.
  onCellValueChange?: OnCellValueChange<TData>
  editingCell?: EditingCell | null
  onEditingCellChange?: OnEditingCellChange

  // Keyboard navigation
  /**
   * Enable arrow-key navigation between cells.
   * ArrowRight/Left/Up/Down move focus; Enter starts editing on editable cells.
   * While a cell editor is active, arrow keys are handled by the editor.
   */
  enableKeyboardNavigation?: boolean

  // UI
  stickyHeader?: boolean
  emptyMessage?: string
  className?: string
}
