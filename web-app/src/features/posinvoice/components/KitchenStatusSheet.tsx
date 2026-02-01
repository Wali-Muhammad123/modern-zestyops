import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search, Clock, ChefHat } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import { updateLineItemStatus } from '@/store/slices/order/orderSlice'

export function KitchenStatusSheet() {
  const dispatch = useAppDispatch()
  const orders = useAppSelector((state) => state.order.orders)
  const kitchens = useAppSelector((state) => state.kitchen.kitchens)

  const [searchQuery, setSearchQuery] = useState('')
  const [kitchenFilter, setKitchenFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all')

  // Flatten all line items from orders
  const allKitchenItems = useMemo(() => {
    const items: Array<{
      orderId: string
      invoiceNo: string
      table: string | null
      orderDate: string
      customerName: string | null
      lineItem: any
    }> = []

    orders.forEach(order => {
      // Skip cancelled and served orders
      if (order.status === 'cancelled' || order.status === 'served') return

      if (order.lineItems) {
        order.lineItems.forEach(lineItem => {
          items.push({
            orderId: order.id,
            invoiceNo: order.invoiceNo,
            table: order.table,
            orderDate: order.orderDate,
            customerName: order.customerName,
            lineItem,
          })
        })
      }
    })

    return items
  }, [orders])

  // Filter kitchen items
  const filteredItems = useMemo(() => {
    return allKitchenItems.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !item.invoiceNo.toLowerCase().includes(query) &&
          !item.lineItem.item_name.toLowerCase().includes(query) &&
          !item.table?.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Kitchen filter
      if (kitchenFilter !== 'all' && item.lineItem.kitchen_id !== kitchenFilter) {
        return false
      }

      // Status filter
      if (statusFilter !== 'all' && item.lineItem.status !== statusFilter) {
        return false
      }

      return true
    }).sort((a, b) => {
      // Sort by status priority (pending > preparing > ready)
      const statusPriority: Record<string, number> = { pending: 0, preparing: 1, ready: 2 }
      return statusPriority[a.lineItem.status] - statusPriority[b.lineItem.status]
    })
  }, [allKitchenItems, searchQuery, kitchenFilter, statusFilter])

  const handleStatusChange = (orderId: string, lineItemId: string, newStatus: 'pending' | 'preparing' | 'ready') => {
    dispatch(updateLineItemStatus({ orderId, lineItemId, status: newStatus }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200'
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getKitchenName = (kitchenId: string) => {
    const kitchen = kitchens.find(k => k.id === kitchenId)
    return kitchen?.name || kitchenId
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button showBadge={true} variant='outline'>
          Kitchen Status ({filteredItems.length})
        </Button>
      </SheetTrigger>

      <SheetContent className='flex flex-col p-0 sm:max-w-xl'>
        {/* Header Section */}
        <div className='border-b border-gray-200 p-4'>
          <SheetHeader>
            <SheetTitle>Kitchen Status</SheetTitle>
          </SheetHeader>

          <div className='mt-4 space-y-3'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search by invoice, item, table...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>

            {/* Filters */}
            <div className='grid grid-cols-2 gap-2'>
              <Select value={kitchenFilter} onValueChange={setKitchenFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Kitchen' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Kitchens</SelectItem>
                  {kitchens.map(kitchen => (
                    <SelectItem key={kitchen.id} value={kitchen.id}>
                      {kitchen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
                <SelectTrigger>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='preparing'>Preparing</SelectItem>
                  <SelectItem value='ready'>Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Scrollable Items */}
        <div className='flex-1 overflow-y-auto p-4'>
          {filteredItems.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <ChefHat className='mb-2 h-12 w-12 text-gray-300' />
              <p className='text-sm text-muted-foreground'>No kitchen items found</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {filteredItems.map((item, idx) => (
                <Card key={`${item.orderId}-${item.lineItem.id}-${idx}`} className='p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold text-sm'>{item.invoiceNo}</h3>
                        <Badge className={getStatusColor(item.lineItem.status)}>
                          {item.lineItem.status}
                        </Badge>
                      </div>
                      <div className='mt-1 space-y-1'>
                        <p className='font-medium text-sm'>
                          {item.lineItem.quantity}x {item.lineItem.item_name}
                        </p>
                        {item.lineItem.addons && item.lineItem.addons.length > 0 && (
                          <p className='text-xs text-muted-foreground'>
                            + {item.lineItem.addons.map((a: any) => a.name).join(', ')}
                          </p>
                        )}
                        {item.lineItem.notes && (
                          <p className='text-xs text-muted-foreground italic'>
                            Note: {item.lineItem.notes}
                          </p>
                        )}
                      </div>
                      <div className='mt-2 flex items-center gap-3 text-xs text-muted-foreground'>
                        <span>Kitchen: {getKitchenName(item.lineItem.kitchen_id)}</span>
                        <span>•</span>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {item.lineItem.prep_time} min
                        </span>
                        {item.table && (
                          <>
                            <span>•</span>
                            <span>Table: {item.table}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='mt-3 grid grid-cols-3 gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleStatusChange(item.orderId, item.lineItem.id, 'pending')}
                      disabled={item.lineItem.status === 'pending'}
                    >
                      Pending
                    </Button>
                    <Button
                      size='sm'
                      variant='default'
                      onClick={() => handleStatusChange(item.orderId, item.lineItem.id, 'preparing')}
                      disabled={item.lineItem.status === 'preparing'}
                    >
                      Preparing
                    </Button>
                    <Button
                      size='sm'
                      variant='default'
                      className='bg-green-600 hover:bg-green-700'
                      onClick={() => handleStatusChange(item.orderId, item.lineItem.id, 'ready')}
                      disabled={item.lineItem.status === 'ready'}
                    >
                      Ready
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className='border-t border-gray-200 p-4'>
          <div className='flex w-full items-center justify-between text-sm text-muted-foreground'>
            <span>{filteredItems.length} items</span>
            <SheetClose asChild>
              <Button variant='outline'>Close</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet >
  )
}
