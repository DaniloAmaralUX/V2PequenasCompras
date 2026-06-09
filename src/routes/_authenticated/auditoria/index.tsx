import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const Route = createFileRoute('/_authenticated/auditoria/')({
  component: () => (
    <PlaceholderPage
      title='Auditoria'
      description='Trilha cronológica de eventos (somente leitura): alterações, validações, bloqueios e integrações.'
    />
  ),
})
