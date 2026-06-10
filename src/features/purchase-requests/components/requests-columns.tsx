import { type ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { conformityMeta, statusMeta } from '../data/status'
import { formatBRL, formatDate, waitingLabel } from '../lib/format'
import { type PurchaseRequest } from '../schemas/purchase-request'

export const requestsColumns: ColumnDef<PurchaseRequest>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Código' />,
    cell: ({ row }) => (
      <Link
        to='/solicitacoes/$id'
        params={{ id: row.original.id }}
        className='font-medium text-primary hover:underline'
      >
        {row.getValue('code')}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Necessidade' />
    ),
    meta: { className: 'min-w-56', label: 'Necessidade' },
    cell: ({ row }) => (
      <div className='flex max-w-[20rem] flex-col'>
        <span className='truncate font-medium'>{row.getValue('description')}</span>
        <span className='truncate text-xs text-muted-foreground'>
          {row.original.objectNature}
        </span>
      </div>
    ),
  },
  {
    id: 'requester',
    accessorFn: (r) => r.requester.name,
    header: 'Requisitante',
    meta: { label: 'Requisitante' },
    cell: ({ row }) => (
      <span className='truncate'>{row.original.requester.name}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Unidade' />,
    meta: { label: 'Unidade' },
    cell: ({ row }) => <span className='truncate'>{row.getValue('unit')}</span>,
  },
  {
    accessorKey: 'totalValue',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Valor' />,
    meta: { thClassName: 'text-end', tdClassName: 'text-end', label: 'Valor' },
    cell: ({ row }) => (
      <span className='font-medium tabular-nums'>
        {formatBRL(row.getValue('totalValue'))}
      </span>
    ),
  },
  {
    id: 'supplier',
    accessorFn: (r) => r.supplierName ?? '',
    header: 'Fornecedor',
    meta: { label: 'Fornecedor' },
    cell: ({ row }) => (
      <span className='truncate'>{row.original.supplierName ?? '—'}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'conformity',
    header: 'Conformidade',
    meta: { label: 'Conformidade' },
    cell: ({ row }) => {
      const meta = conformityMeta[row.original.conformity]
      const Icon = meta.icon
      return (
        <Badge className={cn('gap-1', meta.badgeClassName)}>
          <Icon className='size-3' />
          {meta.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id)),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    meta: { label: 'Status' },
    cell: ({ row }) => {
      const meta = statusMeta[row.original.status]
      const Icon = meta.icon
      return (
        <Badge className={cn('gap-1', meta.badgeClassName)}>
          <Icon className='size-3' />
          {meta.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id)),
    enableSorting: false,
  },
  {
    id: 'waiting',
    accessorFn: (r) => r.createdAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Aguardando' />
    ),
    meta: { label: 'Aguardando' },
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span>{waitingLabel(row.original.createdAt)}</span>
        <span className='text-xs text-muted-foreground'>
          {formatDate(row.original.createdAt)}
        </span>
      </div>
    ),
  },
]
