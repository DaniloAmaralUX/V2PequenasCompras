import { Link } from '@tanstack/react-router'
import { ArrowRight, Plus } from 'lucide-react'
import { roleLabels } from '@/config/roles'
import { useMockRoleStore } from '@/stores/mock-role-store'
import { Button } from '@/components/ui/button'
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
import { StatusBadge } from '@/features/purchase-requests/components/status-badge'
import { formatBRL } from '@/features/purchase-requests/lib/format'
import { type Kpi, getKpis, getPriority } from './data/kpis'

export function Dashboard() {
  const role = useMockRoleStore((s) => s.role)
  const kpis = getKpis(role)
  const priority = getPriority(role)

  return (
    <PageTransition>
      <Header fixed>
        <div className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Visão geral</h2>
            <p className='text-muted-foreground'>
              {roleLabels[role].label} — acompanhe a rotina de pequenas compras.
            </p>
          </div>
          <Button asChild>
            <Link to='/solicitacoes/nova'>
              <Plus />
              Nova solicitação
            </Link>
          </Button>
        </div>

        <div className='stagger-list grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{priority.title}</CardTitle>
            <CardDescription>{priority.description}</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            {priority.requests.length ? (
              <div className='stagger-list flex flex-col gap-0.5'>
                {priority.requests.slice(0, 6).map((r) => (
                  <Link
                    key={r.id}
                    to='/solicitacoes/$id'
                    params={{ id: r.id }}
                    className='flex items-center justify-between gap-3 rounded-md p-2 transition-colors duration-150 hover:bg-accent/60'
                  >
                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='font-medium'>{r.code}</span>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className='truncate text-sm text-muted-foreground'>
                        {r.description}
                      </p>
                    </div>
                    <span className='shrink-0 text-sm font-medium tabular-nums'>
                      {formatBRL(r.totalValue)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-1 py-8 text-center'>
                <p className='text-sm text-muted-foreground'>
                  Nada pendente para o seu perfil agora.
                </p>
              </div>
            )}
            {priority.requests.length > 0 && (
              <Link
                to='/solicitacoes'
                className='mt-2 flex items-center gap-1 self-end text-sm font-medium text-primary hover:underline'
              >
                Ver todas as solicitações
                <ArrowRight className='size-4' />
              </Link>
            )}
          </CardContent>
        </Card>
      </Main>
    </PageTransition>
  )
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon
  const card = (
    <Card className='h-full transition-colors hover:bg-accent/40'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{kpi.label}</CardTitle>
        <Icon className='size-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold tabular-nums'>{kpi.value}</div>
        <p className='text-xs text-muted-foreground'>{kpi.hint}</p>
      </CardContent>
    </Card>
  )

  return (
    <Link
      to='/solicitacoes'
      search={kpi.statusFilter ? { status: kpi.statusFilter } : {}}
      className='block'
    >
      {card}
    </Link>
  )
}
