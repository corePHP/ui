import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within, fn } from 'storybook/test'
import { DataTable } from './organism/data-table'
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnVisibilityState,
  ExpandedState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
} from './organism/data-table.types'

// ─── Types ────────────────────────────────────────────────────────────────────

type User = {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

type UserTableProps = Parameters<typeof DataTable<User>>[0]

// ─── Sample data ──────────────────────────────────────────────────────────────

const USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'active' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'Admin', status: 'active' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', role: 'Viewer', status: 'inactive' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'Editor', status: 'active' },
  { id: 8, name: 'Henry Davis', email: 'henry@example.com', role: 'Viewer', status: 'active' },
]

// ─── Column definitions ───────────────────────────────────────────────────────

const BASE_COLUMNS: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
]

// All columns sortable except Status
const SORTABLE_COLUMNS: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'email', header: 'Email', enableSorting: true },
  { accessorKey: 'role', header: 'Role', enableSorting: true },
  { accessorKey: 'status', header: 'Status', enableSorting: false },
]

// Name and Role expose filter inputs; Email and Status do not
const FILTERABLE_COLUMNS: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name', enableColumnFilter: true },
  { accessorKey: 'email', header: 'Email', enableColumnFilter: false },
  { accessorKey: 'role', header: 'Role', enableColumnFilter: true },
  { accessorKey: 'status', header: 'Status', enableColumnFilter: false },
]

// Adds a checkbox selection column before the base columns
const SELECTION_COLUMNS: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        ref={(el) => {
          if (el) el.indeterminate = table.getIsSomePageRowsSelected()
        }}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        aria-label={`Select row ${row.index + 1}`}
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  ...BASE_COLUMNS,
]

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<UserTableProps> = {
  title: 'UI/DataTable',
  component: DataTable as React.ComponentType<UserTableProps>,
  tags: ['autodocs'],
  args: {
    columns: BASE_COLUMNS,
    data: USERS,
  },
}

export default meta
type Story = StoryObj<UserTableProps>

