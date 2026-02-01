import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AddonItem } from '@/store/slices/food/addon/addonSlice'
import { AddonSelection } from '@/schemas/orderSchemas'
import { Input } from '@/components/ui/input'

interface AddItemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemName: string
    itemPrice: number
    availableAddons: AddonItem[]
    onConfirm: (quantity: number, addons: AddonSelection[], notes: string) => void
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
    open,
    onOpenChange,
    itemName,
    itemPrice,
    availableAddons,
    onConfirm,
}) => {
    const [quantity, setQuantity] = useState(1)
    const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
    const [notes, setNotes] = useState('')

    const handleAddonToggle = (addonId: string) => {
        const newSelected = new Set(selectedAddons)
        if (newSelected.has(addonId)) {
            newSelected.delete(addonId)
        } else {
            newSelected.add(addonId)
        }
        setSelectedAddons(newSelected)
    }

    const handleConfirm = () => {
        const addons: AddonSelection[] = availableAddons
            .filter(addon => selectedAddons.has(addon.id))
            .map(addon => ({
                id: addon.id,
                name: addon.name,
                price: addon.price,
            }))

        onConfirm(quantity, addons, notes)

        // Reset state
        setQuantity(1)
        setSelectedAddons(new Set())
        setNotes('')
        onOpenChange(false)
    }

    const itemTotal = (itemPrice + availableAddons
        .filter(addon => selectedAddons.has(addon.id))
        .reduce((sum, addon) => sum + addon.price, 0)) * quantity

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Add {itemName}</DialogTitle>
                </DialogHeader>

                <div className='space-y-4'>
                    {/* Quantity */}
                    <div className='space-y-2'>
                        <Label>Quantity</Label>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </Button>
                            <Input
                                type='number'
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className='w-20 text-center'
                            />
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    {/* Add-ons */}
                    {availableAddons.length > 0 && (
                        <div className='space-y-2'>
                            <Label>Add-ons (Optional)</Label>
                            <div className='space-y-2 rounded-md border p-3'>
                                {availableAddons.map((addon) => (
                                    <div key={addon.id} className='flex items-center space-x-2'>
                                        <Checkbox
                                            id={addon.id}
                                            checked={selectedAddons.has(addon.id)}
                                            onCheckedChange={() => handleAddonToggle(addon.id)}
                                        />
                                        <label
                                            htmlFor={addon.id}
                                            className='flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                        >
                                            {addon.name}
                                        </label>
                                        <span className='text-sm text-muted-foreground'>
                                            +${addon.price.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div className='space-y-2'>
                        <Label>Special Instructions (Optional)</Label>
                        <Textarea
                            placeholder='e.g., No onions, extra spicy...'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Total */}
                    <div className='rounded-md bg-muted p-3'>
                        <div className='flex justify-between text-sm font-medium'>
                            <span>Total:</span>
                            <span className='text-lg font-bold'>${itemTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        Add to Cart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
