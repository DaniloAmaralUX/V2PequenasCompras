import { useRef, useState } from 'react'
import { Paperclip, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type UploadFile = { id: string; name: string; size: number; progress: number }

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type EvidenceUploaderProps = {
  onCountChange?: (count: number) => void
}

/**
 * Uploader de evidências (protótipo): simula o progresso do envio com o
 * componente Progress. Não persiste arquivos — o "upload" é apenas visual.
 */
export function EvidenceUploader({ onCountChange }: EvidenceUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const simulateProgress = (id: string) => {
    const steps = [25, 55, 80, 100]
    steps.forEach((value, i) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: value } : f))
        )
      }, (i + 1) * 180)
    })
  }

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const added: UploadFile[] = Array.from(list).map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      progress: 0,
    }))
    setFiles((prev) => {
      const next = [...prev, ...added]
      onCountChange?.(next.length)
      return next
    })
    added.forEach((f) => simulateProgress(f.id))
  }

  const remove = (id: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id)
      onCountChange?.(next.length)
      return next
    })
  }

  return (
    <div className='space-y-3'>
      <button
        type='button'
        onClick={() => inputRef.current?.click()}
        className='flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-accent/40'
      >
        <Paperclip className='size-5 text-muted-foreground' />
        <span className='text-sm font-medium'>Selecionar arquivos</span>
        <span className='text-xs text-muted-foreground'>
          PDF, imagem ou planilha — até 10 MB por arquivo
        </span>
      </button>
      <input
        ref={inputRef}
        type='file'
        multiple
        className='hidden'
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {files.length > 0 && (
        <ul className='flex flex-col gap-2'>
          {files.map((f) => (
            <li key={f.id} className='rounded-md border p-3'>
              <div className='flex items-center justify-between gap-2'>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>{f.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {formatSize(f.size)} ·{' '}
                    {f.progress < 100 ? 'enviando...' : 'concluído'}
                  </p>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-7 shrink-0'
                  onClick={() => remove(f.id)}
                  aria-label={`Remover ${f.name}`}
                >
                  <X className='size-4' />
                </Button>
              </div>
              {f.progress < 100 && <Progress value={f.progress} className='mt-2 h-1.5' />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
