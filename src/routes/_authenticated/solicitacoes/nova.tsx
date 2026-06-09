import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const Route = createFileRoute('/_authenticated/solicitacoes/nova')({
  component: () => (
    <PlaceholderPage
      title='Nova solicitação'
      description='Formulário em 5 etapas (enquadramento, necessidade, fornecedor e preços, evidências, revisão) — em construção.'
    />
  ),
})
