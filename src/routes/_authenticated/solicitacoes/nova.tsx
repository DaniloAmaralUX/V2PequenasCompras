import { createFileRoute } from '@tanstack/react-router'
import { NewRequestForm } from '@/features/purchase-requests/components/new-request-form'

export const Route = createFileRoute('/_authenticated/solicitacoes/nova')({
  component: NewRequestForm,
})