// ─── Rendering ────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Render — Default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // All column headers present
    await expect(canvas.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    await expect(canvas.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument()
    await expect(canvas.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument()
    await expect(canvas.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument()

    // Data rows present
    await expect(canvas.getByText('Alice Johnson')).toBeInTheDocument()
    await expect(canvas.getByText('bob@example.com')).toBeInTheDocument()
    await expect(canvas.getByText('inactive')).toBeInTheDocument()
  },
}

export const EmptyState: Story = {
  name: 'Render — Empty state',
  args: {
    data: [],
    emptyMessage: 'No users found.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('No users found.')).toBeInTheDocument()

    // Only header row + single empty-state row
    const rows = canvas.getAllByRole('row')
    await expect(rows).toHaveLength(2)
  },
}

export const StickyHeader: Story = {
  name: 'Render — Sticky header',
  decorators: [
    (Story) => (
      <div className="h-48 overflow-auto rounded-md border border-border">
        <Story />
      </div>
    ),
  ],
  args: {
    data: [...USERS, ...USERS],
    stickyHeader: true,
  },
}

// ─── Callback — Sorting ───────────────────────────────────────────────────────

export const SortingCallback: Story = {
  name: 'Callback — Sorting',
  args: {
    columns: SORTABLE_COLUMNS,
    sorting: [],
    onSortingChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Name column renders a sort button because enableSorting: true
    const nameBtn = canvas.getByRole('button', { name: 'Name' })
    await userEvent.click(nameBtn)

    await expect(args.onSortingChange).toHaveBeenCalledOnce()
    // First click → ascending
    await expect(args.onSortingChange).toHaveBeenCalledWith([
      { id: 'name', desc: false },
    ])
  },
}

export const SortingDescCallback: Story = {
  name: 'Callback — Sorting (already asc → flip to desc)',
  args: {
    columns: SORTABLE_COLUMNS,
    // Seed with ascending sort on name
    sorting: [{ id: 'name', desc: false }] as SortingState,
    onSortingChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const nameBtn = canvas.getByRole('button', { name: 'Name' })
    await userEvent.click(nameBtn)

    await expect(args.onSortingChange).toHaveBeenCalledOnce()
    await expect(args.onSortingChange).toHaveBeenCalledWith([
      { id: 'name', desc: true },
    ])
  },
}

// ─── Callback — Filtering ─────────────────────────────────────────────────────

export const FilteringCallback: Story = {
  name: 'Callback — Filtering',
  args: {
    columns: FILTERABLE_COLUMNS,
    columnFilters: [],
    onColumnFiltersChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Filter row is rendered because onColumnFiltersChange is provided
    const nameInput = canvas.getByRole('textbox', { name: 'Filter by name' })
    await userEvent.type(nameInput, 'A')

    // Callback fires with the typed character as filter value
    await expect(args.onColumnFiltersChange).toHaveBeenCalledWith([
      { id: 'name', value: 'A' },
    ])
  },
}

export const FilterClearCallback: Story = {
  name: 'Callback — Filter cleared',
  args: {
    columns: FILTERABLE_COLUMNS,
    // Start with an active filter
    columnFilters: [{ id: 'name', value: 'Alice' }] as ColumnFiltersState,
    onColumnFiltersChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // The input is seeded with the current filter value
    const nameInput = canvas.getByRole('textbox', { name: 'Filter by name' })
    await expect(nameInput).toHaveValue('Alice')

    // Clearing the input sets the filter value to undefined (empty string triggers removal)
    await userEvent.clear(nameInput)
    await expect(args.onColumnFiltersChange).toHaveBeenLastCalledWith([])
  },
}

// ─── Callback — Pagination ────────────────────────────────────────────────────

export const PaginationNextCallback: Story = {
  name: 'Callback — Next page',
  args: {
    pagination: { pageIndex: 0, pageSize: 3 },
    onPaginationChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const nextBtn = canvas.getByRole('button', { name: 'Go to next page' })
    await userEvent.click(nextBtn)

    await expect(args.onPaginationChange).toHaveBeenCalledOnce()
    await expect(args.onPaginationChange).toHaveBeenCalledWith({
      pageIndex: 1,
      pageSize: 3,
    })
  },
}

export const PaginationLastCallback: Story = {
  name: 'Callback — Last page',
  args: {
    pagination: { pageIndex: 0, pageSize: 3 },
    onPaginationChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const lastBtn = canvas.getByRole('button', { name: 'Go to last page' })
    await userEvent.click(lastBtn)

    await expect(args.onPaginationChange).toHaveBeenCalledOnce()
    // 8 users / 3 per page = ceil = 3 pages; last page index is 2
    await expect(args.onPaginationChange).toHaveBeenCalledWith({
      pageIndex: 2,
      pageSize: 3,
    })
  },
}

export const PaginationFirstDisabledOnFirstPage: Story = {
  name: 'Callback — First/Prev disabled on page 1',
  args: {
    pagination: { pageIndex: 0, pageSize: 3 },
    onPaginationChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const firstBtn = canvas.getByRole('button', { name: 'Go to first page' })
    const prevBtn = canvas.getByRole('button', { name: 'Go to previous page' })

    await expect(firstBtn).toBeDisabled()
    await expect(prevBtn).toBeDisabled()

    await userEvent.click(firstBtn, { pointerEventsCheck: 0 })
    await userEvent.click(prevBtn, { pointerEventsCheck: 0 })
    await expect(args.onPaginationChange).not.toHaveBeenCalled()
  },
}

export const PageSizeCallback: Story = {
  name: 'Callback — Page size change',
  args: {
    pagination: { pageIndex: 2, pageSize: 3 },
    pageSizeOptions: [3, 5, 8],
    onPaginationChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const select = canvas.getByRole('combobox')
    await userEvent.selectOptions(select, '5')

    await expect(args.onPaginationChange).toHaveBeenCalledOnce()
    // Changing page size resets to page 0
    await expect(args.onPaginationChange).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 5,
    })
  },
}

// ─── Callback — Row selection ─────────────────────────────────────────────────

export const RowSelectionCallback: Story = {
  name: 'Callback — Row selection',
  args: {
    columns: SELECTION_COLUMNS,
    rowSelection: {},
    onRowSelectionChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // checkboxes[0] = select-all in header; checkboxes[1] = first data row
    const checkboxes = canvas.getAllByRole('checkbox')
    await userEvent.click(checkboxes[1])

    await expect(args.onRowSelectionChange).toHaveBeenCalledOnce()
    await expect(args.onRowSelectionChange).toHaveBeenCalledWith({ '0': true })
  },
}

