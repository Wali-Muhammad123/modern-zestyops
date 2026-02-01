import { z } from "zod"

export const unavailableDaySchema = z.object({
    start_time: z.string().min(1, "Start time required"),
    end_time: z.string().min(1, "End time required"),
    date: z.string().min(1, "Select a date"),
})

export type UnavailableDayFormValues = z.infer<typeof unavailableDaySchema>
