import { getRouteApi, Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
} from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageTransition } from '@/components/layout/page-transition'
import { PlaceholderPage } from '@/components/layout/placeholder-page'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { getPendencies, type SectionId } from '../lib/pendencies'
import { formatBRL } from '../lib/format'
import {
  type CorrectionForm as CorrectionValues,
  correctionSchema,
} from '../schemas/correction'
import { useRequest } from '../data/use-requests'
import { useRequestOverridesStore } from '../stores/request-overrides-store'
import { EvidenceUploader } from './evidence-uploader'
import { StatusBadge } from './status-badge'
import { SupplierCombobox } from './supplier-combobox'

const route = getRouteApi('/_authenticated/solicitacoes/$id_/corrigir')

function scrollToSection(id: SectionId) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.querySelector<HTMLElement>(
    'input, textarea, button, [tabindex]'
  )?.focus({ preventScroll: true })
}

export function CorrectionForm() {
  const { id } = route.useParams()
  const navigate = route.useNavigate()
  const req = useRequest(id)
  const resubmit = useRequestOverridesStore((s) => s.resubmit)

  const form = useForm<CorrectionValues>({
    resolver: zodResolver(correctionSchema),
    mode: 'onChange',
    defaultValues: {
      description: req?.description ?? '',
      justification: req?.justification ?? '',
      items:
        req?.items.map((it) => ({
          description: it.description,
          quantity: it.quantity,
          unitValue: it.unitValue,
        })) ?? [],
      supplierName: req?.supplierName ?? '',
      supplierStatus: req?.supplierStatus,
      quotes: [],
      evidenceCount: 0,
    },
  })

  const items = useFieldArray({ control: form.control, name: 'items' })

  if (!req) {
    return (
      <PlaceholderPage
        title='Solicitação não encontrada'
        description='Verifique o código ou volte para a lista de solicitações.'
      />
    )
  }

  if (req.status !== 'needs_correction' && req.status !== 'integration_error') {
    return (
      <PlaceholderPage
        title='Esta solicitação não está em correção'
        description='Apenas solicitações devolvidas para correção podem ser editadas aqui.'
      />
    )
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = form.watch()
  const pendencies = getPendencies(req, values)
  const allResolved = pendencies.every((p) => p.resolved)
  const noErrors = Object.keys(form.formState.errors).length === 0
  const canResubmit = allResolved && noErrors

  const total = values.items.reduce(
    (sum, it) => sum + (it.quantity || 0) * (it.unitValue || 0),
    0
  )

  const handleResubmit = () => {
    if (!canResubmit) {
      const firstOpen = pendencies.find((p) => !p.resolved)
      if (firstOpen) scrollToSection(firstOpen.sectionId)
      return
    }
    resubmit(req.id)
    toast.success('Solicitação reenviada para aprovação.', {
      description: `${req.code} voltou para a fila do gestor.`,
    })
    navigate({
      to: '/solicitacoes/$id',
      params: { id: req.id },
      search: { tab: 'historico' },
    })
  }

  const handleSave = () => {
    toast('Alterações salvas.', {
      description: allResolved
        ? 'Pendências resolvidas — você já pode reenviar.'
        : 'Ainda há pendências a resolver antes de reenviar.',
    })
  }

  return (
    <PageTransition>
      <Header fixed>
        <Button asChild variant='ghost' size='sm' className='me-auto'>
          <Link to='/solicitacoes/$id' params={{ id: req.id }}>
            <ArrowLeft />
            Voltar ao detalhe
          </Link>
        </Button>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='space-y-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Corrigir {req.code}
            </h2>
            <StatusBadge status={req.status} />
          </div>
          <p className='text-muted-foreground'>
            Resolva as pendências abaixo e reenvie. O histórico da solicitação é
            preservado.
          </p>
        </div>

        {/* Resumo de pendências com âncoras */}
        {pendencies.length > 0 && (
          <Alert
            className={cn(
              allResolved
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
                : 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200'
            )}
          >
            <AlertTitle>
              {allResolved
                ? 'Tudo resolvido — pronto para reenviar'
                : 'Pendências a resolver'}
            </AlertTitle>
            <AlertDescription>
              <ul className='stagger-list mt-1 flex w-full flex-col gap-1'>
                {pendencies.map((p) => (
                  <li key={p.id}>
                    <button
                      type='button'
                      onClick={() => scrollToSection(p.sectionId)}
                      className='flex w-full items-start gap-2 rounded-md p-1 text-start transition-colors duration-150 hover:bg-foreground/5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none'
                    >
                      {p.resolved ? (
                        <CheckCircle2 className='mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400' />
                      ) : (
                        <Circle className='mt-0.5 size-4 shrink-0 opacity-60' />
                      )}
                      <span>
                        <span className='font-medium'>{p.label}</span>
                        {' — '}
                        <span
                          className={cn(p.resolved && 'line-through opacity-70')}
                        >
                          {p.message}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            id='correction-form'
            onSubmit={(e) => {
              e.preventDefault()
              handleResubmit()
            }}
            className='flex flex-col gap-4 sm:gap-6'
          >
            {/* Necessidade */}
            <Card id='sec-necessidade'>
              <CardHeader>
                <CardTitle>Necessidade</CardTitle>
                <CardDescription>
                  Descrição, justificativa e itens da compra.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='justification'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justificativa</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Itens</FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        items.append({
                          description: '',
                          quantity: 1,
                          unitValue: 0,
                        })
                      }
                    >
                      <Plus className='size-4' />
                      Adicionar item
                    </Button>
                  </div>
                  {items.fields.map((row, i) => (
                    <div
                      key={row.id}
                      className='grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto_auto]'
                    >
                      <FormField
                        control={form.control}
                        name={`items.${i}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder='Descrição do item' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${i}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type='number'
                                min={1}
                                className='w-20'
                                aria-label='Quantidade'
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${i}.unitValue`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type='number'
                                min={0}
                                step='0.01'
                                className='w-28'
                                aria-label='Valor unitário'
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='size-9'
                        aria-label='Remover item'
                        disabled={items.fields.length <= 1}
                        onClick={() => items.remove(i)}
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>
                  ))}
                  <p className='text-end text-sm font-medium'>
                    Total: <span className='tabular-nums'>{formatBRL(total)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Fornecedor */}
            <Card id='sec-fornecedor'>
              <CardHeader>
                <CardTitle>Fornecedor</CardTitle>
                <CardDescription>
                  Confirme ou ajuste o fornecedor da compra.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <SupplierCombobox
                  value={values.supplierName}
                  onSelect={({ name, status }) => {
                    form.setValue('supplierName', name, { shouldValidate: true })
                    form.setValue('supplierStatus', status, {
                      shouldValidate: true,
                    })
                  }}
                />
                {values.supplierStatus && (
                  <p className='text-xs text-muted-foreground'>
                    Situação do fornecedor: {values.supplierStatus}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Evidências */}
            <Card id='sec-evidencias'>
              <CardHeader>
                <CardTitle>Evidências</CardTitle>
                <CardDescription>
                  Anexe a evidência obrigatória desta solicitação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EvidenceUploader
                  onCountChange={(count) =>
                    form.setValue('evidenceCount', count, {
                      shouldValidate: true,
                    })
                  }
                />
              </CardContent>
            </Card>

            {/* Ações */}
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <Button asChild variant='ghost'>
                <Link to='/solicitacoes/$id' params={{ id: req.id }}>
                  Voltar
                </Link>
              </Button>
              <div className='flex items-center gap-2'>
                <Button type='button' variant='outline' onClick={handleSave}>
                  Salvar
                </Button>
                <Button type='submit' disabled={!canResubmit}>
                  Reenviar para aprovação
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Main>
    </PageTransition>
  )
}
