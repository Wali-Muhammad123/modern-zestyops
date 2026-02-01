import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'accepted':
      return {
        icon: <CheckCircle className='h-4 w-4 text-green-600' />,
        gradient: 'from-green-50 to-green-100 border-green-200 text-green-800',
      }
    case 'pending':
      return {
        icon: <Clock className='h-4 w-4 text-yellow-600' />,
        gradient:
          'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800',
      }
    case 'cancelled':
      return {
        icon: <XCircle className='h-4 w-4 text-red-600' />,
        gradient: 'from-red-50 to-red-100 border-red-200 text-red-800',
      }
    case 'delayed':
      return {
        icon: <AlertTriangle className='h-4 w-4 text-orange-600' />,
        gradient:
          'from-orange-50 to-orange-100 border-orange-200 text-orange-800',
      }
    default:
      return {
        icon: <Clock className='h-4 w-4 text-gray-500' />,
        gradient: 'from-gray-50 to-gray-100 border-gray-200 text-gray-800',
      }
  }
}

export function KitchenOrderCard({
  orderId,
  table,
  items,
  status = 'pending',
  eta = '15 mins',
}: {
  orderId: number
  table: string
  items: { name: string; qty: number }[]
  status?: 'pending' | 'accepted' | 'cancelled' | 'delayed'
  eta?: string
}) {
  const style = getStatusStyle(status)

  return (
    <Card className='mb-4 overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md'>
      {/* Status banner */}
      <div
        className={`flex items-center justify-between bg-gradient-to-r ${style.gradient} px-4 py-2 text-xs font-semibold tracking-wide text-black uppercase`}
      >
        <div className='flex items-center gap-2'>
          {style.icon}
          <span>{status}</span>
        </div>
        <span className='text-[11px] italic opacity-80'>ETA: {eta}</span>
      </div>

      {/* Card body */}
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold text-gray-800'>
          Order #{orderId}
        </CardTitle>
        <CardDescription className='text-xs text-gray-500'>
          Table {table} • {items.length} items
        </CardDescription>
      </CardHeader>

      <CardContent className='max-h-32 overflow-y-auto pt-0'>
        <div className='space-y-1 text-sm'>
          {items.map((item, i) => (
            <div
              key={i}
              className='flex justify-between rounded-md px-1 py-0.5 text-gray-700 hover:bg-gray-50'
            >
              <span>{item.name}</span>
              <span className='font-medium'>{item.qty}x</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
