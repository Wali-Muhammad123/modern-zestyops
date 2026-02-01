import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FoodItem {
    id: string
    status: 'active' | 'inactive'
    image_url: string
    category_name: string
    food_name: string
    kitchen_id: string
    prep_time: number // in minutes
    vat: number
    components: string
}

export interface FoodState {
    foodItems: FoodItem[]
    editFoodItem: FoodItem | null
}

const initialState: FoodState = {
    foodItems: [],
    editFoodItem: null,
}

const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
        addFoodItem: (state, action: PayloadAction<FoodItem>) => {
            state.foodItems.push(action.payload)
        },
        updateFoodItem: (state, action: PayloadAction<FoodItem>) => {
            const index = state.foodItems.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                state.foodItems[index] = action.payload
            }
        },
        deleteFoodItem: (state, action: PayloadAction<string>) => {
            state.foodItems = state.foodItems.filter((item) => item.id !== action.payload)
        },
        setEditFoodItem: (state, action: PayloadAction<FoodItem | null>) => {
            state.editFoodItem = action.payload
        },
    },
})

export const { addFoodItem, updateFoodItem, deleteFoodItem, setEditFoodItem } = foodSlice.actions
export default foodSlice.reducer
