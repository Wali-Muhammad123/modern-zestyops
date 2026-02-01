import { z } from 'zod'

export const userStatusSchema = z.enum([
    'active',
    'inactive',
    'invited',
    'suspended',
])

export const userRoleSchema = z.enum([
    'superadmin',
    'admin',
    'cashier',
    'manager',
    'waiter',
])

export const userSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    status: userStatusSchema,
    role: userRoleSchema,
    createdAt: z.date().or(z.string()), // Allow ISO string from JSON
    updatedAt: z.date().or(z.string()),
})

export type UserStatus = z.infer<typeof userStatusSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type User = z.infer<typeof userSchema>
