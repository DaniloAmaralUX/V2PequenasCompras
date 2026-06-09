import { type Validation, getValidations } from '../data/derive'
import { type CorrectionForm } from '../schemas/correction'
import { type PurchaseRequest } from '../schemas/purchase-request'

/**
 * Resolução de pendências na correção (F-05). Cada validação acionável
 * (severidade warning/block) ganha a seção-âncora do formulário e um predicate
 * que diz, ao vivo, se já foi resolvida a partir dos valores do formulário.
 */
export type SectionId = 'sec-necessidade' | 'sec-fornecedor' | 'sec-evidencias'

type PendencyMeta = {
  sectionId: SectionId
  resolved: (v: CorrectionForm) => boolean
}

const pendencyMeta: Record<string, PendencyMeta> = {
  fields: {
    sectionId: 'sec-necessidade',
    resolved: (v) => v.justification.trim() !== '' && v.items.length > 0,
  },
  reason: {
    sectionId: 'sec-evidencias',
    resolved: (v) => v.evidenceCount >= 1,
  },
  supplier: {
    sectionId: 'sec-fornecedor',
    resolved: (v) =>
      v.supplierStatus === 'homologado' ||
      v.quotes.some((q) => q.supplierName.trim() !== '' && q.value > 0),
  },
}

export type Pendency = Validation & { sectionId: SectionId; resolved: boolean }

/** Pendências acionáveis da solicitação, com estado de resolução ao vivo. */
export function getPendencies(
  req: PurchaseRequest,
  values: CorrectionForm
): Pendency[] {
  return getValidations(req)
    .filter(
      (val) =>
        (val.severity === 'warning' || val.severity === 'block') &&
        pendencyMeta[val.id]
    )
    .map((val) => {
      const meta = pendencyMeta[val.id]
      return { ...val, sectionId: meta.sectionId, resolved: meta.resolved(values) }
    })
}
