import { CheckCircle2, Cog, RefreshCw, ServerCog } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useMockRoleStore } from '@/stores/mock-role-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageTransition } from '@/components/layout/page-transition'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { formatDate } from '@/features/purchase-requests/lib/format'
import {
  type Integration,
  type SapAttempt,
  mockIntegrations,
  mockSapAttempts,
  statusMeta,
} from './data/integrations'

const toneClass = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  success:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  warning:
    'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
} as const

const attemptMeta = {
  success: { label: 'Sucesso', tone: 'success' as const },
  error: { label: 'Erro', tone: 'danger' as const },
  processing: { label: 'Processando', tone: 'info' as const },
}

export function AdminIntegrations() {
  const role = useMockRoleStore((s) => s.role)
  const isTi = role === 'ti'

  return (
    <PageTransition>
      <Header fixed>
        <div className='me-auto flex items-center gap-2 text-sm text-muted-foreground'>
          <ServerCog className='size-3.5' />
          {isTi ? 'TI — operação' : 'Somente leitura'}
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Administração — Integrações
          </h2>
          <p className='text-muted-foreground'>
            Saúde conceitual das integrações. O reprocessamento fica disponível ao
            perfil de TI quando há erro.
          </p>
        </div>

        <div className='stagger-list grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {mockIntegrations.map((it) => (
            <IntegrationCard key={it.id} integration={it} canReprocess={isTi} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Cog className='size-4' />
              Últimas tentativas de integração (SAP)
            </CardTitle>
            <CardDescription>
              Registro técnico em linguagem de negócio — sem código, payload ou
              endpoint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitação</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Detalhe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSapAttempts.map((a) => (
                  <AttemptRow key={a.id} attempt={a} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Main>
    </PageTransition>
  )
}

function IntegrationCard({
  integration,
  canReprocess,
}: {
  integration: Integration
  canReprocess: boolean
}) {
  const meta = statusMeta[integration.status]
  const showReprocess = canReprocess && integration.reprocessable

  const handleReprocess = () =>
    toast.success('Reprocessamento solicitado.', {
      description: `${integration.name} — as tentativas pendentes entram na próxima janela.`,
    })

  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <div className='flex items-center justify-between gap-2'>
          <CardTitle className='text-base'>{integration.name}</CardTitle>
          <Badge className={cn('gap-1', toneClass[meta.tone])}>
            {integration.status === 'operational' ? (
              <CheckCircle2 className='size-3' />
            ) : null}
            {meta.label}
          </Badge>
        </div>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>
      <CardContent className='mt-auto space-y-3'>
        <p className='text-sm text-muted-foreground'>{integration.message}</p>
        <div className='flex items-center justify-between gap-2'>
          <span className='text-xs text-muted-foreground'>
            Última verificação:{' '}
            {integration.lastCheck === '—'
              ? '—'
              : formatDate(integration.lastCheck)}
          </span>
          {showReprocess && (
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={handleReprocess}
              className='gap-1.5'
            >
              <RefreshCw className='size-3.5' />
              Reprocessar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AttemptRow({ attempt }: { attempt: SapAttempt }) {
  const meta = attemptMeta[attempt.result]
  return (
    <TableRow>
      <TableCell className='font-medium'>{attempt.requestCode}</TableCell>
      <TableCell>
        <Badge className={cn('font-normal', toneClass[meta.tone])}>
          {meta.label}
        </Badge>
      </TableCell>
      <TableCell className='whitespace-nowrap'>
        {formatDate(attempt.at)}
      </TableCell>
      <TableCell className='text-muted-foreground'>{attempt.detail}</TableCell>
    </TableRow>
  )
}
