import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { addonSchema } from '@/schemas/foodManagementSchemas'
import {
  addAddon,
  setEditAddon,
  updateAddon,
} from '@/store/slices/food/addon/addonSlice'

export function AddAddonsDialog() {
  const dispatch = useDispatch()
  const editData = useSelector((state: any) => state.addon.editAddon)
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(addonSchema),
    defaultValues: {
      name: '',
      price: 0,
      status: 'active',
    },
  })

  // Sync form with editData
  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name,
        price: editData.price,
        status: editData.status,
      })
      setOpen(true)
    }
  }, [editData, form])

  const onSubmit = (values: any) => {
    const submissionData = { ...values }

    if (editData) {
      dispatch(updateAddon({ ...editData, ...submissionData }))
    } else {
      dispatch(
        addAddon({
          id: crypto.randomUUID(),
          ...submissionData,
        })
      )
    }
    dispatch(setEditAddon(null))
    form.reset()
    setOpen(false)
  }

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (!o) {
      dispatch(setEditAddon(null))
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusCircleIcon className='mr-2 h-4 w-4' />
          Add Add-ons
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Add-on' : 'Add Add-ons'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='add-ons-1'>Add-ons Name</Label>
            <Input
              id='add-ons-1'
              {...form.register('name')}
              placeholder='Type add-ons name'
            />
            {form.formState.errors.name && <span className="text-red-500 text-xs">{form.formState.errors.name.message as string}</span>}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='add-ons-price-1'>Price</Label>
            <Input
              id='add-ons-price-1'
              {...form.register('price')}
              placeholder='Type add-ons price'
              type='number'
            />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='status-1'>Status</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register('status')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
