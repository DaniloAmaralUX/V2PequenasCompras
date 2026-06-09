import {
  LayoutDashboard,
  FileText,
  BadgeCheck,
  History,
  TrendingUp,
  Settings,
  SlidersHorizontal,
  Plug,
} from 'lucide-react'
import { type Role } from '@/config/roles'
import { type NavGroup, type NavItem, type SidebarData } from '../types'

/**
 * Navegação do MVP Pequenas Compras (PRD Design §9).
 * O gating por papel (`roles`) é hipótese de prototipação — a confirmar com o
 * SESI (DEC-09 / DEC-12). Itens/grupos sem `roles` são visíveis para todos.
 */
export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'Pequenas Compras',
      items: [
        { title: 'Visão geral', url: '/', icon: LayoutDashboard },
        { title: 'Solicitações', url: '/solicitacoes', icon: FileText },
        {
          title: 'Aprovações',
          url: '/aprovacoes',
          icon: BadgeCheck,
          roles: ['gestor', 'comprador'],
        },
      ],
    },
    {
      title: 'Gestão',
      roles: ['comprador', 'compliance', 'gestao', 'ti'],
      items: [
        {
          title: 'Auditoria',
          url: '/auditoria',
          icon: History,
          roles: ['comprador', 'compliance', 'gestao', 'ti'],
        },
        {
          title: 'Indicadores',
          url: '/indicadores',
          icon: TrendingUp,
          roles: ['comprador', 'compliance', 'gestao', 'ti'],
        },
        {
          title: 'Administração',
          icon: Settings,
          roles: ['comprador', 'compliance', 'ti'],
          items: [
            {
              title: 'Regras',
              url: '/administracao/regras',
              icon: SlidersHorizontal,
              roles: ['comprador', 'compliance', 'ti'],
            },
            {
              title: 'Integrações',
              url: '/administracao/integracoes',
              icon: Plug,
              roles: ['ti'],
            },
          ],
        },
      ],
    },
  ],
}

/** Filtra grupos, itens e subitens da navegação pelo papel ativo. */
export function filterNavByRole(navGroups: NavGroup[], role: Role): NavGroup[] {
  const allowed = (r?: Role[]) => !r || r.includes(role)
  const result: NavGroup[] = []

  for (const group of navGroups) {
    if (!allowed(group.roles)) continue
    const items: NavItem[] = []

    for (const item of group.items) {
      if (!allowed(item.roles)) continue
      if (item.items) {
        const sub = item.items.filter((s) => allowed(s.roles))
        if (sub.length === 0) continue
        items.push({ ...item, items: sub })
      } else {
        items.push(item)
      }
    }

    if (items.length > 0) result.push({ ...group, items })
  }

  return result
}
