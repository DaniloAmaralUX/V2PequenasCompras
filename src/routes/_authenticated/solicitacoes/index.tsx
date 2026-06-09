import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const Route = createFileRoute('/_authenticated/solicitacoes/')({
  component: () => (
    <PlaceholderPage
      title='Solicitações'
      description='Fila de pequenas compras com filtros por status, unidade, valor, fornecedor e pendência.'
    />
  ),
})
