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
import { foodItemSchema } from '@/schemas/foodManagementSchemas'
import {
  addFoodItem,
  setEditFoodItem,
  updateFoodItem,
} from '@/store/slices/food/foodSlice'

export function FoodDialog() {
  const dispatch = useDispatch()
  const editData = useSelector((state: any) => state.food.editFoodItem)
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(foodItemSchema),
    defaultValues: {
      food_name: '',
      category_name: '',
      status: 'active',
      vat: 0,
      components: '',
      image_url: undefined,
    },
  })

  useEffect(() => {
    if (editData) {
      form.reset({
        food_name: editData.food_name,
        category_name: editData.category_name,
        status: editData.status,
        vat: editData.vat,
        components: editData.components,
        image_url: editData.image_url,
      })
      setOpen(true)
    }
  }, [editData, form])

  const onSubmit = (values: any) => {
    const submissionData = {
      ...values,
      image_url: 'https://placehold.co/100', // Mock
    }

    if (editData) {
      dispatch(updateFoodItem({ ...editData, ...submissionData }))
    } else {
      dispatch(
        addFoodItem({
          id: crypto.randomUUID(),
          ...submissionData,
        })
      )
    }
    dispatch(setEditFoodItem(null))
    form.reset()
    setOpen(false)
  }

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (!o) {
      dispatch(setEditFoodItem(null))
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusCircleIcon />
          Add Food
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <div className='flex items-end justify-between py-4'>
            <DialogTitle>{editData ? 'Edit Food' : 'Add Food'}</DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='food-name-1'> Food Name</Label>
              <Input
                id='food-name-1'
                {...form.register('food_name')}
                placeholder='Margherita Pizza'
              />
              {form.formState.errors.food_name && (
                <span className="text-red-500 text-sm">{form.formState.errors.food_name.message as string}</span>
              )}
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='category-name-1'> Category Name</Label>
              <Input
                id='category-name-1'
                {...form.register('category_name')}
                placeholder='Beverages'
              />
              {form.formState.errors.category_name && (
                <span className="text-red-500 text-sm">{form.formState.errors.category_name.message as string}</span>
              )}
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='components-1'> Components</Label>
              <Input
                id='components-1'
                {...form.register('components')}
                placeholder='Tomato, Mozzarella, Basil'
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='image-1'> Image</Label>
              <Input id='image-1' type='file' {...form.register('image_url')} />
            </div>

            <div className='flex gap-6'>
              <div className='grid gap-3 w-1/2'>
                <Label htmlFor='status-1'> Status</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className='grid gap-3 w-1/2'>
                <Label htmlFor='vat-1'> VAT (%)</Label>
                <Input
                  id='vat-1'
                  type='number'
                  {...form.register('vat')}
                  placeholder='Enter VAT percentage'
                />
              </div>
            </div>
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
