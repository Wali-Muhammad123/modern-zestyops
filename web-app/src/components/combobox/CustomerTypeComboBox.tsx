import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
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

const customerType = [
  {
    value: 'Walk-In',
    label: 'walk-in',
  },
  {
    value: 'VIP',
    label: 'vip',
  },
  {
    value: 'Online',
    label: 'online',
  },
  {
    value: 'Take Away',
    label: 'take_away',
  },
]

export function CustomerTypeComboBox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {value
            ? customerType.find((type) => type.value === value)?.label
            : 'Select Customer Type...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search Customer Type...' className='h-9' />
          <CommandList>
            <CommandEmpty>No Customer Type found.</CommandEmpty>
            <CommandGroup>
              {customerType.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {type.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === type.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
