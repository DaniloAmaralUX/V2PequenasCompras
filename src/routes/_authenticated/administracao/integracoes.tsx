import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const Route = createFileRoute(
  '/_authenticated/administracao/integracoes'
)({
  component: () => (
    <PlaceholderPage
      title='Administração — Integrações'
      description='Saúde conceitual de Base-b, SAP, fornecedores, contratos, estoque e BI, com tentativas de integração.'
    />
  ),
})
