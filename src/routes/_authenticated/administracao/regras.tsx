import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const Route = createFileRoute('/_authenticated/administracao/regras')({
  component: () => (
    <PlaceholderPage
      title='Administração — Regras'
      description='Parâmetros autorizados (hipótese: limite de valor e quantidade mínima de cotações) com histórico de alterações.'
    />
  ),
})
