import {
  ArrowUpRight,
  Ban,
  CheckCheck,
  CircleCheck,
  CircleX,
  Clock,
  FileText,
  Hourglass,
  OctagonAlert,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react'
import { type Role } from '@/config/roles'
import { mockRequests } from '@/features/purchase-requests/data/mock-requests'
import {
  type PurchaseRequest,
  type RequestStatus,
} from '@/features/purchase-requests/schemas/purchase-request'

export type Kpi = {
  label: string
  value: number
  hint: string
  icon: React.ElementType
  /** Filtro de status para drill-down em /solicitacoes (ausente = sem filtro). */
  statusFilter?: RequestStatus[]
}

const inStatus = (statuses: RequestStatus[]) =>
  mockRequests.filter((r) => statuses.includes(r.status))

function kpi(
  label: string,
  statuses: RequestStatus[],
  hint: string,
  icon: React.ElementType
): Kpi {
  return { label, value: inStatus(statuses).length, hint, icon, statusFilter: statuses }
}

const totalKpi = (hint: string): Kpi => ({
  label: 'Total',
  value: mockRequests.length,
  hint,
  icon: FileText,
})

/** KPIs por perfil (Visão geral — PRD Design §19). Drill-down para a lista. */
export function getKpis(role: Role): Kpi[] {
  switch (role) {
    case 'requisitante':
      return [
        kpi(
          'Em andamento',
          ['draft', 'needs_correction', 'awaiting_approval', 'approved', 'queued_for_sap', 'processing_sap'],
          'Solicitações ativas',
          Clock
        ),
        kpi('Correção necessária', ['needs_correction'], 'Aguardando sua ação', TriangleAlert),
        kpi('Aguardando aprovação', ['awaiting_approval'], 'Com o gestor', Hourglass),
        kpi('Concluídas', ['completed'], 'Pedido criado no SAP', CheckCheck),
      ]
    case 'gestor':
      return [
        kpi('Aguardando aprovação', ['awaiting_approval'], 'Aguardando sua decisão', Hourglass),
        kpi('Aprovadas', ['approved', 'queued_for_sap', 'processing_sap'], 'Em automação', CircleCheck),
        kpi('Rejeitadas', ['rejected'], 'Encerradas por você', CircleX),
        kpi('Concluídas', ['completed'], 'Pedido criado', CheckCheck),
      ]
    case 'comprador':
      return [
        totalKpi('Todas as solicitações'),
        kpi('Bloqueadas', ['blocked'], 'Exigem análise', Ban),
        kpi('Erros no SAP', ['integration_error'], 'Falha na integração', OctagonAlert),
        kpi('Na fila do SAP', ['queued_for_sap', 'processing_sap'], 'Aguardando registro', RefreshCw),
      ]
    case 'compliance':
      return [
        kpi('Bloqueadas', ['blocked'], 'Regra impede continuidade', Ban),
        kpi('Aguardando aprovação', ['awaiting_approval'], 'Em análise gerencial', Hourglass),
        kpi('Redirecionadas', ['redirected'], 'Fora do fluxo', ArrowUpRight),
        kpi('Concluídas', ['completed'], 'Pedido criado', CheckCheck),
      ]
    case 'gestao':
      return [
        totalKpi('Volume no período'),
        kpi('Aguardando aprovação', ['awaiting_approval'], 'Gargalo de decisão', Hourglass),
        kpi('Bloqueadas', ['blocked'], 'Bloqueios por regra', Ban),
        kpi('Concluídas', ['completed'], 'Pedidos criados', CheckCheck),
      ]
    case 'ti':
      return [
        kpi('Na fila do SAP', ['queued_for_sap'], 'Aguardando execução', Hourglass),
        kpi('Registrando', ['processing_sap'], 'Integração em andamento', RefreshCw),
        kpi('Erros no SAP', ['integration_error'], 'Exigem intervenção', OctagonAlert),
        kpi('Concluídas', ['completed'], 'Pedido criado', CheckCheck),
      ]
  }
}

export type PriorityList = {
  title: string
  description: string
  requests: PurchaseRequest[]
}

/** Lista prioritária por perfil (o que precisa de ação primeiro). */
export function getPriority(role: Role): PriorityList {
  const pick = (statuses: RequestStatus[]) =>
    mockRequests.filter((r) => statuses.includes(r.status))

  switch (role) {
    case 'requisitante':
      return {
        title: 'Precisam da sua ação',
        description: 'Correções e acompanhamento das suas solicitações',
        requests: pick(['needs_correction', 'awaiting_approval']),
      }
    case 'gestor':
      return {
        title: 'Aguardando sua decisão',
        description: 'Solicitações para aprovar ou rejeitar',
        requests: pick(['awaiting_approval']),
      }
    case 'comprador':
      return {
        title: 'Exceções e falhas',
        description: 'Bloqueios, correções e erros de integração',
        requests: pick(['blocked', 'needs_correction', 'integration_error']),
      }
    case 'compliance':
      return {
        title: 'Bloqueios e exceções',
        description: 'Casos que exigem análise de conformidade',
        requests: pick(['blocked', 'redirected']),
      }
    case 'gestao':
      return {
        title: 'Gargalos da operação',
        description: 'Aguardando aprovação e bloqueios por regra',
        requests: pick(['awaiting_approval', 'blocked']),
      }
    case 'ti':
      return {
        title: 'Integração SAP',
        description: 'Fila, processamento e erros que exigem intervenção',
        requests: pick(['queued_for_sap', 'processing_sap', 'integration_error']),
      }
  }
}
