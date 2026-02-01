import { z } from 'zod'

// Kitchen Schema
export const kitchenSchema = z.object({
    id: z.string(),
    name: z.string(),
})

export type Kitchen = z.infer<typeof kitchenSchema>

// Table Schema
export const tableSchema = z.object({
    id: z.string(),
    table: z.string(),
    number_of_seats: z.number(),
    floor: z.string().nullable(),
})

export type RestaurantTable = z.infer<typeof tableSchema>
