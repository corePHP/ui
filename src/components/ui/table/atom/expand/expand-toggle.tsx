import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const expandToggleVariants = cva(
  [
    'inline-flex items-center justify-center rounded transition-transform',
    'text-muted-foreground hover:text-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ],
  {
    variants: {
      expanded: {
        true: 'rotate-90',
        false: 'rotate-0',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
      },
    },
    defaultVariants: {
      expanded: false,
      size: 'sm',
    },
  }
)

export interface ExpandToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof expandToggleVariants> {
  onToggle?: () => void
}

const ExpandToggle = forwardRef<HTMLButtonElement, ExpandToggleProps>(
  ({ className, expanded, size, onToggle, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={expanded ? 'Collapse row' : 'Expand row'}
      aria-expanded={expanded ?? false}
      onClick={onToggle}
      className={cn(expandToggleVariants({ expanded, size }), className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-full w-full"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  )
)

ExpandToggle.displayName = 'ExpandToggle'

export { ExpandToggle, expandToggleVariants }
