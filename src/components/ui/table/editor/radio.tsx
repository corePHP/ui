import { forwardRef } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { CellEditorInjectedProps } from '../organism/data-table.types'

// ─── RadioEditor ──────────────────────────────────────────────────────────────
//
// Composes shadcn's RadioGroup for in-cell single-value selection.
// Commits immediately when the user selects an option.
//
// Usage in column definition:
//
//   editCell: <RadioEditor options={STATUS_OPTIONS} />

export interface RadioOption {
  value: string
  label: string
}

export interface RadioEditorProps extends CellEditorInjectedProps {
  options: RadioOption[]
  className?: string
}

const RadioEditor = forwardRef<HTMLDivElement, RadioEditorProps>(
  ({ value, onCommit, onCancel, options, className }, ref) => (
    <RadioGroup
      ref={ref}
      defaultValue={String(value ?? '')}
      onValueChange={(v) => onCommit?.(v)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCancel?.()
        }
      }}
      className={cn('gap-1.5 py-0.5', className)}
    >
      {options.map((opt, i) => (
        <div key={opt.value} className="flex items-center gap-2">
          <RadioGroupItem
            value={opt.value}
            id={`radio-editor-${opt.value}`}
            autoFocus={i === 0}
          />
          <Label htmlFor={`radio-editor-${opt.value}`} className="cursor-pointer font-normal">
            {opt.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
)

RadioEditor.displayName = 'RadioEditor'

export { RadioEditor }
