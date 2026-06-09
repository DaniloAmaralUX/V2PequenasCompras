import { getRouteApi, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Ban,
  CircleCheck,
  Cpu,
  Database,
  Info,
  Scale,
  TriangleAlert,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMockRoleStore } from '@/stores/mock-role-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PlaceholderPage } from '@/components/layout/placeholder-page'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  type Severity,
  type TimelineKind,
  getSapState,
  getTimeline,
  getValidations,
  urgencyLabels,
} from '../data/derive'
import { mockRequests } from '../data/mock-requests'
import { formatBRL, formatDate } from '../lib/format'
import { ConformityBadge, StatusBadge } from './status-badge'

const route = getRouteApi('/_authenticated/solicitacoes/$id')

const sevMeta: Record<Severity, { icon: React.ElementType; className: string }> = {
  pass: { icon: CircleCheck, className: 'text-emerald-600 dark:text-emerald-400' },
  info: { icon: Info, className: 'text-blue-600 dark:text-blue-400' },
  warning: { icon: TriangleAlert, className: 'text-amber-600 dark:text-amber-400' },
  block: { icon: Ban, className: 'text-red-600 dark:text-red-400' },
}

const kindMeta: Record<TimelineKind, { icon: React.ElementType; label: string }> = {
  user: { icon: User, label: 'Pessoa' },
  system: { icon: Cpu, label: 'Sistema' },
  rules: { icon: Scale, label: 'Motor de regras' },
  sap: { icon: Database, label: 'Integração SAP' },
}

const toneClass = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
} as const

