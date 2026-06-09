import { z } from 'zod'
import { supplierStatuses, urgencyLevels } from './purchase-request'

export const itemFormSchema = z.object({
  description: z.string().min(1, 'Informe a descrição do item.'),
  quantity: z
    .number({ message: 'Informe a quantidade.' })
    .int('Use um número inteiro.')
    .positive('Quantidade deve ser maior que zero.'),
  unitValue: z
    .number({ message: 'Informe o valor unitário.' })
    .nonnegative('O valor não pode ser negativo.'),
})
export type ItemForm = z.infer<typeof itemFormSchema>

export const quoteFormSchema = z.object({
  supplierName: z.string().min(1, 'Informe o fornecedor ou a fonte.'),
  value: z.number({ message: 'Informe o valor.' }).nonnegative('Valor inválido.'),
  collectedAt: z.string().optional(),
})
export type QuoteForm = z.infer<typeof quoteFormSchema>

export const newRequestSchema = z
  .object({
    // Etapa 1 — Enquadramento
    unit: z.string().min(1, 'Selecione a unidade.'),
    costCenter: z.string().min(1, 'Informe o centro de custo.'),
    objectNature: z.string().min(1, 'Selecione a natureza do objeto.'),
    /** Prazo desejado de atendimento — alimenta a urgência automática (modelo Direct Buy). */
    desiredDate: z.string().optional(),
    urgency: z.enum(urgencyLevels),
    /** Obrigatória quando a urgência é alta (compliance — fonte: mapeamento Base-b). */
    urgencyJustification: z.string().optional(),
    estimatedValue: z
      .number({ message: 'Informe o valor estimado.' })
      .nonnegative('O valor não pode ser negativo.'),
    // Etapa 2 — Necessidade
    description: z.string().min(1, 'Descreva a necessidade.'),
    justification: z.string().min(1, 'A justificativa é obrigatória.'),
    items: z.array(itemFormSchema).min(1, 'Inclua ao menos um item.'),
    // Etapa 3 — Fornecedor e preços
    supplierName: z.string().optional(),
    supplierStatus: z.enum(supplierStatuses).optional(),
    quotes: z.array(quoteFormSchema),
    lowestPriceJustification: z.string().optional(),
    // Etapa 4 — Evidências
    evidenceCount: z.number(),
  })
  .superRefine((data, ctx) => {
    // Justificativa da urgência é obrigatória quando urgente (urgência = alta).
    if (
      data.urgency === 'alta' &&
      (!data.urgencyJustification || data.urgencyJustification.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['urgencyJustification'],
        message: 'Justifique a urgência (prazo curto).',
      })
    }
  })
export type NewRequestForm = z.infer<typeof newRequestSchema>
