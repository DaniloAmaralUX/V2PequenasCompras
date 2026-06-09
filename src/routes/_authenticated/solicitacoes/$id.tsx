import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RequestDetail } from '@/features/purchase-requests/components/request-detail'

const detailSearch = z.object({
  tab: z
    .enum(['visao', 'cotacoes', 'validacoes', 'aprovacao', 'sap', 'historico'])
    .optional()
    .catch('visao'),
})

export const Route = createFileRoute('/_authenticated/solicitacoes/$id')({
  validateSearch: detailSearch,
  component: RequestDetail,
})
