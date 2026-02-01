import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    addKitchen,
    setEditKitchen,
    updateKitchen,
} from '@/store/slices/kitchen/kitchenSlice'
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

const kitchenFormSchema = z.object({
    name: z.string().min(1, 'Kitchen name is required'),
})

export function KitchenDialog() {
    const dispatch = useDispatch()
    const editData = useSelector((state: any) => state.kitchen.editKitchen)

    const [open, setOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(kitchenFormSchema),
        defaultValues: {
            name: '',
        },
    })

    useEffect(() => {
        if (editData) {
            form.reset({
                name: editData.name ?? '',
            })
            setOpen(true)
        }
    }, [editData])

    const onSubmit = (values: any) => {
        if (editData) {
            dispatch(updateKitchen({ ...editData, ...values }))
        } else {
            dispatch(
                addKitchen({
                    id: crypto.randomUUID(),
                    ...values,
                })
            )
        }

        dispatch(setEditKitchen(null))
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o)
                if (!o) {
                    dispatch(setEditKitchen(null))
                    form.reset()
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant='default'>Add Kitchen</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editData ? 'Edit Kitchen' : 'Add Kitchen'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
                    <div className='grid gap-3'>
                        <Label>Kitchen Name</Label>
                        <Input {...form.register('name')} placeholder='Enter kitchen name' />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </DialogClose>
                        <Button type='submit'>
                            {editData ? 'Save Changes' : 'Add Kitchen'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
