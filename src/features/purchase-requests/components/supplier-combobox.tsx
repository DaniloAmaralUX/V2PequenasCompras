import { useState } from 'react'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { type MockSupplier, mockSuppliers } from '../data/suppliers'

type SupplierSelection = { name: string; status: MockSupplier['status'] }

type SupplierComboboxProps = {
  value?: string
  onSelect: (selection: SupplierSelection) => void
}

export function SupplierCombobox({ value, onSelect }: SupplierComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const pick = (selection: SupplierSelection) => {
    onSelect(selection)
    setOpen(false)
    setQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between font-normal'
        >
          <span className={cn(!value && 'text-muted-foreground')}>
            {value || 'Selecione ou pesquise um fornecedor'}
          </span>
          <ChevronsUpDown className='ms-2 size-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-(--radix-popover-trigger-width) p-0' align='start'>
        <Command>
          <CommandInput
            placeholder='Pesquisar fornecedor...'
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty className='p-2'>
              <button
                type='button'
                onClick={() =>
                  pick({
                    name: query.trim() || 'Fornecedor não homologado',
                    status: 'inexistente',
                  })
                }
                className='w-full rounded-sm px-2 py-1.5 text-start text-sm hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none'
              >
                Usar “{query || '...'}” como fornecedor não homologado
              </button>
            </CommandEmpty>
            <CommandGroup>
              {mockSuppliers.map((s) => (
                <CommandItem
                  key={s.id}
                  value={s.name}
                  onSelect={() => pick({ name: s.name, status: s.status })}
                >
                  <CheckIcon
                    className={cn(
                      'me-2 size-4',
                      value === s.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className='flex-1'>{s.name}</span>
                  <span className='text-xs text-muted-foreground'>{s.status}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
