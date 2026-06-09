import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const Route = createFileRoute(
  '/_authenticated/solicitacoes/$id/corrigir'
)({
  component: () => (
    <PlaceholderPage
      title='Corrigir solicitação'
      description='Resumo das pendências, correção focada por campo e reenvio sem perder o histórico — em construção.'
    />
  ),
})
