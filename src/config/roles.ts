/**
 * Papéis (perfis) do protótipo de Pequenas Compras.
 *
 * ⚠️ Hipótese — a confirmar com o SESI (DEC-09 / DEC-12).
 * No protótipo, o papel ativo é escolhido por um seletor (mock) no cabeçalho
 * da sidebar e controla a navegação visível e as ações permitidas.
 */
export const roles = [
  'requisitante',
  'gestor',
  'comprador',
  'compliance',
  'gestao',
  'ti',
] as const

export type Role = (typeof roles)[number]

export const roleLabels: Record<Role, { label: string; description: string }> = {
  requisitante: {
    label: 'Requisitante',
    description: 'Abre e acompanha solicitações',
  },
  gestor: {
    label: 'Gestor aprovador',
    description: 'Aprova ou rejeita solicitações',
  },
  comprador: {
    label: 'Comprador / Suprimentos',
    description: 'Opera exceções e governança',
  },
  compliance: {
    label: 'Compliance / Auditoria',
    description: 'Consulta trilha, bloqueios e exceções',
  },
  gestao: {
    label: 'Gestão de Compras',
    description: 'Acompanha indicadores e SLA',
  },
  ti: {
    label: 'TI / Administrador',
    description: 'Integrações e parâmetros autorizados',
  },
}

export const defaultRole: Role = 'requisitante'
