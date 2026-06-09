import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const Route = createFileRoute('/_authenticated/indicadores/')({
  component: () => (
    <PlaceholderPage
      title='Indicadores'
      description='BI operacional: volume, SLA, elegíveis × bloqueadas, pedidos no SAP e erros, com detalhamento.'
    />
  ),
})