export function RequestDetail() {
  const { id } = route.useParams()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const role = useMockRoleStore((s) => s.role)
  const req = mockRequests.find((r) => r.id === id)

  if (!req) {
    return (
      <PlaceholderPage
        title='Solicitação não encontrada'
        description='Verifique o código ou volte para a lista de solicitações.'
      />
    )
  }

  const tab = search.tab ?? 'visao'
  const validations = getValidations(req)
  const timeline = getTimeline(req)
  const sap = getSapState(req)

  return (
    <>
      <Header fixed>
        <Button asChild variant='ghost' size='sm' className='me-auto'>
          <Link to='/solicitacoes'>
            <ArrowLeft />
            Voltar
          </Link>
        </Button>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {/* Cabeçalho */}
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='space-y-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>{req.code}</h2>
              <StatusBadge status={req.status} />
              <ConformityBadge conformity={req.conformity} />
            </div>
            <p className='text-muted-foreground'>{req.description}</p>
            <p className='text-sm text-muted-foreground'>
              Responsável atual:{' '}
              <span className='font-medium text-foreground'>{req.ownerArea}</span>
            </p>
          </div>
          {role === 'gestor' && req.status === 'awaiting_approval' && (
            <Button asChild>
              <Link to='/aprovacoes'>Ir para a fila de aprovação</Link>
            </Button>
          )}
          {(req.status === 'needs_correction' ||
            req.status === 'integration_error') && (
            <Button asChild>
              <Link to='/solicitacoes/$id/corrigir' params={{ id: req.id }}>
                Corrigir pendências
              </Link>
            </Button>
          )}
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({
                ...prev,
                tab: value === 'visao' ? undefined : (value as typeof tab),
              }),
            })
          }
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='visao'>Visão geral</TabsTrigger>
              <TabsTrigger value='cotacoes'>Cotações</TabsTrigger>
              <TabsTrigger value='validacoes'>Validações</TabsTrigger>
              <TabsTrigger value='aprovacao'>Aprovação</TabsTrigger>
              <TabsTrigger value='sap'>Integração SAP</TabsTrigger>
              <TabsTrigger value='historico'>Histórico</TabsTrigger>
            </TabsList>
          </div>

          {/* Visão geral */}
          <TabsContent value='visao' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Dados da solicitação</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <Fact label='Requisitante' value={req.requester.name} />
                <Fact label='Unidade' value={req.unit} />
                <Fact label='Centro de custo' value={req.costCenter} />
                <Fact label='Natureza do objeto' value={req.objectNature} />
                <Fact label='Urgência' value={urgencyLabels[req.urgency]} />
                <Fact
                  label='Fornecedor'
                  value={req.supplierName ?? 'Não informado'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Justificativa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm'>
                  {req.justification || (
                    <span className='text-muted-foreground'>
                      Sem justificativa (rascunho).
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itens</CardTitle>
                <CardDescription>Composição do valor da solicitação.</CardDescription>
              </CardHeader>
              <CardContent>
                {req.items.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className='text-end'>Qtd.</TableHead>
                        <TableHead className='text-end'>Valor unit.</TableHead>
                        <TableHead className='text-end'>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {req.items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell>{it.description}</TableCell>
                          <TableCell className='text-end tabular-nums'>
                            {it.quantity}
                          </TableCell>
                          <TableCell className='text-end tabular-nums'>
                            {formatBRL(it.unitValue)}
                          </TableCell>
                          <TableCell className='text-end tabular-nums'>
                            {formatBRL(it.quantity * it.unitValue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    Nenhum item informado ainda.
                  </p>
                )}
                <Separator className='my-4' />
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Valor total</span>
                  <span className='text-lg font-semibold tabular-nums'>
                    {formatBRL(req.totalValue)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cotações */}
          <TabsContent value='cotacoes' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Fornecedor e preços</CardTitle>
                <CardDescription>
                  {req.supplierStatus === 'homologado'
                    ? 'Fornecedor homologado — cotação conforme modelo do Base-b.'
                    : 'Fluxo de exceção: até 3 preços com evidência e data/hora de coleta.'}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='font-medium'>
                    {req.supplierName ?? 'Sem fornecedor definido'}
                  </span>
                  {req.supplierStatus && (
                    <span className='rounded-md border px-2 py-0.5 text-xs text-muted-foreground'>
                      {req.supplierStatus}
                    </span>
                  )}
                </div>
                {req.supplierStatus !== 'homologado' && (
                  <p className='text-muted-foreground'>
                    Hipótese (DEC-05/DEC-06): responsável pela inserção das
                    cotações e aprovação adicional a confirmar com o SESI. Cada
                    evidência ficará vinculada à respectiva cotação.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Validações */}
          <TabsContent value='validacoes' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Validações de elegibilidade e compliance</CardTitle>
                <CardDescription>
                  Resultado das regras aplicadas à solicitação.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-3'>
                {validations.map((v) => {
                  const meta = sevMeta[v.severity]
                  const Icon = meta.icon
                  return (
                    <div key={v.id} className='flex gap-3'>
                      <Icon className={cn('mt-0.5 size-4 shrink-0', meta.className)} />
                      <div className='space-y-0.5'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium'>{v.label}</span>
                          <span className='text-xs text-muted-foreground'>
                            · {v.area}
                          </span>
                        </div>
                        <p className='text-sm text-muted-foreground'>{v.message}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aprovação */}
          <TabsContent value='aprovacao' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Aprovação gerencial</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <ApprovalState status={req.status} />
                {role === 'gestor' && req.status === 'awaiting_approval' && (
                  <Button asChild>
                    <Link to='/aprovacoes'>Decidir na fila de aprovação</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integração SAP */}
          <TabsContent value='sap' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Integração com o SAP</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <span
                  className={cn(
                    'inline-flex w-fit rounded-md px-2 py-1 text-xs font-medium',
                    toneClass[sap.tone]
                  )}
                >
                  {sap.label}
                </span>
                <p className='text-muted-foreground'>{sap.message}</p>
                {sap.orderRef && (
                  <p>
                    Referência do pedido:{' '}
                    <span className='font-medium tabular-nums'>{sap.orderRef}</span>
                  </p>
                )}
                <p className='text-xs text-muted-foreground'>
                  Hipótese (DEC-08): a frequência da automação é referência inicial
                  do piloto, a confirmar com TI/SAP.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Histórico */}
          <TabsContent value='historico' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Histórico</CardTitle>
                <CardDescription>
                  Trilha cronológica — eventos automáticos identificados pela
                  origem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className='relative ms-2 space-y-5 border-s ps-5'>
                  {timeline.map((e) => {
                    const meta = kindMeta[e.kind]
                    const Icon = meta.icon
                    return (
                      <li key={e.id} className='relative'>
                        <span className='absolute -start-[1.7rem] flex size-6 items-center justify-center rounded-full border bg-background'>
                          <Icon className='size-3 text-muted-foreground' />
                        </span>
                        <div className='flex flex-wrap items-center gap-x-2 text-sm'>
                          <span className='font-medium'>{e.action}</span>
                          <span className='text-xs text-muted-foreground'>
                            {e.actor} · {formatDate(e.at)}
                          </span>
                        </div>
                        {e.detail && (
                          <p className='text-sm text-muted-foreground'>{e.detail}</p>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className='space-y-0.5'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='text-sm font-medium'>{value}</p>
    </div>
  )
}

function ApprovalState({ status }: { status: string }) {
  if (status === 'awaiting_approval')
    return <p className='text-muted-foreground'>Aguardando decisão do gestor responsável.</p>
  if (status === 'rejected')
    return <p className='text-muted-foreground'>Solicitação rejeitada pelo gestor.</p>
  if (['approved', 'queued_for_sap', 'processing_sap', 'completed'].includes(status))
    return <p className='text-muted-foreground'>Aprovada pelo gestor — seguiu para automação.</p>
  return (
    <p className='text-muted-foreground'>
      Ainda não enviada para aprovação.
    </p>
  )
}
