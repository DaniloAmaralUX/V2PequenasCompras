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
  periodStart: string
  periodEnd: string
  byStatus: StatusSlice[]
  byConformity: ConformitySlice[]
  byNature: NatureSlice[]
}

const statusOrder = Object.keys(statusMeta) as RequestStatus[]

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

  const dates = requests.map((r) => r.createdAt.slice(0, 10)).sort()
  const periodStart = dates[0] ?? ''
  const periodEnd = dates[dates.length - 1] ?? ''

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

  return {
    total,
    totalValue,
    conformityRate,
    completed,
    awaiting,
    attention,
    periodStart,
    periodEnd,
    byStatus,
    byConformity,
    byNature,
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
