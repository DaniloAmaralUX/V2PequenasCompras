import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RequestsTable } from './components/requests-table'
import { mockRequests } from './data/mock-requests'

export function PurchaseRequests() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Solicitações</h2>
            <p className='text-muted-foreground'>
              Fila de pequenas compras — acompanhe status, conformidade e
              pendências.
            </p>
          </div>
          <Button asChild>
            <Link to='/solicitacoes/nova'>
              <Plus />
              Nova solicitação
            </Link>
          </Button>
        </div>
        <RequestsTable data={mockRequests} />
      </Main>
    </>
  )
}
