import React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DatePicker } from '@/components/date-picker'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectOrderByStatus, deleteOrder, updateOrderStatus } from '@/store/slices/order/orderSlice'
import { Order, OrderStatus } from '@/schemas/orderSchemas'

export const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className='capitalize truncate max-w-[80px]' title={row.getValue('id')}>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'invoiceNo',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Invoice No
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='lowercase'>{row.getValue('invoiceNo')}</div>
    ),
  },
  {
    accessorKey: 'customerName',
    header: () => <div className='text-right'>Customer Name</div>,
    cell: ({ row }) => {
      const customerName = row.getValue('customerName') as string
      return <div className='text-right font-medium'>{customerName || '-'}</div>
    },
  },
  {
    accessorKey: 'waiter',
    header: () => <div className='text-right'>Waiter</div>,
    cell: ({ row }) => {
      const waiter = row.getValue('waiter') as string
      return <div className='text-right font-medium'>{waiter || '-'}</div>
    },
  },
  {
    accessorKey: 'table',
    header: 'Table',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('table') || '-'}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('status')}</div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('type')}</div>,
  },
  {
    accessorKey: 'orderDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Order Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='capitalize'>{new Date(row.getValue('orderDate')).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className='text-right'>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return <div className='text-right font-medium'>{formatted}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original
      const dispatch = useAppDispatch()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={order.status}
                  onValueChange={(value) => dispatch(updateOrderStatus({ id: order.id, status: value as OrderStatus }))}
                >
                  <DropdownMenuRadioItem value='pending'>Pending</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='processing'>Processing</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='completed'>Completed</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='served'>Served</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='cancelled'>Cancelled</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => dispatch(deleteOrder(order.id))}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function OrderListTable({ status }: { status: string | undefined }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const data = useAppSelector(React.useCallback((state) => selectOrderByStatus(state, status), [status]))

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className='flex h-[calc(100vh-8rem)] flex-col'>
      {/* Top controls */}
      <div className='flex flex-wrap items-center gap-2 py-4'>
        <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
          <DatePicker placeholder='From Date' selected={undefined} onSelect={() => { }} />
          <DatePicker placeholder='To Date' selected={undefined} onSelect={() => { }} />
        </div>
        <Button variant='default' className='ml-2'>
          Filter
        </Button>
        <Button variant='default' className='ml-2'>
          Search
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Secondary controls */}
      <div className='flex flex-wrap items-center gap-2 py-2'>
        <Input
          placeholder='Search invoice...'
          value={(table.getColumn('invoiceNo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('invoiceNo')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <Button variant='secondary'>Copy</Button>
        <Button variant='secondary'>CSV</Button>
        <Button variant='secondary'>Excel</Button>
        <Button variant='secondary'>PDF</Button>
        <Button variant='secondary'>Print</Button>
      </div>

      {/* Scrollable table area */}
      <div className='flex-1 overflow-y-auto rounded-md border'>
        <Table className='min-w-full'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='text-muted-foreground flex-1 text-sm'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export const OrderFeature = ({ status }: { status: string | undefined }) => {
  return (
    <div className='flex h-screen flex-col'>
      <Header />
      <Main className='flex-1 overflow-hidden'>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Order List</h1>
          {status && status !== 'all' && (
            <span className='text-muted-foreground capitalize'>Status: {status}</span>
          )}
        </div>
        <OrderListTable status={status} />
      </Main>
    </div>
  )
}
