import { Fragment, cloneElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
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
  CellChangeEvent,
  ColumnDef,
  ColumnVisibilityState,
  DataTableProps,
  EditingCell,
  ExpandedState,
} from './data-table.types'
export type { VirtualConfig } from './data-table.types'

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
//   Cell editing      — inline edit via CellEditor atom; opt-in per column via meta.editable

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

  onCellValueChange,
  editingCell,
  onEditingCellChange,

  enableKeyboardNavigation = false,

  components,

  virtual,

  stickyHeader = false,
  emptyMessage = 'No results.',
  className,
}: DataTableProps<TData>) {
  const isManual = pageCount !== undefined

  // Infinite scroll mode: virtual.onLoadMore is provided.
  // In this mode the traditional pagination UI is hidden and TanStack's
  // pagination row model is disabled — all rows are passed to the virtualizer.
  const isInfiniteScroll = virtual?.onLoadMore !== undefined

  // ── Refs ──────────────────────────────────────────────────────────────────
  // containerRef: outer wrapper, used by keyboard navigation to query cells.
  // scrollRef:    scroll container forwarded to useVirtualizer.
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef    = useRef<HTMLDivElement>(null)

  // ── Cell editing state ────────────────────────────────────────────────────
  // Internal state handles the "which cell is active" concern.
  // When `editingCell` prop is provided (even null), external control takes over.
  const [internalEditingCell, setInternalEditingCell] = useState<EditingCell | null>(null)
  const isEditingControlled = editingCell !== undefined
  const activeEditingCell = isEditingControlled ? (editingCell ?? null) : internalEditingCell

  // ── Keyboard-navigation helpers ───────────────────────────────────────────
  // After an edit commits or cancels, return focus to the originating cell so
  // the user can continue navigating with arrow keys without touching the mouse.
  const refocusCell = useCallback((rowId: string, columnId: string) => {
    if (!enableKeyboardNavigation) return
    requestAnimationFrame(() => {
      const td = containerRef.current?.querySelector(
        `td[data-row-id="${rowId}"][data-col-id="${columnId}"]`
      ) as HTMLTableCellElement | null
      td?.focus()
    })
  }, [enableKeyboardNavigation])

  const startEditing = useCallback((rowId: string, columnId: string) => {
    if (isEditingControlled) {
      onEditingCellChange?.({ rowId, columnId })
    } else {
      setInternalEditingCell({ rowId, columnId })
    }
  }, [isEditingControlled, onEditingCellChange])

  const stopEditing = useCallback((rowId?: string, columnId?: string) => {
    if (isEditingControlled) {
      onEditingCellChange?.(null)
    } else {
      setInternalEditingCell(null)
    }
    if (rowId && columnId) refocusCell(rowId, columnId)
  }, [isEditingControlled, onEditingCellChange, refocusCell])

  const commitEdit = useCallback((row: Row<TData>, columnId: string, newValue: unknown) => {
    onCellValueChange?.({
      rowId: row.id,
      columnId,
      rowIndex: row.index,
      oldValue: row.getValue(columnId),
      newValue,
      row,
    } as CellChangeEvent<TData>)
    stopEditing(row.id, columnId)
  }, [onCellValueChange, stopEditing])

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
    // In infinite scroll mode all rows must reach the virtualizer — no slicing.
    getPaginationRowModel:
      !isManual && onPaginationChange !== undefined && !isInfiniteScroll
        ? getPaginationRowModel()
        : undefined,
    getExpandedRowModel: renderSubRow !== undefined ? getExpandedRowModel() : undefined,
    // Force all rows expandable when renderSubRow is provided (data may have no sub-rows)
    getRowCanExpand: renderSubRow !== undefined ? () => true : undefined,

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

  // ── Component slots ────────────────────────────────────────────────────────
  // useMemo prevents component identity changes when parent re-renders without
  // changing the components prop, which would otherwise remount all rows.
  const RowComp  = useMemo(() => components?.Row  ?? TableRow,  [components?.Row])
  const CellComp = useMemo(() => components?.Cell ?? TableCell, [components?.Cell])

  // ── Row virtualizer ────────────────────────────────────────────────────────
  // Always called (hooks must not be conditional).
  // When virtual is off, count=0 so no virtual items are produced and the
  // results are ignored in favour of the standard rendering path.
  const rows = table.getRowModel().rows
  const rowVirtualizer = useVirtualizer({
    count:           virtual ? rows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize:    () => virtual?.estimateRowHeight ?? 40,
    overscan:        virtual?.overscan ?? 10,
  })

  // ── Infinite scroll trigger ────────────────────────────────────────────────
  // Fire onLoadMore when the last virtual item reaches the final loaded row.
  // Uses the last item's index as the dep — a stable primitive — to avoid
  // firing on every render cycle.
  const virtualItems     = rowVirtualizer.getVirtualItems()
  const lastVirtualIndex = virtualItems[virtualItems.length - 1]?.index
  useEffect(() => {
    if (!virtual?.onLoadMore)      return
    if (virtual.hasMore === false) return
    if (lastVirtualIndex === undefined) return
    if (lastVirtualIndex >= rows.length - 1) {
      virtual.onLoadMore()
    }
  }, [lastVirtualIndex, rows.length, virtual?.onLoadMore, virtual?.hasMore])

  // ── Derived flags ──────────────────────────────────────────────────────────
  const hasGlobalFilter  = onGlobalFilterChange     !== undefined
  const hasColVisibility = onColumnVisibilityChange !== undefined
  // Pagination UI is hidden in infinite scroll mode — onLoadMore replaces page navigation.
  const hasPagination    = onPaginationChange !== undefined && !isInfiniteScroll
  const hasExpansion     = renderSubRow       !== undefined
  const hasEditing       = onCellValueChange  !== undefined
  // Memoized separately: getAllLeafColumns() iterates all columns on every call
  const hasFilterRow = useMemo(
    () => onColumnFiltersChange !== undefined && table.getAllLeafColumns().some((c) => c.getCanFilter()),
    [onColumnFiltersChange, table],
  )

  // ── Keyboard navigation handler ───────────────────────────────────────────
  const handleBodyKeyDown = useCallback((e: React.KeyboardEvent<HTMLTableSectionElement>) => {
    // While a cell editor (input / select / textarea) has focus, let it handle
    // its own key events — do not interfere with arrow keys inside editors.
    const target = e.target as HTMLElement
    if (
      target.tagName === 'INPUT'    ||
      target.tagName === 'SELECT'   ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) return

    const cell = target.closest('td') as HTMLTableCellElement | null
    if (!cell) return

    const row   = cell.parentElement as HTMLTableRowElement
    const tbody = row.parentElement as HTMLTableSectionElement
    const rows  = Array.from(tbody.querySelectorAll(':scope > tr'))  as HTMLTableRowElement[]
    const cells = Array.from(row.querySelectorAll(':scope > td'))    as HTMLTableCellElement[]

    const rowIndex = rows.indexOf(row)
    const colIndex = cells.indexOf(cell)

    let target2: HTMLTableCellElement | null = null

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        target2 = cells[colIndex + 1] ?? null
        break
      case 'ArrowLeft':
        e.preventDefault()
        target2 = cells[colIndex - 1] ?? null
        break
      case 'ArrowDown': {
        e.preventDefault()
        const nextRow = rows[rowIndex + 1]
        if (nextRow) {
          const nc = Array.from(nextRow.querySelectorAll(':scope > td')) as HTMLTableCellElement[]
          target2 = nc[colIndex] ?? null
        }
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prevRow = rows[rowIndex - 1]
        if (prevRow) {
          const pc = Array.from(prevRow.querySelectorAll(':scope > td')) as HTMLTableCellElement[]
          target2 = pc[colIndex] ?? null
        }
        break
      }
      case 'Enter': {
        if (!hasEditing) break
        e.preventDefault()
        if (cell.dataset.editable === 'true') {
          const colId = cell.dataset.colId
          const rowId = cell.dataset.rowId
          if (colId && rowId) startEditing(rowId, colId)
        }
        break
      }
    }

    if (target2) target2.focus()
  }, [onCellValueChange, startEditing])

  // ── Pinning style helper ───────────────────────────────────────────────────
  const pinStyle = useCallback((
    pinned: false | 'left' | 'right',
    getStart: () => number,
    getAfter: () => number,
  ): React.CSSProperties | undefined =>
    pinned === 'left'
      ? { left: getStart() }
      : pinned === 'right'
        ? { right: getAfter() }
        : undefined
  , [])

  // ── Virtual padding rows ───────────────────────────────────────────────────
  // TanStack Virtual uses a padding-row technique for HTML tables:
  // a spacer <tr> at the top and bottom fills the gap left by non-rendered rows,
  // preserving the correct scrollbar track size without absolute positioning.
  const paddingTop    = virtualItems.length ? (virtualItems[0]?.start ?? 0)      : 0
  const lastVirtItem  = virtualItems[virtualItems.length - 1]
  const paddingBottom = lastVirtItem
    ? rowVirtualizer.getTotalSize() - lastVirtItem.end
    : 0

  // ── Row render helper ──────────────────────────────────────────────────────
  // Shared between virtual and non-virtual paths to avoid duplication.
  const renderRow = (row: (typeof rows)[number]) => (
    <Fragment key={row.id}>
      <RowComp selected={row.getIsSelected() || undefined}>
        {hasExpansion && (
          <CellComp style={{ width: 36, minWidth: 36 }}>
            {row.getCanExpand() && (
              <ExpandToggle
                expanded={row.getIsExpanded()}
                onToggle={() => row.toggleExpanded()}
              />
            )}
          </CellComp>
        )}

        {row.getVisibleCells().map((cell) => {
          const col      = cell.column
          const pinned   = col.getIsPinned()
          const editCell = (col.columnDef as ColumnDef<TData>).editCell
          const editable = hasEditing && editCell !== undefined
          const editing  =
            editable &&
            activeEditingCell?.rowId === row.id &&
            activeEditingCell?.columnId === col.id

          return (
            <CellComp
              key={cell.id}
              frozen={!!pinned}
              style={pinStyle(pinned, () => col.getStart('left'), () => col.getAfter('right'))}
              // ── Keyboard navigation attributes ──────────────────────────
              tabIndex={enableKeyboardNavigation ? 0 : undefined}
              data-row-id={enableKeyboardNavigation ? row.id : undefined}
              data-col-id={enableKeyboardNavigation ? col.id : undefined}
              data-editable={enableKeyboardNavigation && editable ? 'true' : undefined}
              interaction={editable ? (editing ? 'editing' : 'editable') : 'none'}
              focusable={enableKeyboardNavigation || undefined}
              // Without keyboard nav: single click opens editor.
              // With keyboard nav: Enter opens editor (handleBodyKeyDown); double-click as bonus.
              onClick={
                editable && !editing && !enableKeyboardNavigation
                  ? () => startEditing(row.id, col.id)
                  : undefined
              }
              onDoubleClick={
                editable && !editing && enableKeyboardNavigation
                  ? () => startEditing(row.id, col.id)
                  : undefined
              }
            >
              {editing && editCell ? (
                cloneElement(editCell, {
                  value: row.getValue(col.id),
                  onCommit: (v: unknown) => commitEdit(row, col.id, v),
                  onCancel: () => stopEditing(row.id, col.id),
                })
              ) : (
                flexRender(col.columnDef.cell, cell.getContext())
              )}
            </CellComp>
          )
        })}
      </RowComp>

      {hasExpansion && row.getIsExpanded() && (
        <RowComp key={`${row.id}-sub`}>
          <CellComp
            colSpan={columns.length + 1}
            className="bg-muted/30 p-0"
          >
            {renderSubRow(row)}
          </CellComp>
        </RowComp>
      )}
    </Fragment>
  )

  return (
    <div ref={containerRef} className={cn('flex flex-col gap-2', className)}>

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

      {/*
        TableWrapper doubles as the virtual scroll container when virtual is set.
        Passing ref + height turns it into the scroll element tracked by useVirtualizer.
        overflow-auto is already part of TableWrapper's base styles.
      */}
      <TableWrapper
        ref={virtual ? scrollRef : undefined}
        style={virtual ? { height: virtual.height } : undefined}
      >
        <TableRoot>
          <TableHeader sticky={stickyHeader}>

            {/* ── Column headers ──────────────────────────────────────────── */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                          onSort={(e) => col.getToggleSortingHandler()?.(e)}
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

          <TableBody onKeyDown={enableKeyboardNavigation ? handleBodyKeyDown : undefined}>
            {rows.length === 0 ? (
              <RowComp>
                <CellComp
                  colSpan={columns.length + (hasExpansion ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </CellComp>
              </RowComp>
            ) : virtual ? (
              // ── Virtual rendering path ───────────────────────────────────
              // Only the rows currently in the viewport are mounted.
              // Padding rows above and below preserve scrollbar accuracy.
              <>
                {paddingTop > 0 && (
                  <tr aria-hidden><td style={{ height: paddingTop }} /></tr>
                )}
                {virtualItems.map((vRow) => renderRow(rows[vRow.index]))}
                {paddingBottom > 0 && (
                  <tr aria-hidden><td style={{ height: paddingBottom }} /></tr>
                )}
              </>
            ) : (
              // ── Standard rendering path ──────────────────────────────────
              rows.map(renderRow)
            )}
          </TableBody>
        </TableRoot>
      </TableWrapper>

      {/* ── Pagination (opt-in, hidden during infinite scroll) ──────────────── */}
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
