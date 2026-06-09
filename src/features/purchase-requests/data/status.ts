import {
  ArrowUpRight,
  BadgeCheck,
  Ban,
  CheckCheck,
  CircleCheck,
  CircleX,
  Clock,
  FileText,
  Hourglass,
  OctagonAlert,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react'
import {
  type Conformity,
  type RequestStatus,
} from '../schemas/purchase-request'

type StatusMeta = {
  label: string
  /** Classe Tailwind aplicada ao Badge (texto+ícone+cor; nunca só cor). */
  badgeClassName: string
  icon: React.ElementType
  /** Tom semântico para legenda/lógica. */
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
}

const tones = {
  neutral: 'border-transparent bg-muted text-muted-foreground',
  info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  success:
    'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  warning:
    'border-transparent bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
  danger:
    'border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
} as const

/** Mapa central de apresentação dos 11 status (PRD Design §8). */
export const statusMeta: Record<RequestStatus, StatusMeta> = {
  draft: { label: 'Rascunho', icon: FileText, tone: 'neutral', badgeClassName: tones.neutral },
  needs_correction: {
    label: 'Correção necessária',
    icon: TriangleAlert,
    tone: 'warning',
    badgeClassName: tones.warning,
  },
  redirected: {
    label: 'Fora do fluxo',
    icon: ArrowUpRight,
    tone: 'neutral',
    badgeClassName: tones.neutral,
  },
  blocked: { label: 'Bloqueada', icon: Ban, tone: 'danger', badgeClassName: tones.danger },
  awaiting_approval: {
    label: 'Aguardando aprovação',
    icon: Clock,
    tone: 'info',
    badgeClassName: tones.info,
  },
  rejected: { label: 'Rejeitada', icon: CircleX, tone: 'danger', badgeClassName: tones.danger },
  approved: {
    label: 'Aprovada',
    icon: CircleCheck,
    tone: 'success',
    badgeClassName: tones.success,
  },
  queued_for_sap: {
    label: 'Na fila do SAP',
    icon: Hourglass,
    tone: 'info',
    badgeClassName: tones.info,
  },
  processing_sap: {
    label: 'Registrando no SAP',
    icon: RefreshCw,
    tone: 'info',
    badgeClassName: tones.info,
  },
  integration_error: {
    label: 'Erro no registro',
    icon: OctagonAlert,
    tone: 'danger',
    badgeClassName: tones.danger,
  },
  completed: {
    label: 'Pedido criado',
    icon: CheckCheck,
    tone: 'success',
    badgeClassName: tones.success,
  },
}

type ConformityMeta = { label: string; badgeClassName: string; icon: React.ElementType }

export const conformityMeta: Record<Conformity, ConformityMeta> = {
  ok: { label: 'Conforme', icon: BadgeCheck, badgeClassName: tones.success },
  attention: { label: 'Atenção', icon: TriangleAlert, badgeClassName: tones.warning },
  blocked: { label: 'Bloqueio', icon: Ban, badgeClassName: tones.danger },
  pending: { label: 'Pendente', icon: Clock, badgeClassName: tones.neutral },
}

export const statusOptions = (
  Object.keys(statusMeta) as RequestStatus[]
).map((value) => ({ value, label: statusMeta[value].label }))

export const conformityOptions = (
  Object.keys(conformityMeta) as Conformity[]
).map((value) => ({ value, label: conformityMeta[value].label }))
