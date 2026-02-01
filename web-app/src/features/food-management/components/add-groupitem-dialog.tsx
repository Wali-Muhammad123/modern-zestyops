import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircleIcon, PlusIcon, Trash2Icon, Search } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDispatch, useSelector } from 'react-redux'
import { foodItemSchema } from '@/schemas/foodManagementSchemas'
import { addFoodItem } from '@/store/slices/food/foodSlice'
import { ScrollArea } from '@/components/ui/scroll-area'

// Temporary type for items being added to the group
type GroupSubItem = {
  id: string
  name: string
  price: number
  quantity: number
  type: 'food' | 'variant'
}

export const AddGroupItemDialog = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<GroupSubItem[]>([])

  // Selectors to search from existing items
  const foodItems = useSelector((state: any) => state.food.foodItems)
  const variants = useSelector((state: any) => state.variant.variants)

  const form = useForm({
    resolver: zodResolver(foodItemSchema),
    defaultValues: {
      food_name: '',
      category_name: '',
      status: 'active',
      vat: 0,
      components: '', // Will store JSON string of selectedItems or summary
      image_url: undefined,
    },
  })

  // Filter items based on search
  const filteredFood = foodItems.filter((f: any) =>
    f.food_name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredVariants = variants.filter((v: any) =>
    v.variant_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddItem = (item: any, type: 'food' | 'variant') => {
    const newItem: GroupSubItem = {
      id: item.id,
      name: type === 'food' ? item.food_name : item.variant_name,
      price: item.price || 0, // Food items might not have price in current schema, variants do
      quantity: 1,
      type
    }
    // Check if already exists
    if (!selectedItems.find(i => i.id === newItem.id)) {
      setSelectedItems([...selectedItems, newItem])
    }
  }

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id))
  }

  const handleQuantityChange = (id: string, qty: number) => {
    setSelectedItems(selectedItems.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const onSubmit = (values: any) => {
    const submissionData = {
      ...values,
      id: crypto.randomUUID(),
      // Storing selected items structure in components field or we might need a new field
      // For now, let's append them to components string for visibility
      components: values.components + ' | Group Items: ' + selectedItems.map(i => `${i.name} x${i.quantity}`).join(', '),
      image_url: 'https://placehold.co/100',
    }

    dispatch(addFoodItem(submissionData))
    setOpen(false)
    form.reset()
    setSelectedItems([])
    setSearchQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Group Item
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[1200px] h-[80vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Add Group Item</DialogTitle>
        </DialogHeader>

        <div className='flex-1 grid grid-cols-5 gap-6 min-h-0'>
          {/* Left Form */}
          <div className='col-span-2 rounded-lg border p-4 overflow-y-auto'>
            <form id="group-form" onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
              <div className='grid gap-3'>
                <Label htmlFor='food-name'>Group Name</Label>
                <Input id='food-name' {...form.register('food_name')} placeholder='e.g. Family Feast' />
                {form.formState.errors.food_name && <span className="text-red-500 text-xs">{form.formState.errors.food_name.message as string}</span>}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='category'>Category</Label>
                <Input id='category' {...form.register('category_name')} placeholder='e.g. Combos' />
                {form.formState.errors.category_name && <span className="text-red-500 text-xs">{form.formState.errors.category_name.message as string}</span>}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='vat'>VAT (%)</Label>
                <Input id='vat' type="number" {...form.register('vat')} />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='status'>Status</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {/* Hidden components field, managed manually or just for notes */}
              <div className='grid gap-3'>
                <Label htmlFor='components'>Notes / Description</Label>
                <Input id='components' {...form.register('components')} />
              </div>
            </form>
          </div>

          {/* Right Search & Table */}
          <div className='col-span-3 rounded-lg border p-4 flex flex-col min-h-0'>
            <div className="mb-4">
              <Label htmlFor='search-items'>Search Items to Add</Label>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id='search-items'
                  placeholder='Search food or variants...'
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown/Area */}
              {searchQuery && (
                <ScrollArea className="h-32 border rounded-md mt-2 bg-slate-50 p-2">
                  {filteredFood.length === 0 && filteredVariants.length === 0 && <p className="text-sm text-muted-foreground text-center py-2">No results found</p>}
                  {filteredFood.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-2 hover:bg-slate-200 rounded cursor-pointer" onClick={() => handleAddItem(item, 'food')}>
                      <span className="text-sm font-medium">{item.food_name} (Food)</span>
                      <PlusIcon className="h-4 w-4" />
                    </div>
                  ))}
                  {filteredVariants.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-2 hover:bg-slate-200 rounded cursor-pointer" onClick={() => handleAddItem(item, 'variant')}>
                      <span className="text-sm font-medium">{item.variant_name} (Variant)</span>
                      <PlusIcon className="h-4 w-4" />
                    </div>
                  ))}
                </ScrollArea>
              )}
            </div>

            {/* Selected Items Table */}
            <div className='flex-1 overflow-auto rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-20">Qty</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No items added to group</TableCell>
                    </TableRow>
                  ) : (
                    selectedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="capitalize">{item.type}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2Icon className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
          <Button type='submit' form="group-form">Save Group Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
