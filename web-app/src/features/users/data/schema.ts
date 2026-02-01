import { userSchema, User as GlobalUser, type UserStatus } from '@/schemas/userSchemas'

export type User = GlobalUser
export type { UserStatus }
export const usersSchema = userSchema
