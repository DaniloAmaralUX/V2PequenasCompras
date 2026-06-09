import { type LinkProps } from '@tanstack/react-router'
import { type Role } from '@/config/roles'

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  /** Papéis autorizados a ver o item. Ausente = visível para todos. */
  roles?: Role[]
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
  /** Papéis autorizados a ver o grupo. Ausente = visível para todos. */
  roles?: Role[]
}

type SidebarData = {
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