export const SelectAllCallback: Story = {
  name: 'Callback — Select all',
  args: {
    columns: SELECTION_COLUMNS,
    rowSelection: {},
    onRowSelectionChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const selectAll = canvas.getByRole('checkbox', { name: 'Select all rows' })
    await userEvent.click(selectAll)

    await expect(args.onRowSelectionChange).toHaveBeenCalledOnce()
    // All 8 rows selected
    const called = args.onRowSelectionChange as ReturnType<typeof fn>
    const result = called.mock.calls[0][0] as RowSelectionState
    await expect(Object.keys(result)).toHaveLength(USERS.length)
  },
}

// ─── Server-side (manual) ─────────────────────────────────────────────────────

export const ServerSide: Story = {
  name: 'Server-side (manual mode)',
  args: {
    columns: SORTABLE_COLUMNS,
    // Parent passes pre-sorted, pre-paginated data
    data: USERS.slice(0, 3),
    sorting: [{ id: 'name', desc: false }] as SortingState,
    onSortingChange: fn(),
    pagination: { pageIndex: 0, pageSize: 3 } as PaginationState,
    onPaginationChange: fn(),
    pageCount: 3,
    pageSizeOptions: [3, 5],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Only the 3 pre-sliced rows are shown (TanStack does not re-paginate)
    const rows = canvas.getAllByRole('row')
    // 1 header row + 3 data rows (no filter row since onColumnFiltersChange absent)
    await expect(rows).toHaveLength(4)

    // Clicking next page calls onPaginationChange — parent is responsible for
    // fetching page 2 and passing new data
    const nextBtn = canvas.getByRole('button', { name: 'Go to next page' })
    await userEvent.click(nextBtn)
    await expect(args.onPaginationChange).toHaveBeenCalledWith({
      pageIndex: 1,
      pageSize: 3,
    })

    // Clicking a sort header notifies the parent to re-fetch with new sort
    const emailBtn = canvas.getByRole('button', { name: 'Email' })
    await userEvent.click(emailBtn)
    await expect(args.onSortingChange).toHaveBeenCalledOnce()
    await expect(args.onSortingChange).toHaveBeenCalledWith([
      { id: 'email', desc: false },
    ])
  },
}

// ─── Callback — Multi-sort ────────────────────────────────────────────────────

export const MultiSortCallback: Story = {
  name: 'Callback — Multi-sort (shift+click)',
  args: {
    columns: SORTABLE_COLUMNS,
    sorting: [{ id: 'name', desc: false }] as SortingState,
    onSortingChange: fn(),
    enableMultiSort: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Shift+click Email adds it as secondary sort
    const emailBtn = canvas.getByRole('button', { name: 'Email' })
    await userEvent.keyboard('[ShiftLeft>]')
    await userEvent.click(emailBtn)
    await userEvent.keyboard('[/ShiftLeft]')

    await expect(args.onSortingChange).toHaveBeenCalledOnce()
    await expect(args.onSortingChange).toHaveBeenCalledWith([
      { id: 'name', desc: false },
      { id: 'email', desc: false },
    ])
  },
}

export const MultiSortDisabledCallback: Story = {
  name: 'Callback — Multi-sort disabled (shift+click has no effect)',
  args: {
    columns: SORTABLE_COLUMNS,
    sorting: [{ id: 'name', desc: false }] as SortingState,
    onSortingChange: fn(),
    enableMultiSort: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Shift+click should replace, not accumulate
    const emailBtn = canvas.getByRole('button', { name: 'Email' })
    await userEvent.keyboard('[ShiftLeft>]')
    await userEvent.click(emailBtn)
    await userEvent.keyboard('[/ShiftLeft]')

    await expect(args.onSortingChange).toHaveBeenCalledOnce()
    // Only email — name was replaced
    await expect(args.onSortingChange).toHaveBeenCalledWith([
      { id: 'email', desc: false },
    ])
  },
}

// ─── Callback — Global filter ─────────────────────────────────────────────────

