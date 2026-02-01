import { z } from "zod"

export const menuTypeSchema = z.object({
    menu_type: z.string().min(1, "Menu type is required"),
    status: z.enum(["active", "inactive"]),
    image_url: z.any().optional(), // File handling to be improved
})

export const foodItemSchema = z.object({
    food_name: z.string().min(1, "Food name is required"),
    category_name: z.string().min(1, "Category is required"),
    kitchen_id: z.string().min(1, "Kitchen is required"),
    prep_time: z.coerce.number().min(0, "Prep time must be positive"),
    status: z.enum(["active", "inactive"]),
    vat: z.coerce.number().min(0),
    components: z.string().optional(),
    image_url: z.any().optional(),
})

export const foodVariantSchema = z.object({
    food_id: z.string().min(1, "Food item is required"),
    variant_name: z.string().min(1, "Variant name is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    prep_time: z.coerce.number().min(0).optional(), // Override food's prep time if needed
    status: z.enum(["active", "inactive"]),
})

export const foodAvailabilitySchema = z.object({
    food_id: z.string().min(1, "Food item is required"),
    available_time_start: z.string().min(1, "Start time is required"),
    available_time_end: z.string().min(1, "End time is required"),
    available_day: z.string().min(1, "Available days are required"), // Can be comma separated string or array handled in UI
    status: z.enum(["active", "inactive"]),
})

export const categorySchema = z.object({
    category_name: z.string().min(1, "Category name is required"),
    parent_category: z.string().optional(),
    status: z.enum(["active", "inactive"]),
    offer: z.boolean().optional(),
    image_url: z.any().optional(),
})

export const addonSchema = z.object({
    name: z.string().min(1, "Addon name is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    status: z.enum(["active", "inactive"]),
})

export const assignAddonSchema = z.object({
    addon_id: z.string().min(1, "Addon selection is required"),
    food_id: z.string().min(1, "Food item is required"),
})

export type MenuTypeFormValues = z.infer<typeof menuTypeSchema>
export type FoodItemFormValues = z.infer<typeof foodItemSchema>
export type FoodVariantFormValues = z.infer<typeof foodVariantSchema>
export type FoodAvailabilityFormValues = z.infer<typeof foodAvailabilitySchema>
export type CategoryFormValues = z.infer<typeof categorySchema>
export type AddonFormValues = z.infer<typeof addonSchema>
export type AssignAddonFormValues = z.infer<typeof assignAddonSchema>
