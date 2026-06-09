import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PurchaseRequests } from '@/features/purchase-requests'
import {
  conformityLevels,
  requestStatuses,
} from '@/features/purchase-requests/schemas/purchase-request'

const searchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
  status: z.array(z.enum(requestStatuses)).optional().catch([]),
  conformity: z.array(z.enum(conformityLevels)).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/solicitacoes/')({
  validateSearch: searchSchema,
  component: PurchaseRequests,
})
