import {
  type Conformity,
  type RequestStatus,
} from '@/features/purchase-requests/schemas/purchase-request'
import { useRequests } from '@/features/purchase-requests/data/use-requests'
import {
  conformityMeta,
  statusMeta,
} from '@/features/purchase-requests/data/status'

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export type StatusSlice = {
  key: RequestStatus
  label: string
  count: number
  tone: Tone
}

export type ConformitySlice = {
  key: Conformity
  label: string
  count: number
}

export type NatureSlice = {
  key: string
  count: number
  value: number
}

export type Metrics = {
  total: number
  totalValue: number
  conformityRate: number
  completed: number
  awaiting: number
  attention: number
  /** Tempo médio entre criação e conclusão (dias) — proxy de SLA do piloto. */
  avgCycleDays: number
  /** Bloqueios + impedimentos identificados pela automação (benchmarking: erros das automações). */
  automationErrors: number
  periodStart: string
  periodEnd: string
  byStatus: StatusSlice[]
  byConformity: ConformitySlice[]
  byNature: NatureSlice[]
  /** Concentração por fornecedor (apoia decisão de contrato/atacado — RF-029). */
  bySupplier: NatureSlice[]
}

const statusOrder = Object.keys(statusMeta) as RequestStatus[]

/** Diferença em dias entre duas datas ISO (YYYY-MM-DD). */
function daysBetween(start: string, end: string): number {
  const a = new Date(`${start.slice(0, 10)}T00:00:00`).getTime()
  const b = new Date(`${end.slice(0, 10)}T00:00:00`).getTime()
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.max(0, Math.round((b - a) / 86_400_000))
}

/**
 * Agregados de indicadores derivados das solicitações-mock (mock + overrides).
 * Tudo recalculado a partir de `useRequests()`, então decisões do protótipo
 * (aprovar/rejeitar) refletem nos números.
 */
export function useMetrics(): Metrics {
  const requests = useRequests()
  const total = requests.length

  const totalValue = requests.reduce((s, r) => s + r.totalValue, 0)
  const okCount = requests.filter((r) => r.conformity === 'ok').length
  const conformityRate = total ? Math.round((okCount / total) * 100) : 0
  const completed = requests.filter((r) => r.status === 'completed').length
  const awaiting = requests.filter(
    (r) => r.status === 'awaiting_approval'
  ).length
  const attention = requests.filter(
    (r) => r.conformity === 'attention' || r.conformity === 'blocked'
  ).length
  // Erros/bloqueios da automação (BPMN: bloqueio na elegibilidade + impedimento na abertura).
  const automationErrors = requests.filter(
    (r) => r.status === 'integration_error' || r.status === 'blocked'
  ).length

  const dates = requests.map((r) => r.createdAt.slice(0, 10)).sort()
  const periodStart = dates[0] ?? ''
  const periodEnd = dates[dates.length - 1] ?? ''

  // Tempo médio de ciclo (criação → conclusão) das solicitações concluídas.
  const cycles = requests
    .filter((r) => r.status === 'completed')
    .map((r) => daysBetween(r.createdAt, r.updatedAt))
  const avgCycleDays = cycles.length
    ? Math.round((cycles.reduce((s, d) => s + d, 0) / cycles.length) * 10) / 10
    : 0

  // Por status (mantém a ordem canônica; só status presentes).
  const statusCounts = new Map<RequestStatus, number>()
  for (const r of requests)
    statusCounts.set(r.status, (statusCounts.get(r.status) ?? 0) + 1)
  const byStatus: StatusSlice[] = statusOrder
    .filter((s) => statusCounts.has(s))
    .map((s) => ({
      key: s,
      label: statusMeta[s].label,
      count: statusCounts.get(s) ?? 0,
      tone: statusMeta[s].tone,
    }))

  // Por conformidade.
  const confKeys = Object.keys(conformityMeta) as Conformity[]
  const byConformity: ConformitySlice[] = confKeys
    .map((c) => ({
      key: c,
      label: conformityMeta[c].label,
      count: requests.filter((r) => r.conformity === c).length,
    }))
    .filter((c) => c.count > 0)

  // Por natureza do objeto.
  const natureMap = new Map<string, { count: number; value: number }>()
  for (const r of requests) {
    const cur = natureMap.get(r.objectNature) ?? { count: 0, value: 0 }
    cur.count += 1
    cur.value += r.totalValue
    natureMap.set(r.objectNature, cur)
  }
  const byNature: NatureSlice[] = [...natureMap.entries()]
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.count - a.count)

  // Concentração por fornecedor (ignora solicitações sem fornecedor definido).
  const supplierMap = new Map<string, { count: number; value: number }>()
  for (const r of requests) {
    if (!r.supplierName) continue
    const cur = supplierMap.get(r.supplierName) ?? { count: 0, value: 0 }
    cur.count += 1
    cur.value += r.totalValue
    supplierMap.set(r.supplierName, cur)
  }
  const bySupplier: NatureSlice[] = [...supplierMap.entries()]
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.count - a.count)

  return {
    total,
    totalValue,
    conformityRate,
    completed,
    awaiting,
    attention,
    avgCycleDays,
    automationErrors,
    periodStart,
    periodEnd,
    byStatus,
    byConformity,
    byNature,
    bySupplier,
  }
}

/** Cor de barra por tom semântico (apoio visual; a tabela traz o equivalente textual). */
export const toneColor: Record<Tone, string> = {
  neutral: '#6b7280',
  info: '#2563eb',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
}
