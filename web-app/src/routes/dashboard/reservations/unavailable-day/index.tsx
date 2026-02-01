import { UnavailableReservationDayFeature } from '@/features/reservations/unavailable-day'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/reservations/unavailable-day/',
)({
  component: UnavailableReservationDayFeature,
})