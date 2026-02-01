import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CrossIcon, HomeIcon, Search, Trash2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { LanguageSelectDropDown } from '@/components/dropdowns/LanguageSelectDropDown'
import { KitchenStatusSheet } from './components/KitchenStatusSheet'
import { OngoingOrderSheet } from './components/OngoingOrderSheet'
import { CalculatorModal } from './components/CalculatorModal'
import { AddItemDialog } from './components/AddItemDialog'
import { POSProvider, usePOS, POSCartItem } from '@/contexts/POSContext'
import { useAppSelector, useAppDispatch } from '@/store'
import { addOrder } from '@/store/slices/order/orderSlice'
import { v4 as uuidv4 } from 'uuid'
import { OrderLineItem } from '@/schemas/orderSchemas'

const POSContent = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    customerName,
    setCustomerName,
    customerType,
    setCustomerType,
    table,
    setTable,
    waiter,
    setWaiter,
    subtotal,
    serviceCharge,
    grandTotal,
  } = usePOS()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Get data from Redux
  const foodItems = useAppSelector((state) => state.food.foodItems)
  const addons = useAppSelector((state) => state.addon.addons)
  const assignedAddons = useAppSelector((state) => state.addon.assignedAddons)
  const menuTypes = useAppSelector((state) => state.menuType.menuTypes)
  const tables = useAppSelector((state) => state.table.tables)
  const users = useAppSelector((state) => state.user.users)

  // Filter items by search
  const filteredFoodItems = useMemo(() => {
    if (!searchQuery) return foodItems
    return foodItems.filter(item =>
      item.food_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [foodItems, searchQuery])

  const filteredAddons = useMemo(() => {
    if (!searchQuery) return addons
    return addons.filter(addon =>
      addon.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [addons, searchQuery])

  // Get add-ons for a food item
  const getAddonsForItem = (foodId: string) => {
    const assignedAddonIds = assignedAddons
      .filter(aa => aa.food_id === foodId)
      .map(aa => aa.addon_id)
    return addons.filter(addon => assignedAddonIds.includes(addon.id) && addon.status === 'active')
  }

  const handleAddItem = (item: any, type: 'food' | 'variant') => {
    const itemAddons = type === 'food' ? getAddonsForItem(item.id) : []
    setSelectedItem({ ...item, type, addons: itemAddons })
    setAddItemDialogOpen(true)
  }

  const handleConfirmAddItem = (quantity: number, selectedAddons: any[], notes: string) => {
    if (!selectedItem) return

    const cartItem: POSCartItem = {
      id: uuidv4(),
      itemType: selectedItem.type,
      itemId: selectedItem.id,
      itemName: selectedItem.type === 'food' ? selectedItem.food_name : selectedItem.variant_name,
      quantity,
      basePrice: selectedItem.type === 'food' ? 100 : selectedItem.price, // Food needs price field
      kitchenId: selectedItem.kitchen_id || 'kitchen-1',
      prepTime: selectedItem.prep_time || 15,
      addons: selectedAddons,
      notes,
    }

    addToCart(cartItem)
  }

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Please add items to cart')
      return
    }

    const lineItems: OrderLineItem[] = cartItems.map(item => ({
      id: uuidv4(),
      order_id: '', // Will be set by order
      item_type: item.itemType,
      item_id: item.itemId,
      item_name: item.itemName,
      quantity: item.quantity,
      price: item.basePrice,
      kitchen_id: item.kitchenId,
      prep_time: item.prepTime,
      status: 'pending',
      addons: item.addons,
      notes: item.notes,
    }))

    const order = {
      id: uuidv4(),
      invoiceNo: `INV-${Date.now()}`,
      status: 'pending' as const,
      customerName,
      waiter,
      table,
      orderDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      amount: grandTotal,
      type: customerType,
      lineItems,
    }

    dispatch(addOrder(order))
    clearCart()
    alert(`Order placed! Invoice: ${order.invoiceNo}`)
  }

  const handleQuickOrder = () => {
    if (cartItems.length === 0) {
      alert('Please add items to cart')
      return
    }
    setCustomerType('takeaway')
    setTimeout(() => handlePlaceOrder(), 100)
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      clearCart()
    }
  }

  const waiters = users.filter(u => u.role === 'waiter')

  return (
    <main className='h-screen w-screen overflow-hidden'>
      {/* Fixed Navbar */}
      <nav className='fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white px-6 py-3 shadow-md'>
        <div className='flex gap-2'>
          <Button onClick={() => navigate({ to: '/dashboard' })}>
            <HomeIcon className='h-4 w-4' />
            Home
          </Button>
          <Button showBadge={true} variant={'outline'} onClick={() => navigate({ to: '/pos-invoice' })}>
            New Order
          </Button>
          <OngoingOrderSheet />
          <KitchenStatusSheet />
          <Button variant='outline'>QR Order</Button>
          <Button variant='outline'>Online Order</Button>
          <Button variant='outline'>Today Order</Button>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleCancel}>
            <CrossIcon className='h-4 w-4' />
          </Button>
          <LanguageSelectDropDown />
        </div>
      </nav>

      <section className='grid h-full w-full flex-1 grid-cols-1 gap-4 overflow-hidden pt-16 lg:grid-cols-8'>
        {/* Billing Panel */}
        <aside className='relative col-span-1 h-full overflow-y-auto border-r border-gray-200 bg-white p-4 lg:col-span-3'>
          <div className='space-y-5'>
            {/* Order Details */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>Customer</label>
                <Input
                  placeholder='Walk-in'
                  value={customerName || ''}
                  onChange={(e) => setCustomerName(e.target.value || null)}
                />
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>Type</label>
                <select
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as any)}
                >
                  <option value='dine-in'>Dine-in</option>
                  <option value='takeaway'>Takeaway</option>
                  <option value='delivery'>Delivery</option>
                </select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>Table</label>
                <select
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  value={table || ''}
                  onChange={(e) => setTable(e.target.value || null)}
                >
                  <option value=''>Select Table</option>
                  {tables.map(t => (
                    <option key={t.id} value={t.table}>{t.table}</option>
                  ))}
                </select>
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>Waiter</label>
                <select
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  value={waiter || ''}
                  onChange={(e) => setWaiter(e.target.value || null)}
                >
                  <option value=''>Select Waiter</option>
                  {waiters.map(w => (
                    <option key={w.id} value={w.username}>{w.username}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cart Items */}
            <div className='min-h-[300px]'>
              <h3 className='mb-2 font-semibold'>Order Items</h3>
              {cartItems.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No items added</p>
              ) : (
                <div className='space-y-2'>
                  {cartItems.map(item => (
                    <Card key={item.id} className='p-3'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <p className='font-medium text-sm'>{item.itemName}</p>
                          {item.addons.length > 0 && (
                            <p className='text-xs text-muted-foreground'>
                              + {item.addons.map(a => a.name).join(', ')}
                            </p>
                          )}
                          {item.notes && (
                            <p className='text-xs text-muted-foreground italic'>Note: {item.notes}</p>
                          )}
                        </div>
                        <div className='flex items-center gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className='h-3 w-3' />
                          </Button>
                          <span className='w-8 text-center text-sm'>{item.quantity}</span>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className='h-3 w-3' />
                          </Button>
                          <Button
                            size='sm'
                            variant='destructive'
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>
                      <div className='mt-1 text-sm font-semibold text-right'>
                        ${((item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity).toFixed(2)}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Fixed Section */}
          <div className='absolute right-0 bottom-0 left-0 border-t border-gray-200 bg-white px-4 py-4 shadow-lg'>
            <div className='mb-4 space-y-2 rounded-lg bg-gray-50 p-3'>
              <div className='flex justify-between text-sm'>
                <span className='font-medium text-gray-700'>Subtotal:</span>
                <span className='font-semibold text-gray-800'>${subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='font-medium text-gray-700'>Service Charges (10%):</span>
                <span className='font-semibold text-gray-800'>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className='flex justify-between border-t border-gray-200 pt-2 text-base'>
                <span className='font-bold text-gray-900'>Grand Total:</span>
                <span className='font-bold text-gray-900'>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
              <CalculatorModal />
              <Button variant='destructive' className='w-full' onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant='secondary' className='w-full' onClick={handleQuickOrder}>
                Quick Order
              </Button>
              <Button className='w-full' onClick={handlePlaceOrder}>Place Order</Button>
            </div>
          </div>
        </aside>

        {/* Menu Items Panel */}
        <section className='col-span-1 h-full overflow-y-auto rounded-tl-2xl bg-white p-6 shadow-inner lg:col-span-5'>
          <div className='relative w-full'>
            <Search className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
            <Input
              type='text'
              placeholder='Search menu items...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='border-none bg-gray-100 py-3 pr-3 pl-9 text-sm'
            />
          </div>

          <div className='mt-4 flex w-full flex-col gap-6'>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='flex gap-2'>
                <TabsTrigger value='all'>All Items</TabsTrigger>
                {menuTypes.filter(mt => mt.status === 'active').map(mt => (
                  <TabsTrigger key={mt.id} value={mt.id}>{mt.menu_type}</TabsTrigger>
                ))}
                <TabsTrigger value='addons'>Add-Ons</TabsTrigger>
              </TabsList>

              <TabsContent value='all' className='mt-3 h-[calc(100vh-220px)] overflow-y-auto rounded-lg bg-gray-50 p-4'>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                  {filteredFoodItems.filter(item => item.status === 'active').map(item => (
                    <Card
                      key={item.id}
                      className='flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-md transition-shadow'
                    >
                      <div className='h-20 w-full rounded-md bg-gray-100 mb-2' />
                      <h3 className='text-sm font-semibold text-center'>{item.food_name}</h3>
                      <p className='text-xs text-gray-500'>${'100.00'}</p>
                      <Button size='sm' className='mt-2 w-full' onClick={() => handleAddItem(item, 'food')}>
                        Add
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value='addons' className='mt-3 h-[calc(100vh-220px)] overflow-y-auto rounded-lg bg-gray-50 p-4'>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                  {filteredAddons.filter(addon => addon.status === 'active').map(addon => (
                    <Card key={addon.id} className='flex flex-col items-center justify-center p-4'>
                      <h3 className='text-sm font-semibold text-center'>{addon.name}</h3>
                      <p className='text-xs text-gray-500'>${addon.price.toFixed(2)}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {menuTypes.filter(mt => mt.status === 'active').map(mt => (
                <TabsContent
                  key={mt.id}
                  value={mt.id}
                  className='mt-3 h-[calc(100vh-220px)] overflow-y-auto rounded-lg bg-gray-50 p-4'
                >
                  <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                    {filteredFoodItems.filter(item => item.category_name === mt.menu_type && item.status === 'active').map(item => (
                      <Card
                        key={item.id}
                        className='flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-md transition-shadow'
                      >
                        <div className='h-20 w-full rounded-md bg-gray-100 mb-2' />
                        <h3 className='text-sm font-semibold text-center'>{item.food_name}</h3>
                        <p className='text-xs text-gray-500'>${'100.00'}</p>
                        <Button size='sm' className='mt-2 w-full' onClick={() => handleAddItem(item, 'food')}>
                          Add
                        </Button>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </section>

      {selectedItem && (
        <AddItemDialog
          open={addItemDialogOpen}
          onOpenChange={setAddItemDialogOpen}
          itemName={selectedItem.type === 'food' ? selectedItem.food_name : selectedItem.variant_name}
          itemPrice={selectedItem.type === 'food' ? 100 : selectedItem.price}
          availableAddons={selectedItem.addons}
          onConfirm={handleConfirmAddItem}
        />
      )}
    </main>
  )
}

export const POSInvoiceFeature = () => {
  return (
    <POSProvider>
      <POSContent />
    </POSProvider>
  )
}
