import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TopSellingItem {
  name: string
  quantity: number
  revenue: number
}

interface TopSellingItemsTableProps {
  items?: TopSellingItem[]
}

export function TopSellingItemsTable({ items = [] }: TopSellingItemsTableProps) {
  return (
    <Table>
      <TableCaption>Top Selling Items</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Item Name</TableHead>
          <TableHead>Quantity Sold</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right">
                ${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
