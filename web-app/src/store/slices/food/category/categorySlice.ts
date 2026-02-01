import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CategoryItem {
    id: string
    status: 'active' | 'inactive'
    image_url: string
    category_name: string
    parent_category: string
    offer: boolean
}

export interface CategoryState {
    categories: CategoryItem[]
    editCategory: CategoryItem | null
}

const initialState: CategoryState = {
    categories: [],
    editCategory: null,
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        addCategory: (state, action: PayloadAction<CategoryItem>) => {
            state.categories.push(action.payload)
        },
        updateCategory: (state, action: PayloadAction<CategoryItem>) => {
            const index = state.categories.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                state.categories[index] = action.payload
            }
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            state.categories = state.categories.filter((item) => item.id !== action.payload)
        },
        setEditCategory: (state, action: PayloadAction<CategoryItem | null>) => {
            state.editCategory = action.payload
        },
    },
})

export const { addCategory, updateCategory, deleteCategory, setEditCategory } = categorySlice.actions
export default categorySlice.reducer
