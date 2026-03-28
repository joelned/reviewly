import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:bg-primary/90',
        secondary:
          'bg-mutedSurface text-foreground hover:-translate-y-0.5 hover:border-border hover:bg-mutedSurface/90',
        outline:
          'border-border bg-transparent text-foreground hover:border-primary/40 hover:bg-primary/10',
        ghost: 'text-foreground hover:bg-mutedSurface',
        destructive:
          'bg-destructive text-white hover:-translate-y-0.5 hover:bg-destructive/90',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 rounded-xl p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

