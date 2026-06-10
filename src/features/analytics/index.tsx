import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  CircleCheck,
  Clock,
  ShieldAlert,
  Timer,
  Wallet,
} from 'lucide-react'
import { type Conformity } from '@/features/purchase-requests/schemas/purchase-request'
import {
  Card,
  CardContent,
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
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageTransition } from '@/components/layout/page-transition'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { formatBRL, formatDate } from '@/features/purchase-requests/lib/format'
import { IndicatorCard } from './components/indicator-card'
import { type Tone, toneColor, useMetrics } from './data/metrics'

const conformityTone: Record<Conformity, Tone> = {
  ok: 'success',
  attention: 'warning',
  blocked: 'danger',
  pending: 'neutral',
}

export function Analytics() {
  const m = useMetrics()

  const kpis = [
    {
      label: 'Solicitações',
      value: String(m.total),
      hint: 'No período',
      icon: BarChart3,
    },
    {
      label: 'Valor total',
      value: formatBRL(m.totalValue),
      hint: 'Soma das solicitações',
      icon: Wallet,
    },
    {
      label: 'Conformidade',
      value: `${m.conformityRate}%`,
      hint: 'Solicitações conformes',
      icon: CircleCheck,
    },
    {
      label: 'Aguardando aprovação',
      value: String(m.awaiting),
      hint: 'Com o gestor',
      icon: Clock,
    },
    {
      label: 'Tempo médio de ciclo',
      value: `${m.avgCycleDays} d`,
      hint: 'Criação → pedido (concluídas)',
      icon: Timer,
    },
    {
      label: 'Bloqueios e erros',
      value: String(m.automationErrors),
      hint: 'Identificados pela automação',
      icon: ShieldAlert,
    },
  ]

  return (
    <PageTransition>
      <Header fixed>
        <div className='me-auto text-sm text-muted-foreground'>
          Período: {m.periodStart ? formatDate(m.periodStart) : '—'} a{' '}
          {m.periodEnd ? formatDate(m.periodEnd) : '—'}
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Indicadores</h2>
          <p className='text-muted-foreground'>
            Acompanhe a operação de pequenas compras. Cada indicador abre a lista
            que o compõe.
          </p>
        </div>

        <div className='stagger-list grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {kpi.label}
                  </CardTitle>
                  <Icon className='size-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold tabular-nums'>
                    {kpi.value}
                  </div>
                  <p className='text-xs text-muted-foreground'>{kpi.hint}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className='grid gap-4 lg:grid-cols-2'>
          {/* Por status — drill-down para a lista filtrada */}
          <IndicatorCard
            title='Solicitações por status'
            description='Distribuição no funil. Clique para abrir a lista filtrada.'
            data={m.byStatus.map((s) => ({
              label: s.label,
              count: s.count,
              color: toneColor[s.tone],
            }))}
            table={
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-end'>Qtd.</TableHead>
                    <TableHead className='w-10' />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {m.byStatus.map((s) => (
                    <TableRow key={s.key} className='group'>
                      <TableCell>{s.label}</TableCell>
                      <TableCell className='text-end tabular-nums'>
                        {s.count}
                      </TableCell>
                      <TableCell className='p-0'>
                        <Link
                          to='/solicitacoes'
                          search={{ status: [s.key] }}
                          aria-label={`Ver solicitações com status ${s.label}`}
                          className='flex items-center justify-center p-2 text-muted-foreground transition-colors duration-150 hover:text-foreground'
                        >
                          <ArrowRight className='size-4' />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
          />

          {/* Por conformidade — drill-down para a lista filtrada */}
          <IndicatorCard
            title='Conformidade'
            description='Resultado das validações. Clique para abrir a lista filtrada.'
            data={m.byConformity.map((c) => ({
              label: c.label,
              count: c.count,
              color: toneColor[conformityTone[c.key]],
            }))}
            table={
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conformidade</TableHead>
                    <TableHead className='text-end'>Qtd.</TableHead>
                    <TableHead className='w-10' />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {m.byConformity.map((c) => (
                    <TableRow key={c.key}>
                      <TableCell>{c.label}</TableCell>
                      <TableCell className='text-end tabular-nums'>
                        {c.count}
                      </TableCell>
                      <TableCell className='p-0'>
                        <Link
                          to='/solicitacoes'
                          search={{ conformity: [c.key] }}
                          aria-label={`Ver solicitações com conformidade ${c.label}`}
                          className='flex items-center justify-center p-2 text-muted-foreground transition-colors duration-150 hover:text-foreground'
                        >
                          <ArrowRight className='size-4' />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
          />
        </div>

        <div className='grid gap-4 lg:grid-cols-2'>
          {/* Por natureza do objeto — leitura (sem filtro de natureza na lista) */}
          <IndicatorCard
            title='Por natureza do objeto'
            description='Volume e valor por tipo de compra.'
            data={m.byNature.map((n) => ({
              label: n.key,
              count: n.count,
              color: toneColor.info,
            }))}
            table={
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Natureza</TableHead>
                    <TableHead className='text-end'>Qtd.</TableHead>
                    <TableHead className='text-end'>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {m.byNature.map((n) => (
                    <TableRow key={n.key}>
                      <TableCell>{n.key}</TableCell>
                      <TableCell className='text-end tabular-nums'>
                        {n.count}
                      </TableCell>
                      <TableCell className='text-end tabular-nums'>
                        {formatBRL(n.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
          />

          {/* Concentração por fornecedor — apoia decisão de contrato/atacado (RF-029) */}
          <IndicatorCard
            title='Concentração por fornecedor'
            description='Quem concentra volume e valor — insumo para contrato ou compra em atacado.'
            data={m.bySupplier.slice(0, 6).map((s) => ({
              label: s.key,
              count: s.count,
              color: toneColor.info,
            }))}
            table={
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className='text-end'>Compras</TableHead>
                    <TableHead className='text-end'>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {m.bySupplier.map((s) => (
                    <TableRow key={s.key}>
                      <TableCell>{s.key}</TableCell>
                      <TableCell className='text-end tabular-nums'>
                        {s.count}
                      </TableCell>
                      <TableCell className='text-end tabular-nums'>
                        {formatBRL(s.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
          />
        </div>

        <p className='text-xs text-muted-foreground'>
          Hipótese — a confirmar com o SESI (DEC-10/DEC-11): indicadores oficiais,
          metas e dimensões do BI. Indicadores observados no benchmarking (modelo
          Direct Buy) como savings e preço acima da média histórica dependem de uma
          fonte de preço de referência, ainda a definir. Dados do protótipo são
          ilustrativos.
        </p>
      </Main>
    </PageTransition>
  )
}
