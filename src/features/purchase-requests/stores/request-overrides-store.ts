import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { type PurchaseRequest } from '../schemas/purchase-request'

/**
 * Overrides do protótipo para refletir decisões do usuário — aprovar/rejeitar —
 * sem backend. As telas leem o pedido efetivo via use-requests (mock + override).
 * Persistido em sessionStorage para sobreviver a recarregamentos durante a
 * navegação; é zerado ao fechar a aba. Substituir por mutations reais (API) fora
 * do escopo do protótipo.
 */
type Decision = { reasonCode?: string; reasonText?: string }

type RequestOverridesState = {
  overrides: Record<string, Partial<PurchaseRequest>>
  decisions: Record<string, Decision>
  approve: (id: string) => void
  reject: (id: string, reasonCode: string, reasonText?: string) => void
  resubmit: (id: string) => void
}

export const useRequestOverridesStore = create<RequestOverridesState>()(
  persist(
    (set) => ({
      overrides: {},
      decisions: {},
      approve: (id) =>
        set((s) => ({
          overrides: {
            ...s.overrides,
            [id]: { status: 'queued_for_sap', ownerArea: 'Sistema' },
          },
        })),
      reject: (id, reasonCode, reasonText) =>
        set((s) => ({
          overrides: {
            ...s.overrides,
            [id]: { status: 'rejected', ownerArea: 'Gestor' },
          },
          decisions: { ...s.decisions, [id]: { reasonCode, reasonText } },
        })),
      resubmit: (id) =>
        set((s) => ({
          overrides: {
            ...s.overrides,
            [id]: { status: 'awaiting_approval', ownerArea: 'Gestor' },
          },
        })),
    }),
    {
      name: 'pc-overrides',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ overrides: s.overrides, decisions: s.decisions }),
    }
  )
)
