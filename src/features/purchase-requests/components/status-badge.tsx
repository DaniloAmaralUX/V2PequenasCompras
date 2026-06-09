import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { conformityMeta, statusMeta } from '../data/status'
import {
  type Conformity,
  type RequestStatus,
} from '../schemas/purchase-request'

/** Badge de status (texto + ícone + cor; nunca só cor). */
export function StatusBadge({
  status,
  className,
}: {
  status: RequestStatus
  className?: string
}) {
  const meta = statusMeta[status]
  const Icon = meta.icon
  return (
    <Badge className={cn('gap-1', meta.badgeClassName, className)}>
      <Icon className='size-3' />
      {meta.label}
    </Badge>
  )
}

/** Badge de resultado de conformidade. */
export function ConformityBadge({
  conformity,
  className,
}: {
  conformity: Conformity
  className?: string
}) {
  const meta = conformityMeta[conformity]
  const Icon = meta.icon
  return (
    <Badge className={cn('gap-1', meta.badgeClassName, className)}>
      <Icon className='size-3' />
      {meta.label}
    </Badge>
  )
}
