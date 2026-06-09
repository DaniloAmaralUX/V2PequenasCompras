/**
 * Saúde conceitual das integrações (mock). A fronteira é um adaptador/serviço —
 * no protótipo os 4 estados são simulados: operacional · processando · erro
 * corrigível (degradado) · erro que exige intervenção (indisponível). Sem
 * mecanismo real (Base-b/SAP/RPA). Substituir por adaptadores reais fora do escopo.
 */
export type IntegrationStatus =
  | 'operational'
  | 'processing'
  | 'degraded'
  | 'down'
  | 'not_configured'

export type Integration = {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  lastCheck: string
  message: string
  /** Permite "Solicitar reprocessamento" (apenas TI, e só quando há erro). */
  reprocessable: boolean
}

export const statusMeta: Record<
  IntegrationStatus,
  { label: string; tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }
> = {
  operational: { label: 'Operacional', tone: 'success' },
  processing: { label: 'Processando', tone: 'info' },
  degraded: { label: 'Instável', tone: 'warning' },
  down: { label: 'Indisponível', tone: 'danger' },
  not_configured: { label: 'Não configurada', tone: 'neutral' },
}

export const mockIntegrations: Integration[] = [
  {
    id: 'base-b',
    name: 'Base-b',
    description: 'Plataforma de origem das solicitações.',
    status: 'operational',
    lastCheck: '2026-06-09',
    message: 'Recebendo solicitações normalmente.',
    reprocessable: false,
  },
  {
    id: 'sap',
    name: 'Integração SAP',
    description: 'Registro automático dos pedidos aprovados.',
    status: 'degraded',
    lastCheck: '2026-06-09',
    message:
      'Algumas tentativas falharam e aguardam reprocessamento na próxima janela.',
    reprocessable: true,
  },
  {
    id: 'suppliers',
    name: 'Cadastro de fornecedores',
    description: 'Consulta de homologação e bloqueios.',
    status: 'operational',
    lastCheck: '2026-06-09',
    message: 'Consultas respondendo normalmente.',
    reprocessable: false,
  },
  {
    id: 'contracts',
    name: 'Contratos vigentes',
    description: 'Verificação de contrato ativo para o item.',
    status: 'processing',
    lastCheck: '2026-06-09',
    message: 'Sincronização de contratos em andamento.',
    reprocessable: false,
  },
  {
    id: 'stock',
    name: 'Estoque',
    description: 'Checagem de item disponível em estoque.',
    status: 'operational',
    lastCheck: '2026-06-09',
    message: 'Disponibilidade atualizada.',
    reprocessable: false,
  },
  {
    id: 'bi',
    name: 'BI / Indicadores',
    description: 'Base analítica dos indicadores.',
    status: 'not_configured',
    lastCheck: '—',
    message: 'Conexão definitiva a confirmar com o SESI (fora do MVP).',
    reprocessable: false,
  },
]

export type SapAttempt = {
  id: string
  requestCode: string
  at: string
  result: 'success' | 'error' | 'processing'
  detail: string
}

export const mockSapAttempts: SapAttempt[] = [
  {
    id: 'a1',
    requestCode: 'PC-2026-0001',
    at: '2026-05-29',
    result: 'success',
    detail: 'Pedido 4500012345 criado.',
  },
  {
    id: 'a2',
    requestCode: 'PC-2026-0010',
    at: '2026-06-08',
    result: 'error',
    detail: 'Dados do pedido precisam de correção antes de novo envio.',
  },
  {
    id: 'a3',
    requestCode: 'PC-2026-0012',
    at: '2026-06-09',
    result: 'processing',
    detail: 'Registrando na próxima janela da automação.',
  },
]
