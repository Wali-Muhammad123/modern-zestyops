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
import { Search, Eye } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import { updateOrderStatus, deleteOrder } from '@/store/slices/order/orderSlice'
import { OrderStatus } from '@/schemas/orderSchemas'

export function OngoingOrderSheet() {
  const dispatch = useAppDispatch()
  const orders = useAppSelector((state) => state.order.orders)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [tableFilter, setTableFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'dine-in' | 'takeaway' | 'delivery'>('all')

  // Get unique tables
  const uniqueTables = useMemo(() => {
    const tables = new Set(orders.filter(o => o.table).map(o => o.table!))
    return Array.from(tables).sort()
  }, [orders])

  // Filter orders - exclude completed, cancelled, and served
  const ongoingOrders = useMemo(() => {
    return orders.filter(order => {
      // Only ongoing statuses
      if (['completed', 'cancelled', 'served'].includes(order.status)) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !order.invoiceNo.toLowerCase().includes(query) &&
          !order.customerName?.toLowerCase().includes(query) &&
          !order.table?.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) return false

      // Table filter
      if (tableFilter !== 'all' && order.table !== tableFilter) return false

      // Type filter
      if (typeFilter !== 'all' && order.type !== typeFilter) return false

      return true
    }).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  }, [orders, searchQuery, statusFilter, tableFilter, typeFilter])

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }))
  }

  const handleDeleteOrder = (orderId: string, invoiceNo: string) => {
    if (confirm(`Are you sure you want to delete order ${invoiceNo}?`)) {
      dispatch(deleteOrder(orderId))
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'served': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button showBadge={true} variant='outline'>
          Ongoing Orders ({ongoingOrders.length})
        </Button>
      </SheetTrigger>

      <SheetContent className='flex flex-col p-0 sm:max-w-xl'>
        {/* Header Section */}
        <div className='border-b border-gray-200 p-4'>
          <SheetHeader>
            <SheetTitle>Ongoing Orders</SheetTitle>
          </SheetHeader>

          <div className='mt-4 space-y-3'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search by invoice, customer, table...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>

            {/* Filters */}
            <div className='grid grid-cols-3 gap-2'>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
                <SelectTrigger>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='processing'>Processing</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tableFilter} onValueChange={setTableFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Table' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Tables</SelectItem>
                  {uniqueTables.map(table => (
                    <SelectItem key={table} value={table}>{table}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val as any)}>
                <SelectTrigger>
                  <SelectValue placeholder='Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value='dine-in'>Dine-in</SelectItem>
                  <SelectItem value='takeaway'>Takeaway</SelectItem>
                  <SelectItem value='delivery'>Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Scrollable Orders */}
        <div className='flex-1 overflow-y-auto p-4'>
          {ongoingOrders.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Eye className='mb-2 h-12 w-12 text-gray-300' />
              <p className='text-sm text-muted-foreground'>No ongoing orders found</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {ongoingOrders.map((order) => (
                <Card key={order.id} className='p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold text-sm'>{order.invoiceNo}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className='mt-1 space-y-1 text-xs text-muted-foreground'>
                        <p>Customer: {order.customerName || 'Walk-in'}</p>
                        <p>Type: {order.type} {order.table && `• Table: ${order.table}`}</p>
                        {order.waiter && <p>Waiter: {order.waiter}</p>}
                        <p>Time: {new Date(order.orderDate).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-bold'>${order.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className='mt-3 grid grid-cols-3 gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleStatusChange(order.id, 'processing')}
                      disabled={order.status === 'processing'}
                    >
                      Process
                    </Button>
                    <Button
                      size='sm'
                      variant='default'
                      onClick={() => handleStatusChange(order.id, 'completed')}
                      disabled={order.status === 'completed'}
                    >
                      Complete
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDeleteOrder(order.id, order.invoiceNo)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className='border-t border-gray-200 p-4'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
