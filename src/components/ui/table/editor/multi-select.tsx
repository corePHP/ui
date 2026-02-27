import { forwardRef, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { CellEditorInjectedProps } from '../organism/data-table.types'

// ─── MultiSelectEditor ────────────────────────────────────────────────────────
//
// Composes shadcn's Checkbox for in-cell multi-value selection.
// Requires an explicit commit — the user toggles checkboxes then presses Enter.
//
// Usage in column definition:
//
//   editCell: <MultiSelectEditor options={PERMISSION_OPTIONS} />
//
// Commit trigger: Enter
// Cancel trigger: Escape

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectEditorProps extends CellEditorInjectedProps {
  options: MultiSelectOption[]
  className?: string
}

const MultiSelectEditor = forwardRef<HTMLDivElement, MultiSelectEditorProps>(
  ({ value, onCommit, onCancel, options, className }, ref) => {
    const initial = Array.isArray(value) ? (value as string[]) : []
    const [selected, setSelected] = useState<string[]>(initial)

    const toggle = (v: string, checked: boolean) =>
      setSelected((prev) => (checked ? [...prev, v] : prev.filter((x) => x !== v)))

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-2 py-0.5', className)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onCommit?.(selected)
          } else if (e.key === 'Escape') {
            e.preventDefault()
            onCancel?.()
          }
        }}
      >
        {options.map((opt, i) => (
          <div key={opt.value} className="flex items-center gap-2">
            <Checkbox
              id={`multi-editor-${opt.value}`}
              checked={selected.includes(opt.value)}
              autoFocus={i === 0}
              onCheckedChange={(checked) => toggle(opt.value, checked === true)}
            />
            <Label htmlFor={`multi-editor-${opt.value}`} className="cursor-pointer font-normal">
              {opt.label}
            </Label>
          </div>
        ))}
      </div>
    )
  }
)

MultiSelectEditor.displayName = 'MultiSelectEditor'

export { MultiSelectEditor }
