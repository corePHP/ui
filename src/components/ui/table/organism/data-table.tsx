import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { TableWrapper } from '../atom/base/table-wrapper'
import { TableRoot } from '../atom/base/table-root'
import { TableHeader } from '../atom/base/table-header'
import { TableBody } from '../atom/base/table-body'
import { TableRow } from '../atom/base/table-row'
import { TableHead } from '../atom/base/table-head'
import { TableCell } from '../atom/base/table-cell'
import { ExpandToggle } from '../atom/expand/expand-toggle'
import { ColumnHeader, type SortDirection } from '../molecules/column-header'
import { ColumnVisibility } from '../molecules/column-visibility'
import { FilterInput } from '../molecules/filter-input'
import { Pagination } from '../molecules/pagination'
import type {
  ColumnVisibilityState,
  DataTableProps,
  ExpandedState,
} from './data-table.types'

// ─── DataTable ────────────────────────────────────────────────────────────────
//
// Organism. Composes all table atoms and molecules into a single controlled
// surface. Emits intent via callbacks — never fetches, routes, or side-effects.
//
// Modes:
//   Client-side (default) — TanStack applies sort / filter / pagination to data.
//   Server-side (pageCount provided) — parent owns all transformations; this
//     component only notifies via callbacks.
//
// Features:
//   Sorting           — single or multi-column (shift+click)
//   Global filter     — cross-column text search
//   Column filter     — per-column filter row
//   Pagination        — client-side or server-side
//   Column pinning    — freeze left / right
//   Column visibility — show / hide columns
//   Row selection     — checkbox-driven, fully controlled
//   Row expansion     — expandable sub-rows via renderSubRow

