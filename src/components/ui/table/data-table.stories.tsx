import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TableWrapper } from './atom/base/table-wrapper'
import { TableRoot } from './atom/base/table-root'
import { TableHeader } from './atom/base/table-header'
import { TableBody } from './atom/base/table-body'
import { TableFooter } from './atom/base/table-footer'
import { TableRow } from './atom/base/table-row'
import { TableHead } from './atom/base/table-head'
import { TableCell } from './atom/base/table-cell'
import { TableCaption } from './atom/base/table-caption'
import { ColumnHeader, type SortDirection } from './molecules/column-header'
import { FilterInput } from './molecules/filter-input'
import { Pagination } from './molecules/pagination'
import { FilterBadge } from './atom/filter/filter-badge'

// ─── Sample data ──────────────────────────────────────────────────────────────

type User = {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

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

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'UI/DataTable',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Atoms: Story = {
  name: 'Atoms — Basic table',
  render: () => (
    <TableWrapper>
      <TableRoot>
        <TableCaption>List of users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {USERS.slice(0, 5).map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell align="right">5 users</TableCell>
          </TableRow>
        </TableFooter>
      </TableRoot>
    </TableWrapper>
  ),
}

export const WithSort: Story = {
  name: 'Molecules — Sort',
  render: () => {
    const [sortCol, setSortCol] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<SortDirection>(false)

    const toggleSort = (col: string) => {
      if (sortCol !== col) {
        setSortCol(col)
        setSortDir('asc')
      } else if (sortDir === 'asc') {
        setSortDir('desc')
      } else {
        setSortCol(null)
        setSortDir(false)
      }
    }

    const sorted = (col: string): SortDirection =>
      sortCol === col ? sortDir : false

    const data = [...USERS].sort((a, b) => {
      if (!sortCol || !sortDir) return 0
      const key = sortCol as keyof User
      return sortDir === 'asc'
        ? String(a[key]).localeCompare(String(b[key]))
        : String(b[key]).localeCompare(String(a[key]))
    })

    return (
      <TableWrapper>
        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableHead>
                <ColumnHeader sortable sorted={sorted('name')} onSort={() => toggleSort('name')}>
                  Name
                </ColumnHeader>
              </TableHead>
              <TableHead>
                <ColumnHeader sortable sorted={sorted('email')} onSort={() => toggleSort('email')}>
                  Email
                </ColumnHeader>
              </TableHead>
              <TableHead>
                <ColumnHeader sortable sorted={sorted('role')} onSort={() => toggleSort('role')}>
                  Role
                </ColumnHeader>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </TableWrapper>
    )
  },
}

export const WithFilter: Story = {
  name: 'Molecules — Filter',
  render: () => {
    const [nameFilter, setNameFilter] = useState('')
    const [roleFilter, setRoleFilter] = useState('')

    const data = USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        u.role.toLowerCase().includes(roleFilter.toLowerCase())
    )

    const activeFilters = [nameFilter, roleFilter].filter(Boolean).length

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FilterInput
            value={nameFilter}
            onFilter={setNameFilter}
            column="name"
            className="max-w-48"
          />
          <FilterInput
            value={roleFilter}
            onFilter={setRoleFilter}
            column="role"
            className="max-w-36"
          />
          {activeFilters > 0 && (
            <FilterBadge count={activeFilters} />
          )}
        </div>
        <TableWrapper>
          <TableRoot>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </TableRoot>
        </TableWrapper>
      </div>
    )
  },
}

export const WithPagination: Story = {
  name: 'Molecules — Pagination',
  render: () => {
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(3)

    const pageCount = Math.ceil(USERS.length / pageSize)
    const paged = USERS.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

    return (
      <div className="space-y-2">
        <TableWrapper>
          <TableRoot>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </TableWrapper>
        <Pagination
          page={pageIndex + 1}
          pageCount={pageCount}
          pageSize={pageSize}
          totalRows={USERS.length}
          pageSizeOptions={[3, 5, 8]}
          onPageChange={(p) => setPageIndex(p - 1)}
          onPageSizeChange={(size) => { setPageSize(size); setPageIndex(0) }}
        />
      </div>
    )
  },
}

export const WithFrozenHeader: Story = {
  name: 'Atoms — Frozen header',
  render: () => (
    <div className="h-48 overflow-auto rounded-md border border-border">
      <TableWrapper>
        <TableRoot>
          <TableHeader sticky>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...USERS, ...USERS].map((user, i) => (
              <TableRow key={i}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </TableWrapper>
    </div>
  ),
}

export const WithFrozenColumn: Story = {
  name: 'Atoms — Frozen column',
  render: () => (
    <div className="w-80 overflow-auto rounded-md border border-border">
      <TableWrapper>
        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableHead frozen style={{ left: 0, minWidth: 140 }}>Name</TableHead>
              <TableHead style={{ minWidth: 200 }}>Email</TableHead>
              <TableHead style={{ minWidth: 160 }}>Role</TableHead>
              <TableHead style={{ minWidth: 120 }}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell frozen style={{ left: 0, minWidth: 140 }}>{user.name}</TableCell>
                <TableCell style={{ minWidth: 200 }}>{user.email}</TableCell>
                <TableCell style={{ minWidth: 160 }}>{user.role}</TableCell>
                <TableCell style={{ minWidth: 120 }}>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </TableWrapper>
    </div>
  ),
}
