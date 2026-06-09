import { cn } from '@/lib/utils'

type PageTransitionProps = {
  children: React.ReactNode
  className?: string
}

/** Wrapper de entrada de página — fade + slide sutil para eliminar o corte seco entre rotas. */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col animate-in fade-in-0 slide-in-from-bottom-2 duration-200',
        className
      )}
    >
      {children}
    </div>
  )
}
