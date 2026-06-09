import { createFileRoute } from '@tanstack/react-router'
import { CorrectionForm } from '@/features/purchase-requests/components/correction-form'

export const Route = createFileRoute(
  '/_authenticated/solicitacoes/$id_/corrigir'
)({
  component: CorrectionForm,
})
