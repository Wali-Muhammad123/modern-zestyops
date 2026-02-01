import { createSlice, createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/store'

export interface DashboardMetrics {
    lifetimeRevenue: number
    lifetimeRevenueChange: number
    todayOrderCount: number
    todayOrderChange: number
    todaySales: number
    todaySalesChange: number
    totalCustomers: number
    totalCustomersChange: number
    totalDelivered: number
    totalDeliveredChange: number
    totalReservations: number
    totalReservationsChange: number
}

export interface MonthlySalesData {
    month: string
    sales: number
    orders: number
}

export interface TopSellingItem {
    name: string
    quantity: number
    revenue: number
}

interface DashboardState {
    // This slice primarily uses selectors for computed data
    // but can store cached values if needed
}

const initialState: DashboardState = {}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
})

// Selectors to compute dashboard metrics from existing data

// Helper to check if date is today
const isToday = (dateString: string): boolean => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

// Helper to get start of last month
const getLastMonthStart = (): Date => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    return date
}

// Metric selectors
export const selectDashboardMetrics = createSelector(
    [(state: RootState) => state.order.orders, (state: RootState) => state.reservation.reservations],
    (orders, reservations) => {
        const now = new Date()
        const lastMonthStart = getLastMonthStart()

        // Lifetime revenue
        const lifetimeRevenue = orders.reduce((sum, order) => sum + order.amount, 0)

        // Last month revenue for comparison
        const lastMonthRevenue = orders
            .filter(o => new Date(o.orderDate) >= lastMonthStart && new Date(o.orderDate) < new Date(now.getFullYear(), now.getMonth(), 1))
            .reduce((sum, order) => sum + order.amount, 0)

        const currentMonthRevenue = orders
            .filter(o => new Date(o.orderDate) >= new Date(now.getFullYear(), now.getMonth(), 1))
            .reduce((sum, order) => sum + order.amount, 0)

        const lifetimeRevenueChange = lastMonthRevenue > 0
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0

        // Today's orders
        const todayOrders = orders.filter(o => isToday(o.orderDate))
        const todayOrderCount = todayOrders.length

        // Yesterday's orders for comparison
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayOrderCount = orders.filter(o => {
            const orderDate = new Date(o.orderDate)
            return orderDate.toDateString() === yesterday.toDateString()
        }).length

        const todayOrderChange = yesterdayOrderCount > 0
            ? ((todayOrderCount - yesterdayOrderCount) / yesterdayOrderCount) * 100
            : 0

        // Today's sales
        const todaySales = todayOrders.reduce((sum, order) => sum + order.amount, 0)
        const yesterdaySales = orders
            .filter(o => {
                const orderDate = new Date(o.orderDate)
                return orderDate.toDateString() === yesterday.toDateString()
            })
            .reduce((sum, order) => sum + order.amount, 0)

        const todaySalesChange = yesterdaySales > 0
            ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
            : 0

        // Total unique customers
        const uniqueCustomers = new Set(orders.filter(o => o.customerName).map(o => o.customerName))
        const totalCustomers = uniqueCustomers.size

        // Total delivered (completed orders)
        const totalDelivered = orders.filter(o => o.status === 'completed' || o.status === 'served').length

        // Total reservations
        const totalReservations = reservations.length

        const metrics: DashboardMetrics = {
            lifetimeRevenue,
            lifetimeRevenueChange,
            todayOrderCount,
            todayOrderChange,
            todaySales,
            todaySalesChange,
            totalCustomers,
            totalCustomersChange: 0, // Would need historical data
            totalDelivered,
            totalDeliveredChange: 0, // Would need historical data
            totalReservations,
            totalReservationsChange: 0, // Would need historical data
        }

        return metrics
    }
)

// Monthly sales data selector
export const selectMonthlySalesData = createSelector(
    [(state: RootState) => state.order.orders],
    (orders) => {
        const monthlyData: { [key: string]: { sales: number; orders: number } } = {}

        orders.forEach(order => {
            const date = new Date(order.orderDate)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { sales: 0, orders: 0 }
            }

            monthlyData[monthKey].sales += order.amount
            monthlyData[monthKey].orders += 1
        })

        // Convert to array and get last 12 months
        const result: MonthlySalesData[] = Object.entries(monthlyData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-12)
            .map(([month, data]) => ({
                month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                sales: data.sales,
                orders: data.orders,
            }))

        return result
    }
)

// Top selling items selector
export const selectTopSellingItems = createSelector(
    [(state: RootState) => state.order.orders],
    (orders) => {
        const itemStats: { [key: string]: { quantity: number; revenue: number } } = {}

        orders.forEach(order => {
            if (order.lineItems) {
                order.lineItems.forEach(lineItem => {
                    if (!itemStats[lineItem.item_name]) {
                        itemStats[lineItem.item_name] = { quantity: 0, revenue: 0 }
                    }
                    itemStats[lineItem.item_name].quantity += lineItem.quantity
                    // Estimate revenue (would need price data)
                    itemStats[lineItem.item_name].revenue += lineItem.quantity * 100 // placeholder
                })
            }
        })

        const result: TopSellingItem[] = Object.entries(itemStats)
            .map(([name, stats]) => ({
                name,
                quantity: stats.quantity,
                revenue: stats.revenue,
            }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10)

        return result
    }
)

// Latest orders selector
export const selectLatestOrders = createSelector(
    [(state: RootState) => state.order.orders],
    (orders) => {
        return [...orders]
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .slice(0, 15)
    }
)

// Latest online orders (delivery) selector
export const selectLatestOnlineOrders = createSelector(
    [(state: RootState) => state.order.orders],
    (orders) => {
        return orders
            .filter(order => order.type === 'delivery')
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .slice(0, 15)
    }
)

export default dashboardSlice.reducer
