import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { rejectionReasons } from '../data/rejection-reasons'

type RejectionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reasonCode: string, reasonText?: string) => void
}

export function RejectionDialog({
  open,
  onOpenChange,
  onConfirm,
}: RejectionDialogProps) {
  const [reason, setReason] = useState<string>(rejectionReasons[0].value)
  const [comment, setComment] = useState('')
  const needsComment = reason === 'outro'
  const canConfirm = !needsComment || comment.trim() !== ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeitar solicitação</DialogTitle>
          <DialogDescription>
            A rejeição encerra o fluxo atual. Informe o motivo da decisão.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <RadioGroup value={reason} onValueChange={setReason}>
            {rejectionReasons.map((r) => (
              <div key={r.value} className='flex items-center gap-2'>
                <RadioGroupItem value={r.value} id={`reject-${r.value}`} />
                <Label htmlFor={`reject-${r.value}`} className='font-normal'>
                  {r.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className='space-y-1.5'>
            <Label htmlFor='reject-comment'>
              Comentário {needsComment ? '(obrigatório)' : '(opcional)'}
            </Label>
            <Textarea
              id='reject-comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Detalhe o motivo para o requisitante e a auditoria.'
            />
          </div>

          <p className='text-xs text-muted-foreground'>
            Hipótese (DEC-07): obrigatoriedade e formato do motivo a confirmar com
            o SESI.
          </p>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant='destructive'
            disabled={!canConfirm}
            onClick={() => {
              onConfirm(reason, comment.trim() || undefined)
              onOpenChange(false)
            }}
          >
            Rejeitar solicitação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
