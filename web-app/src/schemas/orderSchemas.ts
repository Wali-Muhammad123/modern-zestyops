import { z } from 'zod'

export const orderStatusSchema = z.enum([
    'pending',
    'processing',
    'completed',
    'cancelled',
    'served',
])

export const orderTypeSchema = z.enum(['dine-in', 'takeaway', 'delivery'])

export const addonSelectionSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
})

export const orderLineItemSchema = z.object({
    id: z.string(),
    order_id: z.string(),
    item_type: z.enum(['food', 'variant']),
    item_id: z.string(), // food_id or variant_id
    item_name: z.string(),
    quantity: z.number(),
    price: z.number(), // base price per unit
    kitchen_id: z.string(),
    prep_time: z.number(), // in minutes
    status: z.enum(['pending', 'preparing', 'ready']),
    addons: z.array(addonSelectionSchema).optional(), // Selected add-ons
    notes: z.string().optional(), // Special instructions
})

export const orderItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
})

export const orderSchema = z.object({
    id: z.string(),
    invoiceNo: z.string(),
    status: orderStatusSchema,
    customerName: z.string().nullable(),
    waiter: z.string().nullable(),
    table: z.string().nullable(),
    orderDate: z.string(), // ISO string
    updatedAt: z.string(), // ISO string - Critical for 'served' vanish timer
    amount: z.number(),
    type: orderTypeSchema,
    items: z.array(orderItemSchema).optional(), // Optional for list view
    lineItems: z.array(orderLineItemSchema).optional(), // Kitchen-specific line items
})

export type OrderStatus = z.infer<typeof orderStatusSchema>
export type OrderType = z.infer<typeof orderTypeSchema>
export type AddonSelection = z.infer<typeof addonSelectionSchema>
export type OrderLineItem = z.infer<typeof orderLineItemSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type Order = z.infer<typeof orderSchema>
