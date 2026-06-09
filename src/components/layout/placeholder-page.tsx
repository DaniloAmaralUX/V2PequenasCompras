import { Telescope } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

type PlaceholderPageProps = {
  title: string
  description?: string
}

/**
 * Placeholder coerente com o shell (header + sidebar visíveis) para seções
 * cuja tela será construída no incremento correspondente do protótipo.
 */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <Header>
        <h1 className='text-base font-medium'>{title}</h1>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center'>
          <Telescope className='size-12 text-muted-foreground' />
          <div className='space-y-1'>
            <h2 className='text-lg font-semibold'>{title}</h2>
            <p className='mx-auto max-w-md text-sm text-muted-foreground'>
              {description ??
                'Esta tela será construída no incremento correspondente do protótipo.'}
            </p>
          </div>
        </div>
      </Main>
    </>
  )
}
