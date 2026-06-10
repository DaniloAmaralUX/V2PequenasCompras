import { useMemo, useState } from 'react'
import { Lock, Search as SearchIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type TimelineKind } from '@/features/purchase-requests/data/derive'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageTransition } from '@/components/layout/page-transition'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { AuditTimeline } from './components/audit-timeline'
import {
  auditOriginOrder,
  auditOrigins,
  useAuditEvents,
} from './data/audit-events'

export function Audit() {
  const allEvents = useAuditEvents()
  const [query, setQuery] = useState('')
  const [origins, setOrigins] = useState<Set<TimelineKind>>(new Set())

  const toggleOrigin = (kind: TimelineKind) =>
    setOrigins((prev) => {
      const next = new Set(prev)
      if (next.has(kind)) next.delete(kind)
      else next.add(kind)
      return next
    })

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const e of allEvents) c[e.kind] = (c[e.kind] ?? 0) + 1
    return c
  }, [allEvents])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allEvents.filter((e) => {
      if (origins.size > 0 && !origins.has(e.kind)) return false
      if (!q) return true
      return (
        e.requestCode.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        e.requestDescription.toLowerCase().includes(q) ||
        (e.detail?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [allEvents, query, origins])

  const hasFilters = query.trim() !== '' || origins.size > 0
  const clear = () => {
    setQuery('')
    setOrigins(new Set())
  }

  return (
    <PageTransition>
      <Header fixed>
        <div className='me-auto flex items-center gap-2 text-sm text-muted-foreground'>
          <Lock className='size-3.5' />
          Trilha somente leitura
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Auditoria</h2>
          <p className='text-muted-foreground'>
            Reconstrua o processo: eventos cronológicos de pessoas e automações,
            sem editar nem excluir.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trilha de eventos</CardTitle>
            <CardDescription>
              {filtered.length === allEvents.length
                ? `${allEvents.length} eventos registrados.`
                : `${filtered.length} de ${allEvents.length} eventos.`}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            {/* Filtros */}
            <div className='flex flex-col gap-3'>
              <div className='relative'>
                <SearchIcon className='absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Buscar por código, ação, responsável ou detalhe…'
                  className='ps-9'
                  aria-label='Buscar na trilha de auditoria'
                />
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                {auditOriginOrder.map((kind) => {
                  const origin = auditOrigins[kind]
                  const Icon = origin.icon
                  const active = origins.has(kind)
                  return (
                    <Button
                      key={kind}
                      type='button'
                      size='sm'
                      variant={active ? 'default' : 'outline'}
                      onClick={() => toggleOrigin(kind)}
                      aria-pressed={active}
                      className='gap-1.5'
                    >
                      <Icon className='size-3.5' />
                      {origin.label}
                      <span
                        className={cn(
                          'tabular-nums',
                          active
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground'
                        )}
                      >
                        {counts[kind] ?? 0}
                      </span>
                    </Button>
                  )
                })}
                {hasFilters && (
                  <Button
                    type='button'
                    size='sm'
                    variant='ghost'
                    onClick={clear}
                    className='gap-1.5 text-muted-foreground'
                  >
                    <X className='size-3.5' />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Resultado */}
            {filtered.length > 0 ? (
              <AuditTimeline entries={filtered} />
            ) : (
              <div className='flex flex-col items-center justify-center gap-1 py-12 text-center'>
                <p className='text-sm font-medium'>
                  Nenhum evento para os filtros aplicados.
                </p>
                <p className='text-sm text-muted-foreground'>
                  Ajuste a busca ou a origem para ver outros eventos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className='text-xs text-muted-foreground'>
          Hipótese — a confirmar com o SESI (DEC-09): perfis de acesso, prazo de
          retenção e exportação da trilha. Exportação fora do MVP por padrão.
        </p>
      </Main>
    </PageTransition>
  )
}
