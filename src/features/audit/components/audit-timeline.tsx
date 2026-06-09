import { Link } from '@tanstack/react-router'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { formatDate } from '@/features/purchase-requests/lib/format'
import { type AuditEntry, auditOrigins } from '../data/audit-events'

type AuditTimelineProps = {
  entries: AuditEntry[]
}

/**
 * Trilha de auditoria cronológica (somente leitura). Cada evento é colapsável
 * (Enter/Espaço) e revela origem, detalhe e o vínculo com a solicitação.
 * Eventos automáticos exibem a origem real — nunca como ação de pessoa.
 */
export function AuditTimeline({ entries }: AuditTimelineProps) {
  // Agrupa por data para uma leitura cronológica clara.
  const groups = entries.reduce<Record<string, AuditEntry[]>>((acc, e) => {
    const day = e.at.slice(0, 10)
    ;(acc[day] ??= []).push(e)
    return acc
  }, {})

  return (
    <div className='stagger-list space-y-6'>
      {Object.entries(groups).map(([day, dayEntries]) => (
        <div key={day}>
          <p className='mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
            {formatDate(day)}
          </p>
          <ol className='relative ms-2 space-y-2 border-s ps-5'>
            {dayEntries.map((e) => (
              <AuditEventItem key={e.id} entry={e} />
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

function AuditEventItem({ entry }: { entry: AuditEntry }) {
  const origin = auditOrigins[entry.kind]
  const Icon = origin.icon

  return (
    <li className='relative'>
      <span className='absolute -start-[1.7rem] flex size-6 items-center justify-center rounded-full border bg-background'>
        <Icon className='size-3 text-muted-foreground' />
      </span>
      <Collapsible className='group'>
        <CollapsibleTrigger className='flex w-full items-start justify-between gap-2 rounded-md p-2 text-start transition-colors duration-150 hover:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none'>
          <div className='min-w-0 space-y-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-sm font-medium'>{entry.action}</span>
              <Badge variant='outline' className='font-normal'>
                {origin.label}
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground'>
              {entry.requestCode} · {entry.actor}
            </p>
          </div>
          <ChevronRight className='mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90' />
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <div className='space-y-2 px-2 pt-1 pb-2 text-sm'>
            <p className='text-muted-foreground'>
              {entry.requestDescription}
            </p>
            {entry.detail && (
              <p className='rounded-md bg-muted/60 p-2 text-foreground'>
                {entry.detail}
              </p>
            )}
            <Link
              to='/solicitacoes/$id'
              params={{ id: entry.requestId }}
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium text-primary',
                'hover:underline'
              )}
            >
              Abrir solicitação
              <ExternalLink className='size-3' />
            </Link>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}
