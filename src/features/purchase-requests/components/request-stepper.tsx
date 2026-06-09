import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type RequestStepperProps = {
  steps: string[]
  current: number
}

/** Indicador de etapas do formulário de Nova solicitação. */
export function RequestStepper({ steps, current }: RequestStepperProps) {
  return (
    <nav aria-label='Etapas da solicitação'>
      {/* Desktop / tablet */}
      <ol className='hidden items-center md:flex'>
        {steps.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <li
              key={label}
              className={cn('flex items-center gap-2', i < steps.length - 1 && 'flex-1')}
            >
              <span
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary text-primary',
                  !done && !active && 'text-muted-foreground'
                )}
              >
                {done ? <CheckIcon className='size-4' /> : i + 1}
              </span>
              <span
                className={cn(
                  'whitespace-nowrap text-sm',
                  active ? 'font-medium' : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <span className='mx-2 h-px flex-1 bg-border' />
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile */}
      <div className='md:hidden'>
        <p className='text-xs text-muted-foreground'>
          Etapa {current + 1} de {steps.length}
        </p>
        <p className='font-medium'>{steps[current]}</p>
      </div>
    </nav>
  )
}
