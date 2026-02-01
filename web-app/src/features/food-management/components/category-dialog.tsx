import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { categorySchema } from '@/schemas/foodManagementSchemas'
import {
  addCategory,
  setEditCategory,
  updateCategory,
} from '@/store/slices/food/category/categorySlice'

export function CategoryDialog() {
  const dispatch = useDispatch()
  const editData = useSelector((state: any) => state.category.editCategory)
  const categories = useSelector((state: any) => state.category.categories)
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: '',
      parent_category: '',
      status: 'active',
      offer: false,
      image_url: undefined,
    },
  })

  // Sync form with editData
  useEffect(() => {
    if (editData) {
      form.reset({
        category_name: editData.category_name,
        parent_category: editData.parent_category,
        status: editData.status,
        offer: editData.offer,
        image_url: editData.image_url,
      })
      setOpen(true)
    }
  }, [editData, form])

  const onSubmit = (values: any) => {
    const submissionData = {
      ...values,
      image_url: 'https://placehold.co/100', // Mock image
    }

    if (editData) {
      dispatch(updateCategory({ ...editData, ...submissionData }))
    } else {
      dispatch(
        addCategory({
          id: crypto.randomUUID(),
          ...submissionData,
        })
      )
    }
    dispatch(setEditCategory(null))
    form.reset()
    setOpen(false)
  }

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (!o) {
      dispatch(setEditCategory(null))
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='default'>Add Category</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='category-name-1'> Category Name</Label>
            <Input
              id='category-name-1'
              {...form.register('category_name')}
              placeholder='Soup'
            />
            {form.formState.errors.category_name && <span className="text-red-500 text-xs">{form.formState.errors.category_name.message as string}</span>}
          </div>
          <div className='flex gap-2'>
            <div className='grid gap-3 w-1/2'>
              <Label htmlFor='parent-category-1'> Parent Category</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register('parent_category')}
              >
                <option value="">None</option>
                {categories.map((cat: any) => (
                  // Prevent selecting self as parent
                  editData && cat.id === editData.id ? null : (
                    <option key={cat.id} value={cat.category_name}>{cat.category_name}</option>
                  )
                ))}
              </select>
            </div>
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
          </div>
          <div className='grid gap-3'>
            <div className='flex items-center gap-1'>
              <Checkbox
                id='offer'
                checked={form.watch('offer')}
                onCheckedChange={(c) => form.setValue('offer', c as boolean)}
              />
              <Label htmlFor='offer'>Offer</Label>
            </div>
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='image-1'>Image</Label>
            <Input
              id='image-1'
              type='file'
              {...form.register('image_url')}
            />
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
