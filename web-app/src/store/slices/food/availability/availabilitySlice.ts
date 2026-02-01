import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FoodAvailability {
    id: string
    food_id: string
    food_name?: string // Optional, joined for display
    available_time_start: string
    available_time_end: string
    available_day: string[]
    status: 'active' | 'inactive'
}

export interface AvailabilityState {
    availabilities: FoodAvailability[]
    editAvailability: FoodAvailability | null
}

const initialState: AvailabilityState = {
    availabilities: [],
    editAvailability: null,
}

const availabilitySlice = createSlice({
    name: 'availability',
    initialState,
    reducers: {
        addAvailability: (state, action: PayloadAction<FoodAvailability>) => {
            state.availabilities.push(action.payload)
        },
        updateAvailability: (state, action: PayloadAction<FoodAvailability>) => {
            const index = state.availabilities.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                state.availabilities[index] = action.payload
            }
        },
        deleteAvailability: (state, action: PayloadAction<string>) => {
            state.availabilities = state.availabilities.filter((item) => item.id !== action.payload)
        },
        setEditAvailability: (state, action: PayloadAction<FoodAvailability | null>) => {
            state.editAvailability = action.payload
        },
    },
})

export const { addAvailability, updateAvailability, deleteAvailability, setEditAvailability } = availabilitySlice.actions
export default availabilitySlice.reducer
