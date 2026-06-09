import { roleLabels } from '@/config/roles'
import { useMockRoleStore } from '@/stores/mock-role-store'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData, filterNavByRole } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { RoleSwitcher } from './role-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const role = useMockRoleStore((s) => s.role)
  const navGroups = filterNavByRole(sidebarData.navGroups, role)
  const user = {
    name: roleLabels[role].label,
    email: `${role}@sesi.prototipo`,
    avatar: '',
  }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <RoleSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
