import React, { createContext, useContext, useState, useCallback } from 'react'
import { AddonSelection } from '@/schemas/orderSchemas'

export interface POSCartItem {
    id: string // unique cart item id
    itemType: 'food' | 'variant'
    itemId: string
    itemName: string
    quantity: number
    basePrice: number
    kitchenId: string
    prepTime: number
    addons: AddonSelection[]
    notes: string
}

interface POSContextType {
    // Cart items
    cartItems: POSCartItem[]
    addToCart: (item: POSCartItem) => void
    removeFromCart: (cartItemId: string) => void
    updateQuantity: (cartItemId: string, quantity: number) => void
    clearCart: () => void

    // Order details
    customerName: string | null
    setCustomerName: (name: string | null) => void

    customerType: 'dine-in' | 'takeaway' | 'delivery'
    setCustomerType: (type: 'dine-in' | 'takeaway' | 'delivery') => void

    table: string | null
    setTable: (table: string | null) => void

    waiter: string | null
    setWaiter: (waiter: string | null) => void

    // Calculations
    subtotal: number
    serviceCharge: number
    grandTotal: number

    // Service charge percentage (configurable)
    serviceChargePercent: number
    setServiceChargePercent: (percent: number) => void
}

const POSContext = createContext<POSContextType | undefined>(undefined)

export const usePOS = () => {
    const context = useContext(POSContext)
    if (!context) {
        throw new Error('usePOS must be used within POSProvider')
    }
    return context
}

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<POSCartItem[]>([])
    const [customerName, setCustomerName] = useState<string | null>(null)
    const [customerType, setCustomerType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in')
    const [table, setTable] = useState<string | null>(null)
    const [waiter, setWaiter] = useState<string | null>(null)
    const [serviceChargePercent, setServiceChargePercent] = useState(10)

    const addToCart = useCallback((item: POSCartItem) => {
        setCartItems(prev => [...prev, item])
    }, [])

    const removeFromCart = useCallback((cartItemId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== cartItemId))
    }, [])

    const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartItemId)
            return
        }
        setCartItems(prev =>
            prev.map(item =>
                item.id === cartItemId ? { ...item, quantity } : item
            )
        )
    }, [removeFromCart])

    const clearCart = useCallback(() => {
        setCartItems([])
        setCustomerName(null)
        setTable(null)
        setWaiter(null)
    }, [])

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const itemTotal = item.basePrice * item.quantity
        const addonsTotal = item.addons.reduce((addonSum, addon) => addonSum + addon.price, 0) * item.quantity
        return sum + itemTotal + addonsTotal
    }, 0)

    const serviceCharge = (subtotal * serviceChargePercent) / 100
    const grandTotal = subtotal + serviceCharge

    const value: POSContextType = {
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
        serviceChargePercent,
        setServiceChargePercent,
    }

    return <POSContext.Provider value={value}>{children}</POSContext.Provider>
}
