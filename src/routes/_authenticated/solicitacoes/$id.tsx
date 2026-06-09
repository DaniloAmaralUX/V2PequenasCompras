import { createFileRoute } from '@tanstack/react-router'
import { RequestDetail } from '@/features/purchase-requests/components/request-detail'

export const Route = createFileRoute('/_authenticated/solicitacoes/$id')({
  component: RequestDetail,
})
