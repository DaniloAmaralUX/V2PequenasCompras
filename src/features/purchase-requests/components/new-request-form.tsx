import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, Ban, Check, Loader2, Plus, Trash2 } from 'lucide-react'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageTransition } from '@/components/layout/page-transition'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  SMALL_PURCHASE_LIMIT,
  URGENCY_THRESHOLD_DAYS,
  mockRequesterProfile,
  objectNatureOptions,
  unitOptions,
  urgencyOptions,
} from '../data/form-options'
import { formatBRL } from '../lib/format'
import { type NewRequestForm, newRequestSchema } from '../schemas/new-request'
import { EvidenceUploader } from './evidence-uploader'
import { RequestStepper } from './request-stepper'
import { SupplierCombobox } from './supplier-combobox'

const STEPS = [
  'Enquadramento',
  'Necessidade',
  'Fornecedor e preços',
  'Evidências',
  'Revisão',
]

const stepFields: (keyof NewRequestForm)[][] = [
  [
    'unit',
    'costCenter',
    'objectNature',
    'urgency',
    'urgencyJustification',
    'estimatedValue',
  ],
  ['description', 'justification', 'items'],
  [],
  [],
]

/** Dias entre hoje e o prazo desejado (modelo Direct Buy: prazo curto = urgente). */
function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(target.getTime())) return null
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000)
}

type DraftState = 'idle' | 'saving' | 'saved'

