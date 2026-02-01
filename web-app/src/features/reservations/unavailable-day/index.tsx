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
import { useDispatch, useSelector } from 'react-redux'
import {
  UnavailableDay,
  deleteUnavailableDay,
  setEditUnavailableDay,
} from '@/store/slices/reservation/reservationSlice'
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
import { AddUnavailableDayDialog } from '../components/unavailable-day'

// Removed local UnavailableDayItem type definition in favor of Redux type

export const columns: ColumnDef<UnavailableDay>[] = [
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
    accessorKey: 'date',
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
    cell: ({ row }) => <div className='capitalize'>{row.getValue('date')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const unavailableDay = row.original
      const dispatch = useDispatch()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Delete?')) {
                  dispatch(deleteUnavailableDay(unavailableDay.id))
                }
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => dispatch(setEditUnavailableDay(unavailableDay))}
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function UnavailableDaysTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [fromDate, setFromDate] = React.useState<Date | null>(null)
  const [toDate, setToDate] = React.useState<Date | null>(null)

  const data = useSelector((state: any) => state.reservation.unavailableDays)

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
      {/* Adjust 8rem depending on header height */}

      {/* Top controls */}
      <div className='flex flex-wrap items-center gap-2 py-4'>
        <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
          <DatePicker
            placeholder='From Date'
            selected={fromDate ?? undefined}
            onSelect={(date) => setFromDate(date ?? null)}
          />
          <DatePicker
            placeholder='To Date'
            selected={toDate ?? undefined}
            onSelect={(date) => setToDate(date ?? null)}
          />
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
              Columns <ChevronDown />
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
        <AddUnavailableDayDialog />
      </div>

      {/* Secondary controls */}
      <div className='flex flex-wrap items-center gap-2 py-2'>
        {/* <Input
          placeholder='Search...'
          value={
            (table.getColumn('')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('customer_name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        /> */}
        <Button variant='secondary' onClick={() => alert('Feature coming soon')}>
          Copy
        </Button>
        <Button variant='secondary' onClick={() => alert('Feature coming soon')}>
          CSV
        </Button>
        <Button variant='secondary' onClick={() => alert('Feature coming soon')}>
          Excel
        </Button>
        <Button variant='secondary' onClick={() => alert('Feature coming soon')}>
          PDF
        </Button>
        <Button variant='secondary' onClick={() => alert('Feature coming soon')}>
          Print
        </Button>
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

export const UnavailableReservationDayFeature = () => {
  return (
    <>
      <Header />
      <Main fixed className='flex-grow overflow-hidden'>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Reservation Day Off
          </h1>
        </div>
        <UnavailableDaysTable />
      </Main>
    </>
  )
}
