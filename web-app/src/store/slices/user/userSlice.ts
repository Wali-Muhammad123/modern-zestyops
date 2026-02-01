import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import { User, UserRole, UserStatus } from '@/schemas/userSchemas'
import { RootState } from '@/store'

// Dummy Data Generation (Patterned after features/users/data/users.ts)
faker.seed(67890)

const initialUsers: User[] = Array.from({ length: 50 }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    return {
        id: faker.string.uuid(),
        firstName,
        lastName,
        username: faker.internet.username({ firstName, lastName }).toLocaleLowerCase(),
        email: faker.internet.email({ firstName }).toLocaleLowerCase(),
        phoneNumber: faker.phone.number({ style: 'international' }),
        status: faker.helpers.arrayElement(['active', 'inactive', 'invited', 'suspended']) as UserStatus,
        role: faker.helpers.arrayElement(['superadmin', 'admin', 'cashier', 'manager', 'waiter']) as UserRole,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
    }
})

interface UserState {
    users: User[]
}

const initialState: UserState = {
    users: initialUsers,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        inviteUser: (state, action: PayloadAction<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'phoneNumber' | 'username' | 'status'>>) => {
            // Logic for invite: create a placeholder user with "Invited" status
            const newUser: User = {
                id: uuidv4(),
                firstName: 'Invited', // Placeholder
                lastName: 'User',     // Placeholder
                username: action.payload.email.split('@')[0], // Generate username from email
                phoneNumber: '',      // Placeholder
                status: 'invited',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...action.payload,
            }
            state.users.unshift(newUser) // Add to top
        },
        addUser: (state, action: PayloadAction<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'status'>>) => {
            const newUser: User = {
                id: uuidv4(),
                status: 'active', // Default to active for manually added users
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...action.payload,
            }
            state.users.unshift(newUser)
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex(u => u.id === action.payload.id)
            if (index !== -1) {
                state.users[index] = action.payload
            }
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter((u) => u.id !== action.payload)
        },
    },
})

export const { inviteUser, addUser, updateUser, deleteUser } = userSlice.actions

import { createSelector } from '@reduxjs/toolkit'
const selectUserState = (state: RootState) => state.user

export const selectUsers = createSelector(
    [selectUserState],
    (userState) => userState.users
)

export default userSlice.reducer
