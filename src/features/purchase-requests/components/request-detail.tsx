import { getRouteApi } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/layout/placeholder-page'
import { mockRequests } from '../data/mock-requests'

const route = getRouteApi('/_authenticated/solicitacoes/$id')

/**
 * Detalhe da solicitação. Stub (Inc.7 construirá as abas: visão geral,
 * cotações, validações, aprovação, SAP e histórico).
 */
export function RequestDetail() {
  const { id } = route.useParams()
  const req = mockRequests.find((r) => r.id === id)
  return (
    <PlaceholderPage
      title={req ? `Solicitação ${req.code}` : 'Solicitação'}
      description='Detalhe com abas (visão geral, cotações, validações, aprovação, SAP e histórico) — em construção.'
    />
  )
}
