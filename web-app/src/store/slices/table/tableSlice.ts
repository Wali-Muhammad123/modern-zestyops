import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RestaurantTable } from '@/schemas/restaurantSchemas'

export type TableState = {
    tables: RestaurantTable[]
    selectedTable: RestaurantTable | null
    editTable: RestaurantTable | null
}

const initialState: TableState = {
    tables: [],
    selectedTable: null,
    editTable: null,
}

const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setTables: (state, action: PayloadAction<RestaurantTable[]>) => {
            state.tables = action.payload
        },
        addTable: (state, action: PayloadAction<RestaurantTable>) => {
            state.tables.push(action.payload)
        },
        updateTable: (state, action: PayloadAction<RestaurantTable>) => {
            const index = state.tables.findIndex(
                (table) => table.id === action.payload.id
            )
            if (index !== -1) {
                state.tables[index] = action.payload
            }
        },
        deleteTable: (state, action: PayloadAction<string>) => {
            state.tables = state.tables.filter(
                (table) => table.id !== action.payload
            )
        },
        clearTables: (state) => {
            state.tables = []
            state.selectedTable = null
        },
        getTableById: (state, action: PayloadAction<string>) => {
            state.selectedTable =
                state.tables.find(
                    (table) => table.id === action.payload
                ) || null
        },
        duplicateTable: (state, action: PayloadAction<string>) => {
            const original = state.tables.find((t) => t.id === action.payload)
            if (original) {
                state.tables.push({
                    ...original,
                    id: crypto.randomUUID(),
                })
            }
        },
        setEditTable: (state, action: PayloadAction<RestaurantTable | null>) => {
            state.editTable = action.payload
        },
    },
})

export const {
    setTables,
    addTable,
    updateTable,
    deleteTable,
    clearTables,
    getTableById,
    duplicateTable,
    setEditTable,
} = tableSlice.actions

export default tableSlice.reducer
