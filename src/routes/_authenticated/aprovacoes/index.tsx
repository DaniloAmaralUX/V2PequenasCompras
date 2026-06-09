import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const Route = createFileRoute('/_authenticated/aprovacoes/')({
  component: () => (
    <PlaceholderPage
      title='Aprovações'
      description='Fila de solicitações aguardando decisão do gestor, com resumo e evidências.'
    />
  ),
})
