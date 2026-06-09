/** Opções e constantes do formulário de Nova solicitação. */

export const SMALL_PURCHASE_LIMIT = 3000

/**
 * Prazo (em dias) abaixo do qual a solicitação é marcada como urgente
 * automaticamente (modelo Direct Buy — "prazo < X dias → urgente").
 * ⚠️ Hipótese — a confirmar com o SESI (DEC-08): valor de partida do piloto.
 */
export const URGENCY_THRESHOLD_DAYS = 3

/**
 * Perfil-mock do requisitante. No produto, unidade, centro de custo e natureza
 * do objeto são buscados do perfil/histórico do usuário e podem ser ajustados
 * (fonte: doc 03 — "podem ser preenchidos automaticamente: centro de custo,
 * unidade, natureza do objeto").
 * ⚠️ Hipótese — a confirmar com o SESI (DEC-12).
 */
export const mockRequesterProfile = {
  unit: 'Unidade Centro',
  costCenter: 'CC-1001',
  objectNature: 'Material de escritório',
} as const

export const unitOptions = [
  'Unidade Centro',
  'Unidade Norte',
  'Unidade Industrial',
  'Escola SESI Jardim',
  'CAT Sul',
] as const

export const objectNatureOptions = [
  'Coffee break',
  'Material de escritório',
  'Material de limpeza',
  'Manutenção predial',
  'Equipamento de informática',
  'Serviço gráfico',
  'Material elétrico',
] as const

export const urgencyOptions = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
] as const
