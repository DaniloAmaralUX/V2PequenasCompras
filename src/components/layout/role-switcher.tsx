import { ChevronsUpDown, UserCog, CheckIcon } from 'lucide-react'
import { roles, roleLabels } from '@/config/roles'
import { useMockRoleStore } from '@/stores/mock-role-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

/**
 * Seletor de papel (mock) no cabeçalho da sidebar.
 * Permite pré-visualizar a experiência de cada persona durante a prototipação.
 * Hipótese — a confirmar com o SESI (perfis definitivos: DEC-09 / DEC-12).
 */
export function RoleSwitcher() {
  const { isMobile } = useSidebar()
  const role = useMockRoleStore((s) => s.role)
  const setRole = useMockRoleStore((s) => s.setRole)
  const active = roleLabels[role]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <UserCog className='size-4' />
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>{active.label}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  Perfil (protótipo)
                </span>
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Visualizar como — hipótese de perfis (a confirmar com o SESI)
            </DropdownMenuLabel>
            {roles.map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => setRole(r)}
                className='gap-2 p-2'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <UserCog className='size-4 shrink-0' />
                </div>
                <div className='grid flex-1 leading-tight'>
                  <span className='text-sm'>{roleLabels[r].label}</span>
                  <span className='text-xs text-muted-foreground'>
                    {roleLabels[r].description}
                  </span>
                </div>
                {r === role && <CheckIcon className='ms-auto size-4' />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
