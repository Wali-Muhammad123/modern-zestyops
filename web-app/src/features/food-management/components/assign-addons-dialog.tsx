import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircleIcon, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Label } from '@/components/ui/label'
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from 'react-redux'
import { assignAddonSchema } from '@/schemas/foodManagementSchemas'
import {
  addAssignedAddon,
  setEditAssignedAddon,
  updateAssignedAddon,
} from '@/store/slices/food/addon/addonSlice'

export function AssignAddonsDialog() {
  const dispatch = useDispatch()
  const editData = useSelector((state: any) => state.addon.editAssignedAddon)
  const addons = useSelector((state: any) => state.addon.addons)
  const foodItems = useSelector((state: any) => state.food.foodItems)

  const [open, setOpen] = useState(false)
  const [addonOpen, setAddonOpen] = useState(false)
  const [foodOpen, setFoodOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(assignAddonSchema),
    defaultValues: {
      addon_id: '',
      food_id: '',
    },
  })

  // Sync form with editData
  useEffect(() => {
    if (editData) {
      form.reset({
        addon_id: editData.addon_id,
        food_id: editData.food_id,
      })
      setOpen(true)
    }
  }, [editData, form])

  const onSubmit = (values: any) => {
    const selectedAddon = addons.find((a: any) => a.id === values.addon_id)
    const selectedFood = foodItems.find((f: any) => f.id === values.food_id)

    const submissionData = {
      ...values,
      addon_name: selectedAddon?.name || 'Unknown Addon',
      food_name: selectedFood?.food_name || 'Unknown Food',
    }

    if (editData) {
      dispatch(updateAssignedAddon({ ...editData, ...submissionData }))
    } else {
      dispatch(
        addAssignedAddon({
          id: crypto.randomUUID(),
          ...submissionData,
        })
      )
    }
    dispatch(setEditAssignedAddon(null))
    form.reset()
    setOpen(false)
  }

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (!o) {
      dispatch(setEditAssignedAddon(null))
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusCircleIcon className='mr-2 h-4 w-4' />
          Assign Add-ons
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] overflow-visible'>
        <DialogHeader>
          <DialogTitle>Assign Add-ons</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>

          {/* Addon Selection */}
          <div className='grid gap-3'>
            <Label>Add-ons Name</Label>
            <Popover open={addonOpen} onOpenChange={setAddonOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={addonOpen}
                  className="w-full justify-between"
                >
                  {form.watch('addon_id')
                    ? addons.find((addon: any) => addon.id === form.watch('addon_id'))?.name
                    : "Select Add-on..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search add-on..." />
                  <CommandList>
                    <CommandEmpty>No add-on found.</CommandEmpty>
                    <CommandGroup>
                      {addons.map((addon: any) => (
                        <CommandItem
                          key={addon.id}
                          value={addon.name} // Search by name
                          onSelect={() => {
                            form.setValue('addon_id', addon.id)
                            setAddonOpen(false)
                          }}
                        >
                          {addon.name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              form.watch('addon_id') === addon.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {form.formState.errors.addon_id && <span className="text-red-500 text-xs">{form.formState.errors.addon_id.message as string}</span>}
          </div>

          {/* Food Selection */}
          <div className='grid gap-3'>
            <Label>Food Name</Label>
            <Popover open={foodOpen} onOpenChange={setFoodOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={foodOpen}
                  className="w-full justify-between"
                >
                  {form.watch('food_id')
                    ? foodItems.find((food: any) => food.id === form.watch('food_id'))?.food_name
                    : "Select Food..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search food..." />
                  <CommandList>
                    <CommandEmpty>No food found.</CommandEmpty>
                    <CommandGroup>
                      {foodItems.map((food: any) => (
                        <CommandItem
                          key={food.id}
                          value={food.food_name} // Search by name
                          onSelect={() => {
                            form.setValue('food_id', food.id)
                            setFoodOpen(false)
                          }}
                        >
                          {food.food_name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              form.watch('food_id') === food.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {form.formState.errors.food_id && <span className="text-red-500 text-xs">{form.formState.errors.food_id.message as string}</span>}
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
