import { forwardRef, useRef } from 'react'
import { cn } from '@/lib/utils'

// ─── CellEditor ───────────────────────────────────────────────────────────────
//
// Uncontrolled input rendered in-place when a cell enters edit mode.
// Auto-focuses and selects all text on mount (AG Grid UX convention).
//
// Commit triggers: Enter key, Tab key, blur
// Cancel trigger:  Escape key

export interface CellEditorProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'defaultValue' | 'onBlur' | 'onKeyDown'
  > {
  defaultValue: string
  onCommit: (value: string) => void
  onCancel: () => void
}

const CellEditor = forwardRef<HTMLInputElement, CellEditorProps>(
  ({ defaultValue, onCommit, onCancel, className, ...props }, ref) => {
    // Guard against double-commit when Enter blurs the input immediately after
    const committed = useRef(false)

    const commit = (value: string) => {
      if (committed.current) return
      committed.current = true
      onCommit(value)
    }

    const cancel = () => {
      if (committed.current) return
      committed.current = true
      onCancel()
    }

    return (
      <input
        ref={ref}
        type="text"
        // Uncontrolled — value lives in DOM, read on commit
        defaultValue={defaultValue}
        // autoFocus focuses the element; select() via onFocus selects all text
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
        className={cn(
          'w-full rounded-sm border-none bg-transparent outline-none',
          'ring-2 ring-primary ring-offset-1',
          'text-sm text-foreground',
          className
        )}
        {...props}
      />
    )
  }
)

CellEditor.displayName = 'CellEditor'

export { CellEditor }