export const GlobalFilterCallback: Story = {
  name: 'Callback — Global filter',
  args: {
    globalFilter: '',
    onGlobalFilterChange: fn(),
    globalFilterPlaceholder: 'Search all columns…',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByPlaceholderText('Search all columns…')
    await userEvent.type(input, 'A')

    await expect(args.onGlobalFilterChange).toHaveBeenCalledWith('A')
  },
}

export const GlobalFilterClearCallback: Story = {
  name: 'Callback — Global filter cleared',
  args: {
    globalFilter: 'Alice',
    onGlobalFilterChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: 'Filter' })
    await expect(input).toHaveValue('Alice')

    await userEvent.clear(input)
    await expect(args.onGlobalFilterChange).toHaveBeenLastCalledWith('')
  },
}

// ─── Callback — Column visibility ─────────────────────────────────────────────

export const ColumnVisibilityCallback: Story = {
  name: 'Callback — Column visibility (hide)',
  args: {
    columnVisibility: {} as ColumnVisibilityState,
    onColumnVisibilityChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Toggle off the Email column
    const emailToggle = canvas.getByRole('checkbox', { name: 'Toggle Email column' })
    await expect(emailToggle).toBeChecked()

    await userEvent.click(emailToggle)

    await expect(args.onColumnVisibilityChange).toHaveBeenCalledOnce()
    await expect(args.onColumnVisibilityChange).toHaveBeenCalledWith(
      expect.objectContaining({ email: false })
    )
  },
}

export const ColumnVisibilityRestoreCallback: Story = {
  name: 'Callback — Column visibility (restore)',
  args: {
    // Email is hidden initially
    columnVisibility: { email: false } as ColumnVisibilityState,
    onColumnVisibilityChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Email column header should not be in the DOM
    await expect(canvas.queryByRole('columnheader', { name: 'Email' })).not.toBeInTheDocument()

    // Toggle it back on
    const emailToggle = canvas.getByRole('checkbox', { name: 'Toggle Email column' })
    await expect(emailToggle).not.toBeChecked()

    await userEvent.click(emailToggle)

    await expect(args.onColumnVisibilityChange).toHaveBeenCalledWith(
      expect.objectContaining({ email: true })
    )
  },
}

// ─── Callback — Row expansion ─────────────────────────────────────────────────

const COLUMNS_WITH_SUBROWS: ColumnDef<User>[] = BASE_COLUMNS.map((col) => ({
  ...col,
  // getSubRows requires rows to declare sub-rows; we simulate via meta
}))

const renderUserDetail = (row: Row<User>) => (
  <div className="px-8 py-4 text-sm text-muted-foreground">
    <strong>Details for {row.original.name}</strong>
    <p>ID: {row.original.id} · Status: {row.original.status}</p>
  </div>
)

export const RowExpansionCallback: Story = {
  name: 'Callback — Row expansion',
  args: {
    columns: COLUMNS_WITH_SUBROWS,
    expanded: {} as ExpandedState,
    onExpandedChange: fn(),
    renderSubRow: renderUserDetail,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Every row has an expand toggle (no sub-rows in data, but getCanExpand
    // returns true when renderSubRow is present)
    const toggles = canvas.getAllByRole('button', { name: 'Expand row' })
    await expect(toggles.length).toBeGreaterThan(0)

    await userEvent.click(toggles[0])

    await expect(args.onExpandedChange).toHaveBeenCalledOnce()
    // Row 0 expanded
    await expect(args.onExpandedChange).toHaveBeenCalledWith(
      expect.objectContaining({ '0': true })
    )
  },
}

export const RowExpansionCollapseCallback: Story = {
  name: 'Callback — Row expansion (collapse)',
  args: {
    columns: COLUMNS_WITH_SUBROWS,
    // Row 0 starts expanded
    expanded: { '0': true } as ExpandedState,
    onExpandedChange: fn(),
    renderSubRow: renderUserDetail,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Sub-row content is visible
    await expect(canvas.getByText(/Details for Alice Johnson/)).toBeInTheDocument()

    // Collapse button shows "Collapse row" label
    const collapseBtn = canvas.getByRole('button', { name: 'Collapse row' })
    await userEvent.click(collapseBtn)

    await expect(args.onExpandedChange).toHaveBeenCalledWith(
      expect.objectContaining({ '0': false })
    )
  },
}
