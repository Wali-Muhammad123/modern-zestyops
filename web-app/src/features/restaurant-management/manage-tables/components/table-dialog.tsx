import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    addTable,
    setEditTable,
    updateTable,
} from '@/store/slices/table/tableSlice'
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

const tableFormSchema = z.object({
    table: z.string().min(1, 'Table name is required'),
    number_of_seats: z.number().min(1, 'Number of seats must be at least 1'),
    floor: z.string().nullable(),
})

export function TableDialog() {
    const dispatch = useDispatch()
    const editData = useSelector((state: any) => state.table.editTable)

    const [open, setOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(tableFormSchema),
        defaultValues: {
            table: '',
            number_of_seats: 1,
            floor: null,
        },
    })

    useEffect(() => {
        if (editData) {
            form.reset({
                table: editData.table ?? '',
                number_of_seats: editData.number_of_seats ?? 1,
                floor: editData.floor ?? null,
            })
            setOpen(true)
        }
    }, [editData])

    const onSubmit = (values: any) => {
        if (editData) {
            dispatch(updateTable({ ...editData, ...values }))
        } else {
            dispatch(
                addTable({
                    id: crypto.randomUUID(),
                    ...values,
                })
            )
        }

        dispatch(setEditTable(null))
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o)
                if (!o) {
                    dispatch(setEditTable(null))
                    form.reset()
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant='default'>Add Table</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editData ? 'Edit Table' : 'Add Table'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
                    <div className='grid gap-3'>
                        <Label>Table Name</Label>
                        <Input {...form.register('table')} placeholder='e.g., T1' />
                    </div>

                    <div className='grid gap-3'>
                        <Label>Number of Seats</Label>
                        <Input
                            type='number'
                            {...form.register('number_of_seats', { valueAsNumber: true })}
                            placeholder='Enter number of seats'
                        />
                    </div>

                    <div className='grid gap-3'>
                        <Label>Floor (Optional)</Label>
                        <Input {...form.register('floor')} placeholder='e.g., Ground Floor, 1st Floor' />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </DialogClose>
                        <Button type='submit'>
                            {editData ? 'Save Changes' : 'Add Table'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
