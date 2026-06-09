/** Formata um número como moeda brasileira (R$). */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/** Formata uma data ISO (YYYY-MM-DD) como dd/mm/aaaa, sem fuso. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

/** Dias decorridos desde uma data ISO até hoje (para "tempo aguardando"). */
export function daysSince(iso: string): number {
  const then = new Date(`${iso.slice(0, 10)}T00:00:00`)
  const now = new Date()
  const diff = now.getTime() - then.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

/** Texto curto de "tempo aguardando". */
export function waitingLabel(iso: string): string {
  const d = daysSince(iso)
  if (d <= 0) return 'hoje'
  if (d === 1) return '1 dia'
  return `${d} dias`
}
