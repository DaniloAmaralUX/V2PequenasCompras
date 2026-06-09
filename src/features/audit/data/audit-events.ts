import { User, Cpu, Scale, Database } from 'lucide-react'
import {
  type TimelineEvent,
  type TimelineKind,
  getTimeline,
} from '@/features/purchase-requests/data/derive'
import { useRequests } from '@/features/purchase-requests/data/use-requests'

/** Evento de auditoria global — um evento de trilha vinculado à sua solicitação. */
export type AuditEntry = TimelineEvent & {
  requestId: string
  requestCode: string
  requestDescription: string
  seq: number
}

/** Origem do evento — pessoa (ator humano) × automações do sistema. */
export const auditOrigins: Record<
  TimelineKind,
  { label: string; icon: React.ElementType; isHuman: boolean }
> = {
  user: { label: 'Pessoa', icon: User, isHuman: true },
  system: { label: 'Sistema', icon: Cpu, isHuman: false },
  rules: { label: 'Motor de regras', icon: Scale, isHuman: false },
  sap: { label: 'Integração SAP', icon: Database, isHuman: false },
}

export const auditOriginOrder: TimelineKind[] = [
  'user',
  'system',
  'rules',
  'sap',
]

/**
 * Trilha de auditoria consolidada (somente leitura): achata `getTimeline()` de
 * todas as solicitações em uma lista única, ordenada do evento mais recente para
 * o mais antigo. Eventos automáticos preservam sua origem (Sistema/Motor de
 * regras/Integração SAP), nunca apresentados como ação de pessoa.
 */
export function useAuditEvents(): AuditEntry[] {
  const requests = useRequests()
  const entries: AuditEntry[] = []
  let seq = 0

  for (const req of requests) {
    for (const e of getTimeline(req)) {
      entries.push({
        ...e,
        requestId: req.id,
        requestCode: req.code,
        requestDescription: req.description,
        seq: seq++,
      })
    }
  }

  // Mais recente primeiro: por data desc, desempate pela ordem natural do fluxo.
  return entries.sort((a, b) => {
    if (a.at !== b.at) return a.at < b.at ? 1 : -1
    return b.seq - a.seq
  })
}
