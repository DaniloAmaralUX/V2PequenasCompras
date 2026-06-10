import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageTransition } from '@/components/layout/page-transition'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConformityBadge } from '@/features/purchase-requests/components/status-badge'
import { useRequests } from '@/features/purchase-requests/data/use-requests'
import { formatBRL, waitingLabel } from '@/features/purchase-requests/lib/format'

export function Approvals() {
  const queue = useRequests().filter((r) => r.status === 'awaiting_approval')

  return (
    <PageTransition>
      <Header fixed>
        <div className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Aprovações</h2>
          <p className='text-muted-foreground'>
            Solicitações aguardando sua decisão. Abra para revisar e decidir.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aguardando sua decisão</CardTitle>
            <CardDescription>
              {queue.length === 1
                ? '1 solicitação na fila.'
                : `${queue.length} solicitações na fila.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {queue.length ? (
              <div className='stagger-list flex flex-col divide-y'>
                {queue.map((r) => (
                  <Link
                    key={r.id}
                    to='/solicitacoes/$id'
                    params={{ id: r.id }}
                    search={{ tab: 'aprovacao' }}
                    className='-mx-2 flex flex-wrap items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors duration-150 hover:bg-accent/60'
                  >
                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='font-medium'>{r.code}</span>
                        <ConformityBadge conformity={r.conformity} />
                      </div>
                      <p className='truncate text-sm text-muted-foreground'>
                        {r.description}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {r.requester.name} · {r.unit} · aguardando{' '}
                        {waitingLabel(r.createdAt)}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='font-medium tabular-nums'>
                        {formatBRL(r.totalValue)}
                      </span>
                      <ArrowRight className='size-4 text-muted-foreground' />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-1 py-10 text-center'>
                <p className='text-sm text-muted-foreground'>
                  Nada aguardando sua decisão agora.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Main>
    </PageTransition>
  )
}
