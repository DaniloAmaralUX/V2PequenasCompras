import { z } from 'zod'

/**
 * Domínio (mínimo) da Solicitação de Pequena Compra.
 * Schemas Zod são a fonte de verdade para tipos e validações.
 * Calibração: enxuto (design-first) — expandir conforme as telas exigirem.
 */

export const requestStatuses = [
  'draft',
  'needs_correction',
  'redirected',
  'blocked',
  'awaiting_approval',
  'rejected',
  'approved',
  'queued_for_sap',
  'processing_sap',
  'integration_error',
  'completed',
] as const
export type RequestStatus = (typeof requestStatuses)[number]

/** Resultado-resumo de conformidade exibido em listas e badges. */
export const conformityLevels = ['ok', 'attention', 'blocked', 'pending'] as const
export type Conformity = (typeof conformityLevels)[number]

export const urgencyLevels = ['baixa', 'media', 'alta'] as const
export type Urgency = (typeof urgencyLevels)[number]

export const supplierStatuses = ['homologado', 'bloqueado', 'inexistente'] as const
export type SupplierStatus = (typeof supplierStatuses)[number]

/** Motivo de bloqueio/direcionamento (alimenta as validações exibidas). */
export const blockReasons = [
  'over_limit',
  'supplier_blocked',
  'stock_item',
  'active_contract',
  'fractionation',
  'missing_evidence',
  'not_homologated',
] as const
export type BlockReason = (typeof blockReasons)[number]

/** Área responsável atual pela solicitação (exibida junto do status). */
export const ownerAreas = [
  'Requisitante',
  'Gestor',
  'Compras/Suprimentos',
  'Compliance',
  'TI',
  'Sistema',
] as const
export type OwnerArea = (typeof ownerAreas)[number]

export const itemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().int().positive(),
  unitValue: z.number().nonnegative(),
  isStock: z.boolean().optional(),
  hasActiveContract: z.boolean().optional(),
})
export type Item = z.infer<typeof itemSchema>

export const purchaseRequestSchema = z.object({
  id: z.string(),
  /** Código legível, ex.: PC-2026-0001 */
  code: z.string(),
  requester: z.object({ id: z.string(), name: z.string() }),
  unit: z.string(),
  costCenter: z.string(),
  objectNature: z.string(),
  description: z.string(),
  justification: z.string(),
  urgency: z.enum(urgencyLevels),
  items: z.array(itemSchema),
  totalValue: z.number().nonnegative(),
  supplierName: z.string().optional(),
  supplierStatus: z.enum(supplierStatuses).optional(),
  blockReason: z.enum(blockReasons).optional(),
  status: z.enum(requestStatuses),
  conformity: z.enum(conformityLevels),
  ownerArea: z.enum(ownerAreas),
  /** ISO date (YYYY-MM-DD) — protótipo */
  createdAt: z.string(),
  updatedAt: z.string(),
  /** Referência do pedido no SAP, quando criado. */
  sapOrderRef: z.string().optional(),
})
export type PurchaseRequest = z.infer<typeof purchaseRequestSchema>
