import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Order } from '@/schemas/orderSchemas'

interface LatestOrderProps {
  orders?: Order[]
}

export function LatestOrder({ orders = [] }: LatestOrderProps) {
  return (
    <div className='overflow-hidden rounded-lg border'>
      <div className='scrollbar-thin scrollbar-thumb-gray-300 max-h-[300px] overflow-y-auto'>
        <Table>
          <TableHeader className='bg-background sticky top-0 z-10'>
            <TableRow>
              <TableHead className='w-[150px]'>Customer</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead>Table</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
              <TableHead className='text-right'>Order Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>
                    {order.customerName || 'Walk-in'}
                  </TableCell>
                  <TableCell>{order.invoiceNo}</TableCell>
                  <TableCell>{order.table || 'N/A'}</TableCell>
                  <TableCell className='text-right'>
                    ${order.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className='text-right'>
                    {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center text-muted-foreground'>
                  No orders available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
