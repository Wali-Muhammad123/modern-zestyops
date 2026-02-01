import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface MenuType {
    id: string
    menu_type: string
    status: 'active' | 'inactive'
    image_url: string
}

export interface MenuTypeState {
    menuTypes: MenuType[]
    editMenuType: MenuType | null
}

const initialState: MenuTypeState = {
    menuTypes: [],
    editMenuType: null,
}

const menuTypeSlice = createSlice({
    name: 'menuType',
    initialState,
    reducers: {
        addMenuType: (state, action: PayloadAction<MenuType>) => {
            state.menuTypes.push(action.payload)
        },
        updateMenuType: (state, action: PayloadAction<MenuType>) => {
            const index = state.menuTypes.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                state.menuTypes[index] = action.payload
            }
        },
        deleteMenuType: (state, action: PayloadAction<string>) => {
            state.menuTypes = state.menuTypes.filter((item) => item.id !== action.payload)
        },
        setEditMenuType: (state, action: PayloadAction<MenuType | null>) => {
            state.editMenuType = action.payload
        },
    },
})

export const { addMenuType, updateMenuType, deleteMenuType, setEditMenuType } = menuTypeSlice.actions
export default menuTypeSlice.reducer
