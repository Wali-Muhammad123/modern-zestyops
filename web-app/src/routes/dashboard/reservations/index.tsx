import { createFileRoute } from '@tanstack/react-router'
import { Reservations } from '@/features/reservations'

export const Route = createFileRoute('/dashboard/reservations/')({
  component: Reservations,
})
