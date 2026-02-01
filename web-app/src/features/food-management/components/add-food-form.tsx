import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

export const AddFoodForm = () => {
  return (
    <div className='grid gap-4'>
      <div className='grid gap-3'>
        <Label htmlFor='food-name-1'> Food Name</Label>
        <Input
          id='food-name-1'
          name='food-name'
          placeholder='Margherita Pizza'
        />
      </div>
      <div className='grid gap-3'>
        <Label htmlFor='components-1'> Components</Label>
        <Input
          id='components-1'
          name='components'
          placeholder='Tomato, Mozzarella, Basil'
        />
      </div>
      <div className='grid gap-3'>
        <Label htmlFor='notes-1'> Notes</Label>
        <Input
          id='notes-1'
          name='notes'
          placeholder='Extra cheese, No onions'
        />
      </div>
      <div className='grid gap-3'>
        <Label htmlFor='description-1'> Description</Label>
        <Input
          id='description-1'
          name='description'
          placeholder='Details for the food item...'
        />
      </div>
      <div className='grid gap-3'>
        <Label htmlFor='image-1'> Image</Label>
        <Input id='image-1' name='image' type='file' />
      </div>
      {/* <div className='flex gap-2'> */}

      <div className='flex gap-6'>
        <div className='grid gap-3'>
          <Label htmlFor='kitchen-1'>Select Kitchen</Label>
          <NativeSelect>
            <NativeSelectOption value=''>Select Kitchen</NativeSelectOption>
            <NativeSelectOption value='todo'>Todo</NativeSelectOption>
            <NativeSelectOption value='in-progress'>
              In Progress
            </NativeSelectOption>
            <NativeSelectOption value='done'>Done</NativeSelectOption>
            <NativeSelectOption value='cancelled'>Cancelled</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className='grid gap-3'>
          <Label htmlFor='status-1'> Status</Label>
          <NativeSelect>
            <NativeSelectOption value=''>Select status</NativeSelectOption>
            <NativeSelectOption value='todo'>Active</NativeSelectOption>
            <NativeSelectOption value='done'>Inactive</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className='grid gap-3'>
          <Label htmlFor='category-1'>Category</Label>
          <NativeSelect>
            <NativeSelectOption value=''>Select Category</NativeSelectOption>
            <NativeSelectOption value='todo'>Todo</NativeSelectOption>
            <NativeSelectOption value='in-progress'>
              In Progress
            </NativeSelectOption>
            <NativeSelectOption value='done'>Done</NativeSelectOption>
            <NativeSelectOption value='cancelled'>Cancelled</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
      {/* </div> */}
      <div className='grid gap-3'>
        <div className='flex items-start justify-start space-x-6 py-2'>
          <div className='flex items-center gap-1'>
            <Checkbox id='offer' />
            <Label htmlFor='offer'>Offer</Label>
          </div>
          <div className='flex items-center gap-1'>
            <Checkbox id='special' />
            <Label htmlFor='special'>Special</Label>
          </div>
          <div className='flex items-center gap-1'>
            <Checkbox id='custom-quantity' />
            <Label htmlFor='custom-quantity'>Custom Quantity</Label>
          </div>
        </div>
      </div>
      <div className='flex gap-2'>
        <div className='grid gap-3'>
          <Label htmlFor='vat-1'> VAT (%)</Label>
          <Input
            id='vat-1'
            name='vat'
            type='number'
            placeholder='Enter VAT percentage'
          />
        </div>
        <div className='grid gap-3'>
          <Label>Cooking Time</Label>
          <div className='flex gap-2'>
            <Input type='number' placeholder='HH' min='0' className='w-20' />
            <span>:</span>
            <Input
              type='number'
              placeholder='MM'
              min='0'
              max='59'
              className='w-20'
            />
            <span>:</span>
            <Input
              type='number'
              placeholder='SS'
              min='0'
              max='59'
              className='w-20'
            />
          </div>
        </div>
      </div>
      <div className='grid gap-3'>
        <Label htmlFor='menu-type-1'>Menu Type</Label>
        <NativeSelect>
          <NativeSelectOption value=''>Select Menu Type</NativeSelectOption>
          <NativeSelectOption value='todo'>Todo</NativeSelectOption>
          <NativeSelectOption value='in-progress'>
            In Progress
          </NativeSelectOption>
          <NativeSelectOption value='done'>Done</NativeSelectOption>
          <NativeSelectOption value='cancelled'>Cancelled</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  )
}
