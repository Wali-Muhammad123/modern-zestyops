import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
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
import { menuTypeSchema } from '@/schemas/foodManagementSchemas'
import {
  addMenuType,
  setEditMenuType,
  updateMenuType,
} from '@/store/slices/food/menutype/menuTypeSlice'

export function AddMenuTypeDialog() {
  const dispatch = useDispatch()
  const editData = useSelector((state: any) => state.menuType.editMenuType)
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(menuTypeSchema),
    defaultValues: {
      menu_type: '',
      status: 'active',
      image_url: undefined, // File input handling needs care
    },
  })

  // Sync form with editData
  useEffect(() => {
    if (editData) {
      form.reset({
        menu_type: editData.menu_type,
        status: editData.status,
        image_url: editData.image_url,
      })
      setOpen(true)
    }
  }, [editData, form])

  const onSubmit = (values: any) => {
    // Mock image URL for now since real file upload isn't setup
    const submissionData = {
      ...values,
      image_url: 'https://placehold.co/100',
    }

    if (editData) {
      dispatch(updateMenuType({ ...editData, ...submissionData }))
    } else {
      dispatch(
        addMenuType({
          id: crypto.randomUUID(),
          ...submissionData,
        })
      )
    }
    dispatch(setEditMenuType(null))
    form.reset()
    setOpen(false)
  }

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (!o) {
      dispatch(setEditMenuType(null))
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusCircle />
          Add Menu Type
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Menu Type' : 'Add Menu Type'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='menu-type-1'>Menu Type</Label>
            <Input
              id='menu-type-1'
              {...form.register('menu_type')}
              placeholder='Soup...'
            />
            {form.formState.errors.menu_type && (
              <span className="text-red-500 text-sm">{form.formState.errors.menu_type.message as string}</span>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='image-1'>Image</Label>
            <Input id='image-1' type='file' {...form.register('image_url')} />
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
