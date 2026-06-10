import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageTransition } from '@/components/layout/page-transition'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { RequestsTable } from './components/requests-table'
import { useRequests } from './data/use-requests'

export function PurchaseRequests() {
  const data = useRequests()

  return (
    <PageTransition>
      <Header fixed>
        <div className='me-auto' />
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
        <RequestsTable data={data} />
      </Main>
    </PageTransition>
  )
}
