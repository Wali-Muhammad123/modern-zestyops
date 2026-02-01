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
import { AddGroupItemDialog } from './add-groupitem-dialog'
import { FoodDialog } from './food-dialog'
import { useDispatch, useSelector } from 'react-redux'
import { FoodItem, deleteFoodItem, setEditFoodItem } from '@/store/slices/food/foodSlice'

export const columns: ColumnDef<FoodItem>[] = [
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
    accessorKey: 'image_url',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Image
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url')

      return (
        <div className='flex items-center'>
          <img
            src={imageUrl as string}
            alt='Category'
            className='h-10 w-10 rounded-md object-cover'
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'food_name',
    header: 'Food Name',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('food_name')}</div>
    ),
  },
  {
    accessorKey: 'category_name',
    header: () => <div className='text-left'>Category Name</div>,
    cell: ({ row }) => {
      const categoryName = row.getValue('category_name')

      return <div className='text-left font-medium'>{categoryName as string}</div>
    },
  },
  {
    accessorKey: 'vat',
    header: 'VAT (%)',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('vat')}</div>,
  },
  {
    accessorKey: 'components',
    header: 'Components',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('components')}</div>
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
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const foodItem = row.original
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
              onClick={() => dispatch(setEditFoodItem(foodItem))}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Delete?')) dispatch(deleteFoodItem(foodItem.id))
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

export function FoodListTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const data = useSelector((state: any) => state.food.foodItems) || []

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
      <div className='flex w-full items-end justify-end space-x-2'>
        <FoodDialog />
        <AddGroupItemDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
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
      </div>
      {/* Secondary controls */}
      <div className='flex flex-wrap items-center gap-2 py-2'>
        <Input
          placeholder='Search...'
          value={
            (table.getColumn('food_name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('food_name')?.setFilterValue(event.target.value)
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
