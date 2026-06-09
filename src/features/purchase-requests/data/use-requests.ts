import { useRequestOverridesStore } from '../stores/request-overrides-store'
import { type PurchaseRequest } from '../schemas/purchase-request'
import { mockRequests } from './mock-requests'

/** Lista de solicitações com os overrides (decisões do protótipo) aplicados. */
export function useRequests(): PurchaseRequest[] {
  const overrides = useRequestOverridesStore((s) => s.overrides)
  return mockRequests.map((r) =>
    overrides[r.id] ? { ...r, ...overrides[r.id] } : r
  )
}

/** Uma solicitação efetiva (mock + override) por id. */
export function useRequest(id: string): PurchaseRequest | undefined {
  return useRequests().find((r) => r.id === id)
}
