import { useNavigate } from '@tanstack/react-router'
import { HomeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectCounterOrders, updateOrderStatus } from '@/store/slices/order/orderSlice'
import { Order, OrderStatus } from '@/schemas/orderSchemas'
import { useEffect, useState } from 'react'

export const CounterDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const allOrders = useAppSelector(selectCounterOrders)
  const [displayOrders, setDisplayOrders] = useState<Order[]>([])
  const [now, setNow] = useState(new Date())

  // Update time every second for countdown and vanish logic
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Filter logic:
    // 1. Base filter already done by selector (Dine-in/Takeaway, Not Cancelled)
    // 2. "Served" orders vanish after 1 minute (60000ms)

    const filtered = allOrders.filter(order => {
      if (order.status === 'served') {
        const updatedTime = new Date(order.updatedAt).getTime()
        // If served more than 1 minute ago, hide it
        if (now.getTime() - updatedTime > 60000) {
          return false
        }
      }
      return true
    })

    // Sort by order date? Or status priority?
    // Let's sort by order date ascending (oldest first)
    filtered.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())

    setDisplayOrders(filtered)
  }, [allOrders, now])


  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'processing': // Was 'Preparing' in dummy
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'served':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed': // Ready
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === 'pending') return 'processing'
    if (current === 'processing') return 'completed'
    if (current === 'completed') return 'served'
    return null
  }

  const handleStatusClick = (order: Order) => {
    const next = getNextStatus(order.status)
    if (next) {
      dispatch(updateOrderStatus({ id: order.id, status: next }))
    }
  }

  const calculateRemainingTime = (orderDate: string) => {
    // A dummy calculation since we don't have target time.
    // Let's show elapsed time instead? Current UI says "Remaining Time".
    // Assuming standard 30 min prep time?
    const start = new Date(orderDate).getTime()
    const target = start + 30 * 60 * 1000 // 30 mins
    const diff = target - now.getTime()

    if (diff < 0) return 'Overdue'

    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <section className='relative flex min-h-screen flex-col bg-gray-50'>
      {/* ===== Fixed Top Header ===== */}
      <div className='fixed top-0 right-0 left-0 z-10 flex items-center justify-center border-b border-gray-200 bg-white py-5 shadow-sm'>
        {/* === Left Icon Button === */}
        <div className='absolute left-6'>
          <Button
            variant='default'
            onClick={() => navigate({ to: '/dashboard' })}
          >
            <HomeIcon className='h-5 w-5 text-white' />
          </Button>
        </div>

        {/* === Centered Title === */}
        <h1 className='font-manrope text-2xl font-normal tracking-wide text-gray-800'>
          Order Time Countdown Board
        </h1>
      </div>

      {/* ===== Main Scrollable Content Area ===== */}
      <div className='flex-1 overflow-y-auto px-12 pt-24 pb-10'>
        <div className='mx-auto w-full max-w-6xl rounded-xl bg-white p-6 shadow-md'>
          <Table>
            <TableCaption className='text-lg font-medium text-gray-500'>
              Active Orders ({displayOrders.length})
            </TableCaption>
            <TableHeader>
              <TableRow className='text-lg text-gray-700'>
                <TableHead className='w-[120px] font-semibold text-gray-800'>
                  Table No
                </TableHead>
                <TableHead className='font-semibold text-gray-800'>
                  Invoice No
                </TableHead>
                <TableHead className='font-semibold text-gray-800'>
                  Order Time
                </TableHead>
                <TableHead className='text-right font-semibold text-gray-800'>
                  Type
                </TableHead>
                <TableHead className='text-right font-semibold text-gray-800'>
                  Est. Remaining
                </TableHead>
                <TableHead className='text-right font-semibold text-gray-800'>
                  Status (Click to Advance)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className={cn(
                    'text-base transition-all duration-300 hover:bg-gray-50/50',
                    order.status === 'served' && 'bg-green-50/30'
                  )}
                >
                  <TableCell className='py-4 font-bold text-gray-900'>
                    {order.table || 'N/A'}
                  </TableCell>
                  <TableCell className='text-gray-600 font-medium'>
                    {order.invoiceNo}
                  </TableCell>
                  <TableCell className='text-gray-600'>
                    {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className='text-right capitalize'>
                    <Badge variant='outline' className='font-normal border-gray-200'>
                      {order.type}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right font-bold text-gray-800 font-mono'>
                    {order.status === 'served' ? (
                      <span className='text-green-600 text-xs'>
                        Served at {new Date(order.updatedAt).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                      </span>
                    ) : (
                      calculateRemainingTime(order.orderDate)
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge
                      className={cn(
                        'border-2 px-4 py-2 text-xs uppercase tracking-wider font-bold cursor-pointer select-none transition-transform active:scale-95 shadow-sm',
                        getStatusStyle(order.status)
                      )}
                      onClick={() => handleStatusClick(order)}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
