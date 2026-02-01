import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AddCustomerDialogue() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant='outline' className='ml-2'>
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
          </DialogHeader>
          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='name-1'>Customer Name</Label>
              <Input id='name-1' name='name' defaultValue='Pedro Duarte' />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='username-1'>Email Address</Label>
              <Input
                id='email-1'
                name='email'
                defaultValue='@peduarte'
                type='email'
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='phone-1'>Phone</Label>
              <Input
                id='phone-1'
                name='phone'
                defaultValue='@peduarte'
                type='tel'
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='address-1'>Address</Label>
              <Input
                id='address-1'
                name='address'
                defaultValue='123 Main St'
                type='text'
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