function DataTable<TData>({
  columns,
  data,

  sorting = [],
  onSortingChange,
  enableMultiSort = false,
  maxMultiSortColCount = 3,

  columnFilters = [],
  onColumnFiltersChange,

  globalFilter = '',
  onGlobalFilterChange,
  globalFilterPlaceholder = 'Search…',

  pagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange,
  pageCount,
  pageSizeOptions,

  columnPinning = {},
  onColumnPinningChange,

  columnVisibility = {},
  onColumnVisibilityChange,

  rowSelection = {},
  onRowSelectionChange,

  expanded = {},
  onExpandedChange,
  renderSubRow,

  stickyHeader = false,
  emptyMessage = 'No results.',
  className,
}: DataTableProps<TData>) {
  const isManual = pageCount !== undefined

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      columnPinning,
      columnVisibility,
      rowSelection,
      expanded,
    },

    // ── Updater bridge: convert TanStack functional updaters to plain state ───
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      onSortingChange?.(next)
    },
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnFilters) : updater
      onColumnFiltersChange?.(next)
    },
    onGlobalFilterChange: (updater) => {
      const next = typeof updater === 'function' ? updater(globalFilter) : updater
      onGlobalFilterChange?.(String(next ?? ''))
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater
      onPaginationChange?.(next)
    },
    onColumnPinningChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnPinning) : updater
      onColumnPinningChange?.(next)
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function'
        ? updater(columnVisibility as ColumnVisibilityState)
        : updater
      onColumnVisibilityChange?.(next as ColumnVisibilityState)
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      onRowSelectionChange?.(next)
    },
    onExpandedChange: (updater) => {
      const next = typeof updater === 'function' ? updater(expanded as ExpandedState) : updater
      onExpandedChange?.(next as ExpandedState)
    },

    // ── Row models ────────────────────────────────────────────────────────────
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: !isManual ? getSortedRowModel() : undefined,
    getFilteredRowModel: !isManual ? getFilteredRowModel() : undefined,
    getPaginationRowModel:
      !isManual && onPaginationChange !== undefined
        ? getPaginationRowModel()
        : undefined,
    getExpandedRowModel: renderSubRow !== undefined ? getExpandedRowModel() : undefined,

    // ── Manual flags (server-side mode) ──────────────────────────────────────
    manualSorting: isManual,
    manualFiltering: isManual,
    manualPagination: isManual,
    pageCount: isManual ? pageCount : undefined,

    // ── Multi-sort ────────────────────────────────────────────────────────────
    enableMultiSort,
    maxMultiSortColCount,
    isMultiSortEvent: enableMultiSort
      ? (e) => (e as KeyboardEvent).shiftKey
      : () => false,
  })

  // ── Derived flags ──────────────────────────────────────────────────────────
  const hasGlobalFilter   = onGlobalFilterChange !== undefined
  const hasColVisibility  = onColumnVisibilityChange !== undefined
  const hasFilterRow      =
    onColumnFiltersChange !== undefined &&
    table.getAllLeafColumns().some((c) => c.getCanFilter())
  const hasPagination     = onPaginationChange !== undefined
  const hasExpansion      = renderSubRow !== undefined

  // ── Pinning style helper ───────────────────────────────────────────────────
  const pinStyle = (
    pinned: false | 'left' | 'right',
    getStart: () => number,
    getAfter: () => number,
  ): React.CSSProperties | undefined =>
    pinned === 'left'
      ? { left: getStart() }
      : pinned === 'right'
        ? { right: getAfter() }
        : undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>

      {/* ── Toolbar: global search + column visibility ──────────────────────── */}
      {(hasGlobalFilter || hasColVisibility) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {hasGlobalFilter && (
            <FilterInput
              value={globalFilter}
              onFilter={(v) => onGlobalFilterChange(v)}
              placeholder={globalFilterPlaceholder}
              className="max-w-64"
            />
          )}
          {hasColVisibility && (
            <ColumnVisibility
              columns={table.getAllLeafColumns()}
              onVisibilityChange={(id, visible) =>
                onColumnVisibilityChange({ ...columnVisibility, [id]: visible } as ColumnVisibilityState)
              }
            />
          )}
        </div>
      )}

      <TableWrapper>
        <TableRoot>
          <TableHeader sticky={stickyHeader}>

            {/* ── Column headers ──────────────────────────────────────────── */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* Expansion gutter */}
                {hasExpansion && <TableHead style={{ width: 36, minWidth: 36 }} />}

                {headerGroup.headers.map((header) => {
                  const col    = header.column
                  const pinned = col.getIsPinned()
                  const sorted = col.getIsSorted() as SortDirection

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      frozen={!!pinned}
                      style={pinStyle(pinned, () => col.getStart('left'), () => col.getAfter('right'))}
                    >
                      {header.isPlaceholder ? null : col.getCanSort() ? (
                        <ColumnHeader
                          sortable
                          sorted={sorted}
                          onSort={() => col.toggleSorting()}
                        >
                          {flexRender(col.columnDef.header, header.getContext())}
                        </ColumnHeader>
                      ) : (
                        flexRender(col.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}

            {/* ── Filter row (opt-in) ─────────────────────────────────────── */}
            {hasFilterRow &&
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={`filter-${headerGroup.id}`}>
                  {hasExpansion && <TableHead style={{ width: 36, minWidth: 36 }} />}

                  {headerGroup.headers.map((header) => {
                    const col    = header.column
                    const pinned = col.getIsPinned()

                    return (
                      <TableHead
                        key={`filter-${header.id}`}
                        frozen={!!pinned}
                        style={pinStyle(pinned, () => col.getStart('left'), () => col.getAfter('right'))}
                      >
                        {col.getCanFilter() ? (
                          <FilterInput
                            value={(col.getFilterValue() as string) ?? ''}
                            onFilter={(v) => col.setFilterValue(v || undefined)}
                            column={col.id}
                            className="h-7 text-xs"
                          />
                        ) : null}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasExpansion ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow key={row.id} selected={row.getIsSelected()}>
                    {/* Expand toggle */}
                    {hasExpansion && (
                      <TableCell style={{ width: 36, minWidth: 36 }}>
                        {row.getCanExpand() && (
                          <ExpandToggle
                            expanded={row.getIsExpanded()}
                            onToggle={() => row.toggleExpanded()}
                          />
                        )}
                      </TableCell>
                    )}

                    {row.getVisibleCells().map((cell) => {
                      const col    = cell.column
                      const pinned = col.getIsPinned()

                      return (
                        <TableCell
                          key={cell.id}
                          frozen={!!pinned}
                          style={pinStyle(pinned, () => col.getStart('left'), () => col.getAfter('right'))}
                        >
                          {flexRender(col.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>

                  {/* Sub-row content */}
                  {hasExpansion && row.getIsExpanded() && (
                    <TableRow key={`${row.id}-sub`}>
                      <TableCell
                        colSpan={columns.length + 1}
                        className="bg-muted/30 p-0"
                      >
                        {renderSubRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </TableRoot>
      </TableWrapper>

      {/* ── Pagination (opt-in) ─────────────────────────────────────────────── */}
      {hasPagination && (
        <Pagination
          page={pagination.pageIndex + 1}
          pageCount={isManual ? (pageCount ?? 1) : table.getPageCount()}
          pageSize={pagination.pageSize}
          totalRows={!isManual ? data.length : undefined}
          pageSizeOptions={pageSizeOptions}
          onPageChange={(p) =>
            onPaginationChange({ ...pagination, pageIndex: p - 1 })
          }
          onPageSizeChange={(size) =>
            onPaginationChange({ pageIndex: 0, pageSize: size })
          }
        />
      )}
    </div>
  )
}

DataTable.displayName = 'DataTable'

export { DataTable }
