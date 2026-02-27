import { forwardRef, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CellEditorInjectedProps } from '../organism/data-table.types'

// ─── InputEditor ──────────────────────────────────────────────────────────────
//
// Composes shadcn's Input for in-cell text editing.
// The organism injects `value`, `onCommit`, and `onCancel` via cloneElement.
//
// Usage in column definition:
//
//   editCell: <InputEditor />
//
// Commit triggers: Enter, Tab, blur
// Cancel trigger:  Escape

export interface InputEditorProps extends CellEditorInjectedProps {
  className?: string
}

const InputEditor = forwardRef<HTMLInputElement, InputEditorProps>(
  ({ value, onCommit, onCancel, className }, ref) => {
    // Guard against double-commit when Enter causes an immediate blur
    const committed = useRef(false)

    const commit = (val: string) => {
      if (committed.current) return
      committed.current = true
      onCommit?.(val)
    }

    const cancel = () => {
      if (committed.current) return
      committed.current = true
      onCancel?.()
    }

    return (
      <Input
        ref={ref}
        type="text"
        defaultValue={String(value ?? '')}
        autoFocus
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault()
            commit(e.currentTarget.value)
          } else if (e.key === 'Escape') {
            e.preventDefault()
            cancel()
          }
        }}
        onBlur={(e) => commit(e.target.value)}
        // Override Input's default border/padding to sit flush inside the cell
        className={cn(
          'h-auto border-0 bg-transparent px-0 py-0 shadow-none',
          'ring-2 ring-primary ring-offset-1',
          className
        )}
      />
    )
  }
)

InputEditor.displayName = 'InputEditor'

export { InputEditor }
