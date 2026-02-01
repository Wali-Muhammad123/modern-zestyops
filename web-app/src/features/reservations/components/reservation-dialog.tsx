import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reservationSchema } from '@/schemas/reservation'
import {
  addReservation,
  setEditReservation,
  updateReservation,
} from '@/store/slices/reservation/reservationSlice'
import { useDispatch, useSelector } from 'react-redux'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ReservationDialog() {
  const dispatch = useDispatch()
  const editData = useSelector(
    (state: any) => state.reservation.editReservation
  )

  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      customer_name: '',
      number_of_people: 1,
      start_time: '',
      end_time: '',
      table: '',
      date: '',
    },
  })

  // -----------------------------------------
  // FIX: Update form when editing
  // -----------------------------------------
  useEffect(() => {
    if (editData) {
      form.reset({
        customer_name: editData.customer_name ?? '',
        number_of_people: Number(editData.number_of_people ?? 1),
        start_time: editData.start_time ?? '',
        end_time: editData.end_time ?? '',
        table: editData.table ?? '',
        date: editData.date ?? '',
      })
      setOpen(true)
    }
  }, [editData])
  // -----------------------------------------

  const onSubmit = (values: any) => {
    if (editData) {
      dispatch(updateReservation({ ...editData, ...values }))
    } else {
      dispatch(
        addReservation({
          id: crypto.randomUUID(),
          status: 'confirmed',
          ...values,
        })
      )
    }

    dispatch(setEditReservation(null))
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          dispatch(setEditReservation(null))
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='default'>Add Reservation</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Reservation' : 'Add Reservation'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label>Customer Name</Label>
            <Input {...form.register('customer_name')} />
          </div>

          <div className='grid gap-3'>
            <Label>Number of People</Label>
            <Input type='number' {...form.register('number_of_people')} />
          </div>

          <div className='flex gap-3'>
            <div className='grid gap-3'>
              <Label>Start Time</Label>
              <Input type='time' {...form.register('start_time')} />
            </div>
            <div className='grid gap-3'>
              <Label>End Time</Label>
              <Input type='time' {...form.register('end_time')} />
            </div>
          </div>

          <div className='grid gap-3'>
            <Label>Table</Label>
            <Select
              onValueChange={(v) => form.setValue('table', v)}
              defaultValue={form.getValues('table')}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select table' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='T1'>T1</SelectItem>
                <SelectItem value='T2'>T2</SelectItem>
                <SelectItem value='T3'>T3</SelectItem>
                <SelectItem value='T4'>T4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-3'>
            <Label>Date</Label>
            <Input type='date' {...form.register('date')} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>
              {editData ? 'Save Changes' : 'Add Reservation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
