import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const sortIndicatorVariants = cva(
  'inline-flex shrink-0 text-muted-foreground transition-transform',
  {
    variants: {
      direction: {
        asc: 'rotate-0',
        desc: 'rotate-180',
        none: 'opacity-0 group-hover:opacity-50',
      },
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
      },
    },
    defaultVariants: {
      direction: 'none',
      size: 'md',
    },
  }
)

// Omit SVG 'direction' attribute — conflicts with our CVA direction variant union
export interface SortIndicatorProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'direction'>,
    VariantProps<typeof sortIndicatorVariants> {}

const SortIndicator = forwardRef<SVGSVGElement, SortIndicatorProps>(
  ({ className, direction, size, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(sortIndicatorVariants({ direction, size }), className)}
      {...props}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  )
)

SortIndicator.displayName = 'SortIndicator'

export { SortIndicator, sortIndicatorVariants }
