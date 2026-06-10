import { useState } from 'react'
import { History, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { roleLabels } from '@/config/roles'
import { useMockRoleStore } from '@/stores/mock-role-store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageTransition } from '@/components/layout/page-transition'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { formatBRL, formatDate } from '@/features/purchase-requests/lib/format'
import { type RuleKey, useRulesStore } from './data/rules-store'

type RuleMeta = {
  key: RuleKey
  label: string
  description: string
  kind: 'currency' | 'count'
  min: number
}

const RULES: RuleMeta[] = [
  {
    key: 'small_purchase_limit',
    label: 'Limite de pequenas compras',
    description: 'Valor máximo para uma compra seguir pelo fluxo simplificado.',
    kind: 'currency',
    min: 1,
  },
  {
    key: 'min_quotes',
    label: 'Cotações mínimas',
    description: 'Quantidade mínima de preços exigida no fluxo de exceção.',
    kind: 'count',
    min: 1,
  },
]

function formatRule(kind: RuleMeta['kind'], value: number): string {
  return kind === 'currency' ? formatBRL(value) : String(value)
}

export function AdminRules() {
  const role = useMockRoleStore((s) => s.role)
  const actor = roleLabels[role].label

  return (
    <PageTransition>
      <Header fixed>
        <div className='me-auto flex items-center gap-2 text-sm text-muted-foreground'>
          <ShieldCheck className='size-3.5' />
          Parâmetros autorizados
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Administração — Regras
          </h2>
          <p className='text-muted-foreground'>
            Ajuste parâmetros autorizados. A alteração vale para novas validações
            e não reescreve solicitações já processadas.
          </p>
        </div>

        <div className='stagger-list grid gap-4 lg:grid-cols-2'>
          {RULES.map((rule) => (
            <RuleEditor key={rule.key} rule={rule} actor={actor} />
          ))}
        </div>

        <RuleHistory />

        <p className='text-xs text-muted-foreground'>
          Hipótese — a confirmar com o SESI (DEC-12): lista de parâmetros editáveis
          e perfis autorizados. No MVP, apenas limite e cotações mínimas.
        </p>
      </Main>
    </PageTransition>
  )
}

function RuleEditor({ rule, actor }: { rule: RuleMeta; actor: string }) {
  const value = useRulesStore((s) => s.values[rule.key])
  const setRule = useRulesStore((s) => s.setRule)
  const [draft, setDraft] = useState(String(value))
  const [confirmOpen, setConfirmOpen] = useState(false)

  const parsed = Number(draft)
  const valid = Number.isFinite(parsed) && parsed >= rule.min
  const changed = valid && parsed !== value

  const handleConfirm = () => {
    setRule(rule.key, parsed, actor)
    setConfirmOpen(false)
    toast.success('Parâmetro atualizado.', {
      description: `${rule.label}: ${formatRule(rule.kind, value)} → ${formatRule(rule.kind, parsed)}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{rule.label}</CardTitle>
        <CardDescription>{rule.description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <p className='text-xs text-muted-foreground'>Valor atual</p>
          <p className='text-2xl font-bold tabular-nums'>
            {formatRule(rule.kind, value)}
          </p>
        </div>
        <div className='space-y-2'>
          <Label htmlFor={`rule-${rule.key}`}>
            Novo valor {rule.kind === 'currency' ? '(R$)' : '(quantidade)'}
          </Label>
          <Input
            id={`rule-${rule.key}`}
            type='number'
            min={rule.min}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-invalid={!valid}
          />
          {!valid && (
            <p className='text-sm text-destructive'>
              Informe um valor válido (mínimo {rule.min}).
            </p>
          )}
        </div>
        <Button
          type='button'
          disabled={!changed}
          onClick={() => setConfirmOpen(true)}
        >
          Salvar alteração
        </Button>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title='Confirmar alteração de parâmetro'
        confirmText='Confirmar'
        cancelBtnText='Cancelar'
        desc={
          <div className='space-y-2'>
            <p>Esta alteração afeta as próximas validações. Deseja confirmar?</p>
            <div className='flex items-center gap-3 rounded-md border p-3 text-sm'>
              <span className='text-muted-foreground line-through'>
                {formatRule(rule.kind, value)}
              </span>
              <span aria-hidden>→</span>
              <span className='font-semibold'>
                {formatRule(rule.kind, parsed)}
              </span>
            </div>
          </div>
        }
        handleConfirm={handleConfirm}
      />
    </Card>
  )
}

function RuleHistory() {
  const history = useRulesStore((s) => s.history)
  const ruleLabel: Record<RuleKey, RuleMeta> = {
    small_purchase_limit: RULES[0],
    min_quotes: RULES[1],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <History className='size-4' />
          Histórico de alterações
        </CardTitle>
        <CardDescription>
          Registro de quem alterou, quando e o valor anterior → novo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length ? (
          <ol className='stagger-list flex flex-col'>
            {history.map((c, i) => {
              const meta = ruleLabel[c.rule]
              return (
                <li key={c.id}>
                  {i > 0 && <Separator className='my-3' />}
                  <div className='flex flex-wrap items-center justify-between gap-2 text-sm'>
                    <span className='font-medium'>{meta.label}</span>
                    <span className='flex items-center gap-2 tabular-nums'>
                      <span className='text-muted-foreground line-through'>
                        {formatRule(meta.kind, c.before)}
                      </span>
                      <span aria-hidden>→</span>
                      <span className='font-semibold'>
                        {formatRule(meta.kind, c.after)}
                      </span>
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {c.actor} · {formatDate(c.at)}
                  </p>
                </li>
              )
            })}
          </ol>
        ) : (
          <Alert>
            <History className='size-4' />
            <AlertTitle>Nenhuma alteração ainda</AlertTitle>
            <AlertDescription>
              As alterações de parâmetros aparecerão aqui com autor e data.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
