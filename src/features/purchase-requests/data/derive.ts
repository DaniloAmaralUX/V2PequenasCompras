import {
  type BlockReason,
  type PurchaseRequest,
} from '../schemas/purchase-request'

/**
 * Stubs de derivação (design-first): geram validações, histórico e estado SAP
 * a partir do status/motivo de bloqueio da solicitação-mock. Substituir por
 * dados reais via adaptadores quando o MVP integrar (fora deste escopo).
 */

export type Severity = 'pass' | 'info' | 'warning' | 'block'

export type Validation = {
  id: string
  label: string
  severity: Severity
  message: string
  area: string
}

export const urgencyLabels: Record<PurchaseRequest['urgency'], string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

const blockInfo: Record<
  BlockReason,
  { label: string; message: string; area: string; severity: Severity }
> = {
  over_limit: {
    label: 'Limite de valor',
    message:
      'Ultrapassa o limite de R$ 3.000,00 e deve seguir pelo fluxo normal de compras.',
    area: 'Sistema',
    severity: 'block',
  },
  supplier_blocked: {
    label: 'Fornecedor',
    message:
      'Fornecedor bloqueado para compras. Selecione outro fornecedor ou contate Suprimentos.',
    area: 'Compras/Suprimentos',
    severity: 'block',
  },
  stock_item: {
    label: 'Item de estoque',
    message:
      'Item disponível como material de estoque. Solicite pelo processo interno de estoque.',
    area: 'Compras/Suprimentos',
    severity: 'block',
  },
  active_contract: {
    label: 'Contrato vigente',
    message:
      'Existe contrato vigente para o item. Utilize o contrato ou contate Suprimentos.',
    area: 'Compras/Suprimentos',
    severity: 'block',
  },
  fractionation: {
    label: 'Possível fracionamento',
    message:
      'Padrão compatível com possível fracionamento. Encaminhado para análise de Compliance.',
    area: 'Compliance',
    severity: 'block',
  },
  missing_evidence: {
    label: 'Evidências',
    message: 'Anexe a evidência obrigatória desta solicitação para continuar.',
    area: 'Requisitante',
    severity: 'block',
  },
  not_homologated: {
    label: 'Fornecedor não homologado',
    message:
      'Sem fornecedor homologado. Registre até 3 preços com evidências (fluxo de exceção).',
    area: 'Compras/Suprimentos',
    severity: 'warning',
  },
}

export function getValidations(req: PurchaseRequest): Validation[] {
  const v: Validation[] = []
  const hasFields = req.justification.trim() !== '' && req.items.length > 0

  v.push({
    id: 'fields',
    label: 'Campos obrigatórios',
    severity: hasFields ? 'pass' : 'warning',
    message: hasFields
      ? 'Centro de custo, unidade, natureza e justificativa preenchidos.'
      : 'Há campos obrigatórios pendentes (ex.: justificativa ou itens).',
    area: 'Requisitante',
  })

  if (req.blockReason === 'over_limit') {
    v.push({ id: 'limit', ...blockInfo.over_limit })
  } else {
    v.push({
      id: 'limit',
      label: 'Limite de valor',
      severity: 'pass',
      message: 'Dentro do limite de R$ 3.000,00.',
      area: 'Sistema',
    })
  }

  if (req.supplierStatus === 'bloqueado') {
    v.push({ id: 'supplier', ...blockInfo.supplier_blocked })
  } else if (req.supplierStatus === 'homologado') {
    v.push({
      id: 'supplier',
      label: 'Fornecedor',
      severity: 'pass',
      message: 'Fornecedor homologado.',
      area: 'Compras/Suprimentos',
    })
  } else if (
    req.blockReason === 'not_homologated' ||
    req.supplierStatus === 'inexistente'
  ) {
    v.push({ id: 'supplier', ...blockInfo.not_homologated })
  }

  if (
    req.blockReason &&
    (['stock_item', 'active_contract', 'fractionation', 'missing_evidence'] as BlockReason[]).includes(
      req.blockReason
    )
  ) {
    v.push({ id: 'reason', ...blockInfo[req.blockReason] })
  }

  return v
}

export type TimelineKind = 'user' | 'system' | 'rules' | 'sap'
export type TimelineEvent = {
  id: string
  at: string
  actor: string
  action: string
  detail?: string
  kind: TimelineKind
}

