import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FoodVariant {
    id: string
    food_id: string
    food_name?: string // Optional, joined for display
    variant_name: string
    price: number
    prep_time?: number // Optional, overrides parent food prep_time
    status: 'active' | 'inactive'
}

export interface VariantState {
    variants: FoodVariant[]
    editVariant: FoodVariant | null
}

const initialState: VariantState = {
    variants: [],
    editVariant: null,
}

const variantSlice = createSlice({
    name: 'variant',
    initialState,
    reducers: {
        addVariant: (state, action: PayloadAction<FoodVariant>) => {
            state.variants.push(action.payload)
        },
        updateVariant: (state, action: PayloadAction<FoodVariant>) => {
            const index = state.variants.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                state.variants[index] = action.payload
            }
        },
        deleteVariant: (state, action: PayloadAction<string>) => {
            state.variants = state.variants.filter((item) => item.id !== action.payload)
        },
        setEditVariant: (state, action: PayloadAction<FoodVariant | null>) => {
            state.editVariant = action.payload
        },
    },
})

export const { addVariant, updateVariant, deleteVariant, setEditVariant } = variantSlice.actions
export default variantSlice.reducer
