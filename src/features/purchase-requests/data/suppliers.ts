import { type SupplierStatus } from '../schemas/purchase-request'

export type MockSupplier = {
  id: string
  name: string
  document: string
  status: SupplierStatus
}

/** Fornecedores-mock para o combobox (situação de homologação). */
export const mockSuppliers: MockSupplier[] = [
  { id: 's1', name: 'Papelaria Central Ltda', document: '12.345.678/0001-90', status: 'homologado' },
  { id: 's2', name: 'Café & Cia Buffet', document: '23.456.789/0001-01', status: 'homologado' },
  { id: 's3', name: 'Higiene Total Ltda', document: '34.567.890/0001-12', status: 'homologado' },
  { id: 's4', name: 'InfoSupply Tecnologia', document: '45.678.901/0001-23', status: 'homologado' },
  { id: 's5', name: 'Gráfica Expressa', document: '56.789.012/0001-34', status: 'homologado' },
  { id: 's6', name: 'ManutPredial Serviços', document: '67.890.123/0001-45', status: 'bloqueado' },
]
