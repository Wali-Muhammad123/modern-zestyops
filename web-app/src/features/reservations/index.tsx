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
import { Reservation } from '@/store/slices/reservation/reservationSlice'
import {
  deleteReservation,
  duplicateReservation,
  setEditReservation,
} from '@/store/slices/reservation/reservationSlice'
import { ArrowUpDown, ChevronDown, MoreHorizontal, XIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
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
import { ReservationDialog } from './components/reservation-dialog'

export const columns: ColumnDef<Reservation>[] = [
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
    header: 'SL',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'customer_name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Customer Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const customerName = row.getValue('customer_name') as string

      return <div className='text-left font-medium'>{customerName}</div>
    },
  },
  {
    accessorKey: 'table',
    header: 'Table',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('table')}</div>
    ),
  },
  {
    accessorKey: 'number_of_people',
    header: () => <div className='text-left'>Number of People</div>,
    cell: ({ row }) => {
      const numberOfPeople = row.getValue('number_of_people') as number

      return <div className='text-left font-medium'>{numberOfPeople}</div>
    },
  },
  {
    accessorKey: 'start_time',
    header: () => <div className='text-left'>Start Time</div>,
    cell: ({ row }) => {
      const startTime = row.getValue('start_time') as string

      return <div className='text-left font-medium'>{startTime}</div>
    },
  },
  {
    accessorKey: 'end_time',
    header: () => <div className='text-left'>End Time</div>,
    cell: ({ row }) => {
      const endTime = row.getValue('end_time') as string

      return <div className='text-left font-medium'>{endTime}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('status')}</div>
    ),
  },
  {
    accessorKey: 'date',
    filterFn: 'auto',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue('date') as string}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const reservation = row.original
      const dispatch = useDispatch()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => dispatch(duplicateReservation(reservation.id))}
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                dispatch(setEditReservation(reservation))
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Delete?')) {
                  dispatch(deleteReservation(reservation.id))
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ReservationListTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [fromDate, setFromDate] = React.useState<Date | null>(null)
  const [toDate, setToDate] = React.useState<Date | null>(null)

  const data: Reservation[] = useSelector(
    (state: any) => state.reservation.reservations
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      dateRange: (row, columnId, filterValue) => {
        const raw = row.getValue(columnId)
        if (!raw) return false

        const rowDate = new Date(raw as string | number | Date)
        const { from, to } = filterValue ?? {}

        if (from && rowDate < from) return false
        if (to && rowDate > to) return false

        return true
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Helper to sync table filter
  const updateDateFilter = (from: Date | null, to: Date | null) => {
    if (!from && !to) {
      table.getColumn('date')?.setFilterValue(undefined)
      return
    }
    table.getColumn('date')?.setFilterValue({ from, to })
  }

  return (
    <div className='flex h-[calc(100vh-8rem)] flex-col'>
      <div className='flex flex-wrap items-center gap-2 py-4'>
        <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
          {/* From Date */}
          <DatePicker
            placeholder='From Date'
            selected={fromDate ?? undefined}
            onSelect={(date) => {
              const d = date ?? null
              setFromDate(d)
              updateDateFilter(d, toDate)
            }}
          />

          {/* To Date */}
          <DatePicker
            placeholder='To Date'
            selected={toDate ?? undefined}
            onSelect={(date) => {
              const d = date ?? null
              setToDate(d)
              updateDateFilter(fromDate, d)
            }}
          />
        </div>

        {/* Clear filter */}
        <Button
          variant='default'
          className='ml-2'
          onClick={() => {
            setFromDate(null)
            setToDate(null)
            updateDateFilter(null, null)
          }}
        >
          <XIcon />
        </Button>

        {/* Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className='capitalize'
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ReservationDialog />
      </div>

      {/* Search */}
      <div className='flex flex-wrap items-center gap-2 py-2'>
        <Input
          placeholder='Search...'
          value={(table.getColumn('customer_name')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('customer_name')?.setFilterValue(e.target.value)
          }
          className='max-w-sm'
        />
      </div>

      {/* Table */}
      <div className='flex-1 overflow-y-auto rounded-md border'>
        <Table className='min-w-full'>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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

      {/* Pagination */}
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='text-muted-foreground flex-1 text-sm'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} selected.
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
export const Reservations = () => {
  return (
    <>
      <Header />
      <Main fixed className='flex-grow overflow-hidden'>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Reservations</h1>
        </div>
        <ReservationListTable />
      </Main>
    </>
  )
}