export function NewRequestForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<DraftState>('idle')
  const draftTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const form = useForm<NewRequestForm>({
    resolver: zodResolver(newRequestSchema),
    mode: 'onTouched',
    defaultValues: {
      // Pré-preenchidos pelo perfil do requisitante (editáveis) — modelo Direct Buy.
      unit: mockRequesterProfile.unit,
      costCenter: mockRequesterProfile.costCenter,
      objectNature: '',
      desiredDate: '',
      urgency: 'media',
      urgencyJustification: '',
      estimatedValue: undefined as unknown as number,
      description: '',
      justification: '',
      items: [
        { description: '', quantity: 1, unitValue: undefined as unknown as number },
      ],
      supplierName: undefined,
      supplierStatus: undefined,
      quotes: [],
      lowestPriceJustification: '',
      evidenceCount: 0,
    },
  })

  const itemsFA = useFieldArray({ control: form.control, name: 'items' })
  const quotesFA = useFieldArray({ control: form.control, name: 'quotes' })

  // Rascunho automático (protótipo)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const sub = form.watch(() => {
      setDraft('saving')
      clearTimeout(draftTimer.current)
      draftTimer.current = setTimeout(() => setDraft('saved'), 600)
    })
    return () => sub.unsubscribe()
  }, [form])

  // Aviso ao sair com alterações não salvas
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [form])

  const items = form.watch('items')
  const total = (items ?? []).reduce(
    (sum, it) => sum + (Number(it?.quantity) || 0) * (Number(it?.unitValue) || 0),
    0
  )
  const estimated = form.watch('estimatedValue')
  const overLimit = typeof estimated === 'number' && estimated > SMALL_PURCHASE_LIMIT
  const supplierStatus = form.watch('supplierStatus')
  const supplierName = form.watch('supplierName')
  const desiredDate = form.watch('desiredDate') ?? ''
  const urgency = form.watch('urgency')
  const daysToDeadline = daysUntil(desiredDate)
  const autoUrgent =
    daysToDeadline !== null &&
    daysToDeadline >= 0 &&
    daysToDeadline < URGENCY_THRESHOLD_DAYS

  // Urgência automática (modelo Direct Buy): prazo curto marca como urgente.
  // Mantém "editável" — só promove para alta; o requisitante pode rever depois.
  useEffect(() => {
    if (autoUrgent && form.getValues('urgency') !== 'alta') {
      form.setValue('urgency', 'alta', { shouldValidate: true, shouldDirty: true })
    }
  }, [autoUrgent, form])

  const next = async () => {
    const fields = stepFields[step]
    if (fields.length && !(await form.trigger(fields))) return
    if (step === 0 && overLimit) return
    if (step === STEPS.length - 2) await form.trigger()
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }
  const back = () => setStep((s) => Math.max(0, s - 1))

  const onSubmit = (data: NewRequestForm) => {
    toast.success('Solicitação enviada para aprovação.', {
      description: `${data.items.length} item(ns) · ${formatBRL(total)}`,
    })
    navigate({ to: '/solicitacoes' })
  }

  const errorKeys = Object.keys(form.formState.errors)

  return (
    <PageTransition>
      <Header fixed>
        <div className='me-auto flex items-center gap-2 text-sm text-muted-foreground'>
          {draft === 'saving' ? (
            <>
              <Loader2 className='size-3.5 animate-spin' /> Salvando…
            </>
          ) : draft === 'saved' ? (
            <>
              <Check className='size-3.5' /> Rascunho salvo
            </>
          ) : (
            <span>Rascunho automático</span>
          )}
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Nova solicitação</h2>
            <p className='text-muted-foreground'>
              Pequena compra — preencha as etapas. Você pode voltar sem perder os
              dados.
            </p>
          </div>
          <Button variant='outline' onClick={() => navigate({ to: '/solicitacoes' })}>
            Cancelar
          </Button>
        </div>

        <RequestStepper steps={STEPS} current={step} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Etapa 1 — Enquadramento */}
            {step === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Enquadramento</CardTitle>
                  <CardDescription>
                    Identifique a compra e verifique se ela se enquadra como pequena
                    compra.
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='unit'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Selecione a unidade' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitOptions.map((u) => (
                              <SelectItem key={u} value={u}>
                                {u}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Pré-preenchida pelo seu perfil — pode ajustar.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='costCenter'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centro de custo</FormLabel>
                        <FormControl>
                          <Input placeholder='Ex.: CC-1001' {...field} />
                        </FormControl>
                        <FormDescription>
                          Pré-preenchido pelo seu perfil — pode ajustar.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='objectNature'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Natureza do objeto</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Selecione' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {objectNatureOptions.map((n) => (
                              <SelectItem key={n} value={n}>
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='desiredDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo desejado</FormLabel>
                        <FormControl>
                          <Input
                            type='date'
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Prazo curto (menos de {URGENCY_THRESHOLD_DAYS} dias) marca a
                          solicitação como urgente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='urgency'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgência</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Selecione' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {urgencyOptions.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {autoUrgent && (
                          <FormDescription className='text-amber-700 dark:text-amber-400'>
                            Marcada como urgente automaticamente —{' '}
                            {daysToDeadline === 0
                              ? 'prazo é hoje'
                              : `faltam ${daysToDeadline} dia(s)`}
                            .
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {urgency === 'alta' && (
                    <FormField
                      control={form.control}
                      name='urgencyJustification'
                      render={({ field }) => (
                        <FormItem className='sm:col-span-2'>
                          <FormLabel>Justificativa da urgência</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Obrigatória para solicitações urgentes — explique o prazo curto.'
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name='estimatedValue'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor estimado (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min={0}
                            step='0.01'
                            placeholder='0,00'
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ''
                                  ? undefined
                                  : e.target.valueAsNumber
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Limite de pequenas compras: {formatBRL(SMALL_PURCHASE_LIMIT)}.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {overLimit && (
                    <Alert className='sm:col-span-2 border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200'>
                      <ArrowUpRight className='size-4' />
                      <AlertTitle>Fora do fluxo de pequenas compras</AlertTitle>
                      <AlertDescription className='text-amber-900/90 dark:text-amber-200/90'>
                        O valor ultrapassa o limite de{' '}
                        {formatBRL(SMALL_PURCHASE_LIMIT)} e deve seguir pelo fluxo
                        normal de compras. Seus dados foram preservados.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Etapa 2 — Necessidade */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Necessidade</CardTitle>
                  <CardDescription>
                    Descreva a compra, justifique e liste os itens.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição da necessidade</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Ex.: Coffee break para treinamento (30 pessoas).'
                            {...field}
                          />
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
                          <Textarea
                            placeholder='Por que esta compra é necessária?'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-2'>
                    <FormLabel>Itens</FormLabel>
                    <div className='space-y-2'>
                      {itemsFA.fields.map((f, idx) => (
                        <div key={f.id} className='grid grid-cols-12 gap-2'>
                          <FormField
                            control={form.control}
                            name={`items.${idx}.description`}
                            render={({ field }) => (
                              <FormItem className='col-span-12 sm:col-span-6'>
                                <FormControl>
                                  <Input placeholder='Descrição do item' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`items.${idx}.quantity`}
                            render={({ field }) => (
                              <FormItem className='col-span-4 sm:col-span-2'>
                                <FormControl>
                                  <Input
                                    type='number'
                                    min={1}
                                    placeholder='Qtd.'
                                    aria-label='Quantidade'
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    value={field.value ?? ''}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ''
                                          ? undefined
                                          : e.target.valueAsNumber
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`items.${idx}.unitValue`}
                            render={({ field }) => (
                              <FormItem className='col-span-6 sm:col-span-3'>
                                <FormControl>
                                  <Input
                                    type='number'
                                    min={0}
                                    step='0.01'
                                    placeholder='Valor unit.'
                                    aria-label='Valor unitário'
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    value={field.value ?? ''}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ''
                                          ? undefined
                                          : e.target.valueAsNumber
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className='col-span-2 flex items-start sm:col-span-1'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              disabled={itemsFA.fields.length === 1}
                              onClick={() => itemsFA.remove(idx)}
                              aria-label='Remover item'
                            >
                              <Trash2 className='size-4' />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        itemsFA.append({
                          description: '',
                          quantity: 1,
                          unitValue: undefined as unknown as number,
                        })
                      }
                    >
                      <Plus className='size-4' />
                      Adicionar item
                    </Button>
                  </div>

                  <Separator />
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>Valor total</span>
                    <span className='text-lg font-semibold tabular-nums'>
                      {formatBRL(total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Etapa 3 — Fornecedor e preços */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Fornecedor e preços</CardTitle>
                  <CardDescription>
                    Selecione um fornecedor homologado ou registre a exceção.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <SupplierCombobox
                      value={supplierName}
                      onSelect={(sel) => {
                        form.setValue('supplierName', sel.name, { shouldDirty: true })
                        form.setValue('supplierStatus', sel.status, {
                          shouldDirty: true,
                        })
                      }}
                    />
                  </FormItem>

                  {supplierStatus === 'homologado' && (
                    <div className='space-y-3'>
                      <Alert className='border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'>
                        <Check className='size-4' />
                        <AlertTitle>Fornecedor homologado</AlertTitle>
                        <AlertDescription className='text-emerald-900/90 dark:text-emerald-200/90'>
                          Segue pela cotação automática. As demais validações continuam
                          valendo.
                        </AlertDescription>
                      </Alert>

                      <div className='rounded-md border p-3'>
                        <div className='mb-1 flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            Cotação automática (modelo Direct Buy)
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            auto-preenchida
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-muted-foreground'>{supplierName}</span>
                          <span className='font-semibold tabular-nums'>
                            {formatBRL(total)}
                          </span>
                        </div>
                        <p className='mt-2 text-xs text-muted-foreground'>
                          Preço de tabela vigente do fornecedor homologado, preenchido
                          automaticamente. Hipótese — a confirmar com o SESI: fonte e
                          atualização da tabela de preços.
                        </p>
                      </div>
                    </div>
                  )}

                  {supplierStatus === 'bloqueado' && (
                    <Alert
                      variant='destructive'
                      className='border-red-300 dark:border-red-900'
                    >
                      <Ban className='size-4' />
                      <AlertTitle>Fornecedor bloqueado</AlertTitle>
                      <AlertDescription>
                        Este fornecedor está bloqueado para compras. Selecione outro
                        fornecedor ou contate Suprimentos. A solicitação não poderá
                        ser enviada para aprovação.
                      </AlertDescription>
                    </Alert>
                  )}

                  {supplierStatus === 'inexistente' && (
                    <div className='space-y-4'>
                      <Alert className='border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200'>
                        <ArrowUpRight className='size-4' />
                        <AlertTitle>Fluxo de exceção — fornecedor não homologado</AlertTitle>
                        <AlertDescription className='text-amber-900/90 dark:text-amber-200/90'>
                          Registre até 3 preços com evidência e data/hora de coleta.
                          Hipótese (DEC-05/DEC-06): responsável e aprovação adicional a
                          confirmar com o SESI.
                        </AlertDescription>
                      </Alert>

                      {quotesFA.fields.map((f, idx) => (
                        <div
                          key={f.id}
                          className='grid grid-cols-12 gap-2 rounded-md border p-3'
                        >
                          <FormField
                            control={form.control}
                            name={`quotes.${idx}.supplierName`}
                            render={({ field }) => (
                              <FormItem className='col-span-12 sm:col-span-5'>
                                <FormLabel className='text-xs'>Fornecedor/fonte</FormLabel>
                                <FormControl>
                                  <Input placeholder='Nome ou origem' {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`quotes.${idx}.value`}
                            render={({ field }) => (
                              <FormItem className='col-span-5 sm:col-span-3'>
                                <FormLabel className='text-xs'>Valor (R$)</FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    min={0}
                                    step='0.01'
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    value={field.value ?? ''}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ''
                                          ? undefined
                                          : e.target.valueAsNumber
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`quotes.${idx}.collectedAt`}
                            render={({ field }) => (
                              <FormItem className='col-span-6 sm:col-span-3'>
                                <FormLabel className='text-xs'>Coleta</FormLabel>
                                <FormControl>
                                  <Input
                                    type='datetime-local'
                                    {...field}
                                    value={field.value ?? ''}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className='col-span-1 flex items-end'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              onClick={() => quotesFA.remove(idx)}
                              aria-label='Remover cotação'
                            >
                              <Trash2 className='size-4' />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {quotesFA.fields.length < 3 && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            quotesFA.append({
                              supplierName: '',
                              value: undefined as unknown as number,
                              collectedAt: '',
                            })
                          }
                        >
                          <Plus className='size-4' />
                          Adicionar preço
                        </Button>
                      )}

                      <FormField
                        control={form.control}
                        name='lowestPriceJustification'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Justificativa (se não escolher o menor preço)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Obrigatória quando o fornecedor escolhido não for o de menor preço.'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Etapa 4 — Evidências */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Evidências e conformidade</CardTitle>
                  <CardDescription>
                    Anexe as evidências exigidas. Cada evidência deve corresponder à
                    cotação informada.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='evidenceCount'
                    render={({ field }) => (
                      <FormItem>
                        <EvidenceUploader
                          onCountChange={(n) => field.onChange(n)}
                        />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Etapa 5 — Revisão */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Revisão e envio</CardTitle>
                  <CardDescription>
                    Confira os dados antes de enviar para aprovação.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {errorKeys.length > 0 && (
                    <Alert variant='destructive'>
                      <Ban className='size-4' />
                      <AlertTitle>Há pendências</AlertTitle>
                      <AlertDescription>
                        Revise as etapas anteriores — alguns campos obrigatórios estão
                        incompletos.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className='grid gap-3 sm:grid-cols-2'>
                    <ReviewFact label='Unidade' value={form.getValues('unit')} />
                    <ReviewFact
                      label='Centro de custo'
                      value={form.getValues('costCenter')}
                    />
                    <ReviewFact
                      label='Natureza'
                      value={form.getValues('objectNature')}
                    />
                    <ReviewFact
                      label='Urgência'
                      value={
                        urgencyOptions.find((o) => o.value === urgency)?.label ?? '—'
                      }
                    />
                    <ReviewFact
                      label='Fornecedor'
                      value={supplierName ?? 'Não informado'}
                    />
                  </div>
                  <Separator />
                  <div>
                    <p className='text-xs text-muted-foreground'>Necessidade</p>
                    <p className='text-sm'>{form.getValues('description') || '—'}</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      {(items ?? []).length} item(ns) · Evidências:{' '}
                      {form.getValues('evidenceCount')}
                    </span>
                    <span className='text-lg font-semibold tabular-nums'>
                      {formatBRL(total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navegação */}
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={back}
                disabled={step === 0}
              >
                Voltar
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  type='button'
                  onClick={next}
                  disabled={step === 0 && overLimit}
                >
                  Continuar
                </Button>
              ) : (
                <Button type='submit' disabled={supplierStatus === 'bloqueado'}>
                  Enviar para aprovação
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Main>
    </PageTransition>
  )
}

function ReviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className='space-y-0.5'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className={cn('text-sm font-medium', !value && 'text-muted-foreground')}>
        {value || '—'}
      </p>
    </div>
  )
}
