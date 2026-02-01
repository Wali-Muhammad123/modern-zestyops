import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unavailableDaySchema } from '@/schemas/unavailableDay'
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
import { useDispatch, useSelector } from 'react-redux'
import {
  addUnavailableDay,
  setEditUnavailableDay,
  updateUnavailableDay,
} from '@/store/slices/reservation/reservationSlice'

export function AddUnavailableDayDialog() {
  const dispatch = useDispatch()
  const editData = useSelector(
    (state: any) => state.reservation.editUnavailableDay
  )

  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(unavailableDaySchema),
    defaultValues: {
      start_time: '',
      end_time: '',
      date: '',
    },
  })

  useEffect(() => {
    if (editData) {
      form.reset({
        start_time: editData.start_time ?? '',
        end_time: editData.end_time ?? '',
        date: editData.date ?? '',
      })
      setOpen(true)
    }
  }, [editData])

  const onSubmit = (values: any) => {
    if (editData) {
      dispatch(updateUnavailableDay({ ...editData, ...values }))
    } else {
      dispatch(
        addUnavailableDay({
          id: crypto.randomUUID(),
          ...values,
        })
      )
    }

    dispatch(setEditUnavailableDay(null))
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          dispatch(setEditUnavailableDay(null))
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='default'>Add Unavailable Day</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Unavailable Day' : 'Add Unavailable Day'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='start-time'>Start Time</Label>
            <Input
              id='start-time'
              type='time'
              {...form.register('start_time')}
            />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='end-time'>End Time</Label>
            <Input id='end-time' type='time' {...form.register('end_time')} />
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='date'>Date</Label>
            <Input id='date' type='date' {...form.register('date')} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>
              {editData ? 'Save changes' : 'Add Unavailable Day'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
