import { z } from 'zod'
import { supplierStatuses } from './purchase-request'
import { itemFormSchema, quoteFormSchema } from './new-request'

/**
 * Subset editável na correção de uma solicitação devolvida (F-05). Reusa os
 * sub-schemas de Nova solicitação. Só os campos que o requisitante pode ajustar
 * para resolver pendências; o restante da solicitação é preservado.
 */
export const correctionSchema = z.object({
  description: z.string().min(1, 'Descreva a necessidade.'),
  justification: z.string().min(1, 'A justificativa é obrigatória.'),
  items: z.array(itemFormSchema).min(1, 'Inclua ao menos um item.'),
  supplierName: z.string().optional(),
  supplierStatus: z.enum(supplierStatuses).optional(),
  quotes: z.array(quoteFormSchema),
  evidenceCount: z.number(),
})

export type CorrectionForm = z.infer<typeof correctionSchema>
