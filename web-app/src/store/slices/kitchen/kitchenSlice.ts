import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Kitchen } from '@/schemas/restaurantSchemas'

export type KitchenState = {
    kitchens: Kitchen[]
    selectedKitchen: Kitchen | null
    editKitchen: Kitchen | null
}

const initialState: KitchenState = {
    kitchens: [],
    selectedKitchen: null,
    editKitchen: null,
}

const kitchenSlice = createSlice({
    name: 'kitchen',
    initialState,
    reducers: {
        setKitchens: (state, action: PayloadAction<Kitchen[]>) => {
            state.kitchens = action.payload
        },
        addKitchen: (state, action: PayloadAction<Kitchen>) => {
            state.kitchens.push(action.payload)
        },
        updateKitchen: (state, action: PayloadAction<Kitchen>) => {
            const index = state.kitchens.findIndex(
                (kitchen) => kitchen.id === action.payload.id
            )
            if (index !== -1) {
                state.kitchens[index] = action.payload
            }
        },
        deleteKitchen: (state, action: PayloadAction<string>) => {
            state.kitchens = state.kitchens.filter(
                (kitchen) => kitchen.id !== action.payload
            )
        },
        clearKitchens: (state) => {
            state.kitchens = []
            state.selectedKitchen = null
        },
        getKitchenById: (state, action: PayloadAction<string>) => {
            state.selectedKitchen =
                state.kitchens.find(
                    (kitchen) => kitchen.id === action.payload
                ) || null
        },
        duplicateKitchen: (state, action: PayloadAction<string>) => {
            const original = state.kitchens.find((k) => k.id === action.payload)
            if (original) {
                state.kitchens.push({
                    ...original,
                    id: crypto.randomUUID(),
                })
            }
        },
        setEditKitchen: (state, action: PayloadAction<Kitchen | null>) => {
            state.editKitchen = action.payload
        },
    },
})

export const {
    setKitchens,
    addKitchen,
    updateKitchen,
    deleteKitchen,
    clearKitchens,
    getKitchenById,
    duplicateKitchen,
    setEditKitchen,
} = kitchenSlice.actions

export default kitchenSlice.reducer
