import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { Order, OrderStatus } from '@/schemas/orderSchemas'
import { RootState } from '@/store'

// Dummy Data Generation
const statuses: OrderStatus[] = [
    'pending',
    'processing',
    'completed',
    'cancelled',
    'served',
]

const types: Order['type'][] = ['dine-in', 'takeaway', 'delivery']

const customers = [
    'John Doe', 'Sarah Khan', 'Hamza Ali', 'Mariam Khan', 'Ahmad Raza',
    'Zara Ahmed', 'Imran Malik', 'Ayesha Noor', 'Bilal Hussain', 'Fatima Zahra',
    'Omar Siddiq', 'Nadia Yousaf', 'Hassan Rafiq', 'Usman Tariq', 'Laiba Ali',
    'Sana Javed', 'Waleed Aslam', 'Hira Sheikh', 'Rafay Khan', 'Taimoor Ahmed',
]

const waiters = [
    'Ali', 'Usman', 'Fatima', 'Bilal', 'Sana', 'Hassan', 'Zeeshan', 'Khadija',
]

function random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomAmount() {
    return Math.floor(Math.random() * 4000) + 300
}

function randomDate() {
    const start = new Date(2025, 9, 1) // October 2025
    const end = new Date(2025, 10, 6) // November 6 2025
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return date.toISOString()
}

const foodItems = [
    { id: 'food-1', name: 'Grilled Chicken', kitchen: 'kitchen-2', prepTime: 15 },
    { id: 'food-2', name: 'Caesar Salad', kitchen: 'kitchen-1', prepTime: 10 },
    { id: 'food-3', name: 'Margherita Pizza', kitchen: 'kitchen-1', prepTime: 20 },
    { id: 'food-4', name: 'Beef Burger', kitchen: 'kitchen-2', prepTime: 12 },
    { id: 'food-5', name: 'Pasta Carbonara', kitchen: 'kitchen-1', prepTime: 18 },
    { id: 'food-6', name: 'Croissant', kitchen: 'kitchen-3', prepTime: 5 },
    { id: 'food-7', name: 'Chocolate Cake', kitchen: 'kitchen-3', prepTime: 8 },
    { id: 'food-8', name: 'Tomato Soup', kitchen: 'kitchen-4', prepTime: 15 },
    { id: 'food-9', name: 'French Fries', kitchen: 'kitchen-2', prepTime: 8 },
    { id: 'food-10', name: 'Ice Cream', kitchen: 'kitchen-3', prepTime: 3 },
]

const lineItemStatuses: ('pending' | 'preparing' | 'ready')[] = ['pending', 'preparing', 'ready']

function generateLineItems(orderId: string): any[] {
    const numItems = Math.floor(Math.random() * 3) + 1 // 1-3 items per order
    const items: any[] = []

    for (let i = 0; i < numItems; i++) {
        const foodItem = random(foodItems)
        items.push({
            id: `${orderId}-line-${i}`,
            order_id: orderId,
            item_type: 'food',
            item_id: foodItem.id,
            item_name: foodItem.name,
            quantity: Math.floor(Math.random() * 3) + 1,
            kitchen_id: foodItem.kitchen,
            prep_time: foodItem.prepTime,
            status: random(lineItemStatuses),
        })
    }

    return items
}

const initialOrders: Order[] = Array.from({ length: 100 }).map((_, i) => {
    const orderId = uuidv4()
    return {
        id: orderId,
        invoiceNo: `INV-${1001 + i}`,
        status: random(statuses),
        customerName: Math.random() > 0.05 ? random(customers) : null,
        waiter: Math.random() > 0.1 ? random(waiters) : null,
        table: Math.random() > 0.15 ? `T${Math.floor(Math.random() * 10) + 1}` : null,
        orderDate: Math.random() > 0.05 ? randomDate() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        amount: randomAmount(),
        type: random(types),
        lineItems: generateLineItems(orderId),
    }
})

interface OrderState {
    orders: Order[]
}

const initialState: OrderState = {
    orders: initialOrders,
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder: (state, action: PayloadAction<Order>) => {
            state.orders.push(action.payload)
        },
        updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
            const order = state.orders.find((o) => o.id === action.payload.id)
            if (order) {
                order.status = action.payload.status
                order.updatedAt = new Date().toISOString()
            }
        },
        deleteOrder: (state, action: PayloadAction<string>) => {
            state.orders = state.orders.filter((o) => o.id !== action.payload)
        },
        updateLineItemStatus: (state, action: PayloadAction<{ orderId: string; lineItemId: string; status: 'pending' | 'preparing' | 'ready' }>) => {
            const order = state.orders.find((o) => o.id === action.payload.orderId)
            if (order && order.lineItems) {
                const lineItem = order.lineItems.find((li) => li.id === action.payload.lineItemId)
                if (lineItem) {
                    lineItem.status = action.payload.status
                }
            }
        },
    },
})

export const { addOrder, updateOrderStatus, deleteOrder, updateLineItemStatus } = orderSlice.actions

export const selectOrders = (state: RootState) => state.order.orders

export const selectOrderByStatus = createSelector(
    [selectOrders, (_state: RootState, status: string | undefined) => status],
    (orders, status) => {
        if (!status || status === 'all') return orders
        return orders.filter((order) => order.status === status)
    }
)

export const selectCounterOrders = createSelector(
    [selectOrders],
    (orders) => {
        return orders.filter(
            (order) =>
                (order.type === 'dine-in' || order.type === 'takeaway') &&
                order.status !== 'cancelled'
        )
    }
)

export const selectOrderLineItemsByKitchen = createSelector(
    [selectOrders, (_state: RootState, kitchenId: string) => kitchenId],
    (orders, kitchenId) => {
        const allLineItems: Array<{
            orderId: string
            invoiceNo: string
            table: string | null
            orderDate: string
            lineItem: any
        }> = []

        orders.forEach(order => {
            if (order.lineItems && order.status !== 'cancelled' && order.status !== 'served') {
                order.lineItems
                    .filter(li => li.kitchen_id === kitchenId)
                    .forEach(lineItem => {
                        allLineItems.push({
                            orderId: order.id,
                            invoiceNo: order.invoiceNo,
                            table: order.table,
                            orderDate: order.orderDate,
                            lineItem,
                        })
                    })
            }
        })

        return allLineItems
    }
)

export default orderSlice.reducer
