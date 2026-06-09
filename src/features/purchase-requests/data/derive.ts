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
    // 1ª passagem do robô (BPMN: "Direct Buy: Analisar solicitação" → elegível?).
    add({
      at: req.createdAt,
      actor: 'Robô Direct Buy',
      action: 'Análise de elegibilidade',
      detail:
        'Verificação automática de governança: limite, fornecedor, estoque, contrato e fracionamento.',
      kind: 'rules',
    })
  }

  if (req.blockReason && blockInfo[req.blockReason]) {
    add({
      at: req.updatedAt,
      actor: 'Robô Direct Buy',
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
      add({ at: req.updatedAt, actor: 'Sistema', action: 'Enfileirada para a janela da automação (2×/dia)', kind: 'system' })
      break
    case 'processing_sap':
      // 2ª passagem do robô (BPMN: "Direct Buy: Analisar regras" → abrir pedido).
      add({ at: req.updatedAt, actor: 'Robô Direct Buy', action: 'Análise de regras para abertura do pedido', kind: 'rules' })
      add({ at: req.updatedAt, actor: 'Integração SAP', action: 'Registrando no SAP', kind: 'sap' })
      break
    case 'integration_error':
      // BPMN: "Há impedimentos para a abertura do pedido? Sim" → erro devolvido para correção.
      add({ at: req.updatedAt, actor: 'Robô Direct Buy', action: 'Impedimento na abertura do pedido', detail: 'Regra de governança não atendida ao abrir o pedido — devolvido para correção.', kind: 'rules' })
      break
    case 'completed':
      add({ at: req.updatedAt, actor: 'Gestor', action: 'Solicitação aprovada', kind: 'user' })
      add({
        at: req.updatedAt,
        actor: 'Robô Direct Buy',
        action: 'Análise de regras para abertura do pedido',
        detail: 'Sem impedimentos — pedido encaminhado ao SAP.',
        kind: 'rules',
      })
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
          'Aguardando a próxima das duas janelas diárias da automação (modelo Direct Buy: o robô processa a fila 2×/dia). Você pode sair desta tela; o status será atualizado.',
      }
    case 'processing_sap':
      return {
        label: 'Registrando no SAP',
        tone: 'info',
        message:
          'Janela da automação em andamento — o robô analisa as regras de abertura e registra o pedido no SAP.',
      }
    case 'integration_error':
      return {
        label: 'Erro no registro',
        tone: 'danger',
        message:
          'O robô identificou um impedimento ao abrir o pedido (regra de governança ou inconsistência). Revise os dados e reenvie; se persistir, acione Compras/TI.',
      }
    case 'approved':
      return {
        label: 'Aprovada',
        tone: 'info',
        message: 'Autorizada — aguardando a próxima janela da automação (2×/dia).',
      }
    default:
      return {
        label: 'Ainda não enviada',
        tone: 'neutral',
        message: 'A solicitação ainda não chegou à etapa de registro no SAP.',
      }
  }
}
