import { createFileRoute, Outlet } from '@tanstack/react-router'

// Layout route for reservations feature. Provides outlet for child routes:
// - Index route: shows Reservations list
// - add-booking: shows AddBookingFeature
// - unavailable-day: shows UnavailableDayFeature (future)
// - settings: shows ReservationSettingsFeature (future)
// Without an Outlet, navigating to a child path would still render the parent component only.
export const Route = createFileRoute('/dashboard/food-management')({
  component: () => <Outlet />,
})
