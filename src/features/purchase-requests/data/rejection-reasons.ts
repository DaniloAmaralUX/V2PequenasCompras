/** Motivos estruturados de rejeição (hipótese DEC-07 — a confirmar com o SESI). */
export const rejectionReasons = [
  { value: 'orcamento', label: 'Sem orçamento disponível' },
  { value: 'necessidade', label: 'Necessidade não justificada' },
  { value: 'fornecedor', label: 'Problema com fornecedor ou cotação' },
  { value: 'outro', label: 'Outro' },
] as const

export function rejectionReasonLabel(code?: string): string {
  return rejectionReasons.find((r) => r.value === code)?.label ?? code ?? '—'
}
