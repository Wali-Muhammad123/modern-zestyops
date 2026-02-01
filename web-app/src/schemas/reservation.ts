// schemas/reservation.ts
import { z } from "zod"

export const reservationSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  number_of_people: z.number().min(1, "Must be at least 1"),
  start_time: z.string().min(1, "Start time required"),
  end_time: z.string().min(1, "End time required"),
  table: z.string().min(1, "Select a table"),
  date: z.string().min(1, "Select a date"),
})

export type ReservationFormValues = z.infer<typeof reservationSchema>
