import { createFileRoute } from '@tanstack/react-router'
import { AdminRules } from '@/features/admin/rules'

export const Route = createFileRoute('/_authenticated/administracao/regras')({
  component: AdminRules,
})
