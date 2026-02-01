import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AddonItem {
    id: string
    name: string // Displayed as 'Add-ons Name' in UI
    price: number
    status: 'active' | 'inactive'
}

export interface AssignedAddonItem {
    id: string
    addon_id: string
    addon_name: string // Denormalized for display convenience
    food_id: string
    food_name: string // Denormalized for display convenience
}

export interface AddonState {
    addons: AddonItem[]
    assignedAddons: AssignedAddonItem[]
    editAddon: AddonItem | null
    editAssignedAddon: AssignedAddonItem | null
}

const initialState: AddonState = {
    addons: [],
    assignedAddons: [],
    editAddon: null,
    editAssignedAddon: null,
}

const addonSlice = createSlice({
    name: 'addon',
    initialState,
    reducers: {
        // Addon Definitions
        addAddon: (state, action: PayloadAction<AddonItem>) => {
            state.addons.push(action.payload)
        },
        updateAddon: (state, action: PayloadAction<AddonItem>) => {
            const index = state.addons.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                state.addons[index] = action.payload
            }
        },
        deleteAddon: (state, action: PayloadAction<string>) => {
            state.addons = state.addons.filter((item) => item.id !== action.payload)
        },
        setEditAddon: (state, action: PayloadAction<AddonItem | null>) => {
            state.editAddon = action.payload
        },

        // Assigned Addons
        addAssignedAddon: (state, action: PayloadAction<AssignedAddonItem>) => {
            state.assignedAddons.push(action.payload)
        },
        // Usually we might just delete assignment, but keeping update if needed
        updateAssignedAddon: (state, action: PayloadAction<AssignedAddonItem>) => {
            const index = state.assignedAddons.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                state.assignedAddons[index] = action.payload
            }
        },
        deleteAssignedAddon: (state, action: PayloadAction<string>) => {
            state.assignedAddons = state.assignedAddons.filter((item) => item.id !== action.payload)
        },
        setEditAssignedAddon: (state, action: PayloadAction<AssignedAddonItem | null>) => {
            state.editAssignedAddon = action.payload
        },
    },
})

export const {
    addAddon, updateAddon, deleteAddon, setEditAddon,
    addAssignedAddon, updateAssignedAddon, deleteAssignedAddon, setEditAssignedAddon
} = addonSlice.actions

export default addonSlice.reducer