export function getTimeline(req: PurchaseRequest): TimelineEvent[] {
  const ev: TimelineEvent[] = []
  const add = (e: Omit<TimelineEvent, 'id'>) =>
    ev.push({ id: `${req.id}-${ev.length}`, ...e })

  add({
    at: req.createdAt,
    actor: req.requester.name,
    action: 'Solicitação criada',
    kind: 'user',
  })

  if (req.status !== 'draft') {
    add({
      at: req.createdAt,
      actor: 'Motor de regras',
      action: 'Validações executadas',
      kind: 'rules',
    })
  }

  if (req.blockReason && blockInfo[req.blockReason]) {
    add({
      at: req.updatedAt,
      actor: 'Motor de regras',
      action: 'Resultado de conformidade',
      detail: blockInfo[req.blockReason].message,
      kind: 'rules',
    })
  }

  switch (req.status) {
    case 'redirected':
      add({ at: req.updatedAt, actor: 'Sistema', action: 'Direcionada ao fluxo normal de compras', kind: 'system' })
      break
    case 'needs_correction':
      add({ at: req.updatedAt, actor: 'Sistema', action: 'Devolvida para correção', kind: 'system' })
      break
    case 'awaiting_approval':
      // Com motivo de bloqueio + aguardando aprovação = foi corrigida e reenviada;
      // preserva o laço de correção na trilha (CT-12), sem apagar histórico.
      if (req.blockReason) {
        add({ at: req.updatedAt, actor: 'Sistema', action: 'Devolvida para correção', kind: 'system' })
        add({ at: req.updatedAt, actor: req.requester.name, action: 'Reenviada após correção', kind: 'user' })
      } else {
        add({ at: req.updatedAt, actor: req.requester.name, action: 'Enviada para aprovação', kind: 'user' })
      }
      break
    case 'rejected':
      add({ at: req.updatedAt, actor: 'Gestor', action: 'Solicitação rejeitada', kind: 'user' })
      break
    case 'approved':
      add({ at: req.updatedAt, actor: 'Gestor', action: 'Solicitação aprovada', kind: 'user' })
      break
    case 'queued_for_sap':
      add({ at: req.updatedAt, actor: 'Sistema', action: 'Enfileirada para registro no SAP', kind: 'system' })
      break
    case 'processing_sap':
      add({ at: req.updatedAt, actor: 'Integração SAP', action: 'Registrando no SAP', kind: 'sap' })
      break
    case 'integration_error':
      add({ at: req.updatedAt, actor: 'Integração SAP', action: 'Erro no registro do pedido', kind: 'sap' })
      break
    case 'completed':
      add({ at: req.updatedAt, actor: 'Gestor', action: 'Solicitação aprovada', kind: 'user' })
      add({
        at: req.updatedAt,
        actor: 'Integração SAP',
        action: 'Pedido criado no SAP',
        detail: req.sapOrderRef ? `Pedido ${req.sapOrderRef}` : undefined,
        kind: 'sap',
      })
      break
    default:
      break
  }

  return ev
}

export type SapState = {
  label: string
  tone: 'neutral' | 'info' | 'success' | 'danger'
  message: string
  orderRef?: string
}

export function getSapState(req: PurchaseRequest): SapState {
  switch (req.status) {
    case 'completed':
      return {
        label: 'Pedido criado',
        tone: 'success',
        message: 'O SAP confirmou a criação do pedido.',
        orderRef: req.sapOrderRef,
      }
    case 'queued_for_sap':
      return {
        label: 'Na fila do SAP',
        tone: 'info',
        message:
          'Aguardando a próxima janela de execução da automação. Você pode sair desta tela; o status será atualizado.',
      }
    case 'processing_sap':
      return {
        label: 'Registrando no SAP',
        tone: 'info',
        message: 'Integração em andamento.',
      }
    case 'integration_error':
      return {
        label: 'Erro no registro',
        tone: 'danger',
        message:
          'O pedido não foi criado. Revise os dados ou solicite apoio de Compras/TI.',
      }
    case 'approved':
      return {
        label: 'Aprovada',
        tone: 'info',
        message: 'Autorizada — aguardando entrada na fila de automação.',
      }
    default:
      return {
        label: 'Ainda não enviada',
        tone: 'neutral',
        message: 'A solicitação ainda não chegou à etapa de registro no SAP.',
      }
  }
}
