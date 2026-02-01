import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { foodAvailabilitySchema } from '@/schemas/foodManagementSchemas'
import {
  addAvailability,
  setEditAvailability,
  updateAvailability,
} from '@/store/slices/food/availability/availabilitySlice'

export function AddFoodAvailabilityDialog() {
  const dispatch = useDispatch()
  const editData = useSelector((state: any) => state.availability.editAvailability)
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(foodAvailabilitySchema),
    defaultValues: {
      food_id: '',
      available_day: '', // Checkbox group in real implementation, text for now
      available_time_start: '',
      available_time_end: '',
      status: 'active' as 'active' | 'inactive',
    },
  })

  useEffect(() => {
    if (editData) {
      form.reset({
        food_id: editData.food_id,
        available_day: Array.isArray(editData.available_day) ? editData.available_day.join(', ') : editData.available_day,
        available_time_start: editData.available_time_start,
        available_time_end: editData.available_time_end,
        status: editData.status,
      })
      setOpen(true)
    }
  }, [editData, form])

  const onSubmit = (values: any) => {
    const submissionData = {
      ...values,
      food_name: 'Food ' + values.food_id,
      // Convert string days to array if needed as per interface, 
      // schema validation might fail if I pass string to array, forcing array here.
      // Actually interface says string[], schema says string (for simpler input now).
      // Let's split string to array for slice.
      available_day: values.available_day.split(',').map((d: string) => d.trim()),
    }

    if (editData) {
      dispatch(updateAvailability({ ...editData, ...submissionData }))
    } else {
      dispatch(
        addAvailability({
          id: crypto.randomUUID(),
          ...submissionData,
        })
      )
    }
    dispatch(setEditAvailability(null))
    form.reset()
    setOpen(false)
  }

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (!o) {
      dispatch(setEditAvailability(null))
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusCircle />
          Add Food Availability
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add/Edit Food Availability</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='food-name-1'>Food Name</Label>
            {/* Replaced ComboBox with Input for simplicity as per previous pattern */}
            <Input
              placeholder="Enter Food ID"
              {...form.register('food_id')}
            />
            {form.formState.errors.food_id && (
              <span className="text-red-500 text-sm">{form.formState.errors.food_id.message as string}</span>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='available-days-1'>Available Days</Label>
            <Input
              id='available-days-1'
              {...form.register('available_day')}
              placeholder='Monday, Tuesday'
            />
            {form.formState.errors.available_day && (
              <span className="text-red-500 text-sm">{form.formState.errors.available_day.message as string}</span>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='start-time-1'>Start Time</Label>
            <Input
              id='start-time-1'
              type='time'
              {...form.register('available_time_start')}
            />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='end-time-1'>End Time</Label>
            <Input
              id='end-time-1'
              type='time'
              {...form.register('available_time_end')}
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
