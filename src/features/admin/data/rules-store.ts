import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { SMALL_PURCHASE_LIMIT } from '@/features/purchase-requests/data/form-options'

/**
 * Parâmetros autorizados do protótipo (hipótese DEC-12: só limite de valor e
 * quantidade mínima de cotações no MVP). Persistido em sessionStorage; as
 * alterações geram histórico (ator/data-hora/anterior→novo) e valem apenas para
 * novas validações — não reescrevem solicitações já processadas. Substituir por
 * API real fora do escopo.
 */
export type RuleKey = 'small_purchase_limit' | 'min_quotes'

export type RuleChange = {
  id: string
  rule: RuleKey
  before: number
  after: number
  actor: string
  at: string
}

type RulesState = {
  values: Record<RuleKey, number>
  history: RuleChange[]
  setRule: (rule: RuleKey, after: number, actor: string) => void
}

export const useRulesStore = create<RulesState>()(
  persist(
    (set) => ({
      values: {
        small_purchase_limit: SMALL_PURCHASE_LIMIT,
        min_quotes: 3,
      },
      history: [],
      setRule: (rule, after, actor) =>
        set((s) => {
          const before = s.values[rule]
          if (before === after) return s
          const change: RuleChange = {
            id: `${rule}-${s.history.length}`,
            rule,
            before,
            after,
            actor,
            at: new Date().toISOString(),
          }
          return {
            values: { ...s.values, [rule]: after },
            history: [change, ...s.history],
          }
        }),
    }),
    {
      name: 'pc-rules',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
