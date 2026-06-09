/** Opções e constantes do formulário de Nova solicitação. */

export const SMALL_PURCHASE_LIMIT = 3000

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
