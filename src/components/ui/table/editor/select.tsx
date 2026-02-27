import { useRef, forwardRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CellEditorInjectedProps } from '../organism/data-table.types'

// ─── SelectEditor ─────────────────────────────────────────────────────────────
//
// Composes shadcn's Select (Radix portal) for in-cell single-value selection.
// Commits immediately when the user picks an option.
// Closing without selecting (Escape, click outside) triggers onCancel.
//
// Usage in column definition:
//
//   editCell: <SelectEditor options={ROLE_OPTIONS} />

export interface SelectOption {
  value: string
  label: string
}

export interface SelectEditorProps extends CellEditorInjectedProps {
  options: SelectOption[]
}

const SelectEditor = forwardRef<HTMLButtonElement, SelectEditorProps>(
  ({ value, onCommit, onCancel, options }, ref) => {
    const committed = useRef(false)

    return (
      <Select
        defaultValue={String(value ?? '')}
        onValueChange={(v) => {
          committed.current = true
          onCommit?.(v)
        }}
        onOpenChange={(open) => {
          // Closed without picking a value → cancel
          if (!open && !committed.current) onCancel?.()
        }}
      >
        <SelectTrigger ref={ref} autoFocus className="h-auto border-0 shadow-none ring-2 ring-primary ring-offset-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)

SelectEditor.displayName = 'SelectEditor'

export { SelectEditor }
