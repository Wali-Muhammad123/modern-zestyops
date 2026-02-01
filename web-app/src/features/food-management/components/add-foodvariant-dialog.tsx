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
import { foodVariantSchema } from '@/schemas/foodManagementSchemas'
import {
  addVariant,
  setEditVariant,
  updateVariant,
} from '@/store/slices/food/variant/variantSlice'

export function AddFoodVariantDialog() {
  const dispatch = useDispatch()
  const editData = useSelector((state: any) => state.variant.editVariant)
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(foodVariantSchema),
    defaultValues: {
      food_id: '',
      variant_name: '',
      price: 0,
      status: 'active',
    },
  })

  useEffect(() => {
    if (editData) {
      form.reset({
        food_id: editData.food_id,
        variant_name: editData.variant_name,
        price: editData.price,
        status: editData.status,
      })
      setOpen(true)
    }
  }, [editData, form])

  const onSubmit = (values: any) => {
    const submissionData = {
      ...values,
      // In a real app we'd look up the food name or handle it in the backend
      food_name: 'Food ' + values.food_id,
    }

    if (editData) {
      dispatch(updateVariant({ ...editData, ...submissionData }))
    } else {
      dispatch(
        addVariant({
          id: crypto.randomUUID(),
          ...submissionData,
        })
      )
    }
    dispatch(setEditVariant(null))
    form.reset()
    setOpen(false)
  }

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (!o) {
      dispatch(setEditVariant(null))
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusCircleIcon />
          Add Food Variant
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Food Variant' : 'Add Food Variant'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='food-id'>Food Name</Label>
            {/* 
                 TODO: FoodNameComboBox needs to be compatible with react-hook-form or controlled manually.
                 For now, replacing with a simple input for ID or simple Select if ComboBox is complex.
                 Assuming ComboBox is just visual for now or we use a basic Input to simulate ID selection.
               */}
            <Input
              placeholder="Enter Food ID"
              {...form.register('food_id')}
            />
            {form.formState.errors.food_id && (
              <span className="text-red-500 text-sm">{form.formState.errors.food_id.message as string}</span>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='variant-1'>Variant Name</Label>
            <Input
              id='variant-1'
              {...form.register('variant_name')}
              placeholder='Chicken Fajita XL Pizza'
            />
            {form.formState.errors.variant_name && (
              <span className="text-red-500 text-sm">{form.formState.errors.variant_name.message as string}</span>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='variant-price-1'>Price</Label>
            <Input
              id='variant-price-1'
              placeholder='12.99'
              type='number'
              {...form.register('price')}
            />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='status-1'> Status</Label>
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
