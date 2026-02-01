import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Coffee, Flame, HomeIcon, Soup, UtensilsCrossed, Clock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Inbox } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectOrderLineItemsByKitchen, updateLineItemStatus } from '@/store/slices/order/orderSlice'

// Kitchen types - will eventually come from Redux
const kitchenTypes = [
  {
    key: 'kitchen-1',
    label: 'Main Kitchen',
    icon: <UtensilsCrossed className='h-5 w-5' />,
  },
  { key: 'kitchen-2', label: 'Grill Station', icon: <Flame className='h-5 w-5' /> },
  { key: 'kitchen-3', label: 'Bakery', icon: <Coffee className='h-5 w-5' /> },
  { key: 'kitchen-4', label: 'Soup Counter', icon: <Soup className='h-5 w-5' /> },
]

interface KitchenOrderCardProps {
  orderId: string
  invoiceNo: string
  table: string | null
  orderDate: string
  lineItem: any
}

const KitchenOrderCard = ({ orderId, invoiceNo, table, orderDate, lineItem }: KitchenOrderCardProps) => {
  const dispatch = useAppDispatch()
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const orderTime = new Date(orderDate)
  const elapsed = Math.floor((now.getTime() - orderTime.getTime()) / 60000) // minutes

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getNextStatus = (current: string) => {
    if (current === 'pending') return 'preparing'
    if (current === 'preparing') return 'ready'
    return null
  }

  const handleStatusClick = () => {
    const next = getNextStatus(lineItem.status)
    if (next) {
      dispatch(updateLineItemStatus({
        orderId,
        lineItemId: lineItem.id,
        status: next as any,
      }))
    }
  }

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg',
      lineItem.status === 'ready' && 'bg-green-50/30 border-green-200'
    )}>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center justify-between text-base'>
          <div className='flex items-center gap-2'>
            <span className='font-bold'>{invoiceNo}</span>
            {table && <Badge variant='outline' className='font-normal'>{table}</Badge>}
          </div>
          <Badge
            className={cn('cursor-pointer px-3 py-1', getStatusStyle(lineItem.status))}
            onClick={handleStatusClick}
          >
            {lineItem.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='text-sm font-medium'>
            {lineItem.quantity}x {lineItem.item_name}
          </div>
        </div>

        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            <span>Elapsed: {elapsed} min</span>
          </div>
          <div className='flex items-center gap-1'>
            <CheckCircle2 className='h-3 w-3' />
            <span>Prep: {lineItem.prep_time} min</span>
          </div>
        </div>

        {elapsed > lineItem.prep_time && lineItem.status !== 'ready' && (
          <Badge variant='destructive' className='w-full justify-center text-xs'>
            OVERDUE
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

export const KitchenDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState('kitchen-1')

  // Get line items for the active kitchen
  const kitchenLineItems = useAppSelector((state) =>
    selectOrderLineItemsByKitchen(state, activeTab)
  )

  return (
    <section className='relative flex min-h-screen flex-col bg-gray-50'>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='flex flex-1 flex-col'
      >
        {/* ===== Sticky Tabs Header ===== */}
        <div className='fixed top-0 right-0 left-0 z-10 flex h-20 items-center justify-center border-b bg-white shadow-sm'>
          <TabsList className='flex flex-wrap justify-center gap-4 bg-transparent'>
            <Button onClick={() => navigate({ to: '/dashboard' })}>
              <HomeIcon className='h-5 w-5' />
            </Button>
            {kitchenTypes.map((type) => (
              <TabsTrigger
                key={type.key}
                value={type.key}
                className={cn(
                  'group flex items-center gap-3 rounded-xl border border-transparent bg-white/70 px-6 py-5 text-base font-medium text-gray-600 shadow-sm transition-all duration-300',
                  'hover:bg-white hover:text-black hover:shadow-md',
                  'data-[state=active]:border-gray-900 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg'
                )}
              >
                <span className='transition-transform duration-300 group-data-[state=active]:scale-110'>
                  {type.icon}
                </span>
                <span>{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ===== Scrollable Tab Content ===== */}
        <div className='flex-1 overflow-hidden'>
          {kitchenTypes.map((type) => (
            <TabsContent
              key={type.key}
              value={type.key}
              className='h-full overflow-y-auto px-8 pt-[100px] pb-6'
            >
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {kitchenLineItems.length > 0 ? (
                  kitchenLineItems.map((item, idx) => (
                    <KitchenOrderCard
                      key={`${item.orderId}-${item.lineItem.id}-${idx}`}
                      orderId={item.orderId}
                      invoiceNo={item.invoiceNo}
                      table={item.table}
                      orderDate={item.orderDate}
                      lineItem={item.lineItem}
                    />
                  ))
                ) : (
                  <div className='col-span-full flex flex-col items-center justify-center py-24 text-gray-400'>
                    <Inbox className='mb-4 h-16 w-16 text-gray-300' />
                    <p className='text-lg font-medium text-gray-500'>
                      No orders in {type.label}
                    </p>
                    <p className='mt-1 text-sm text-gray-400'>
                      New orders will appear here automatically
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </section>
  )
}
