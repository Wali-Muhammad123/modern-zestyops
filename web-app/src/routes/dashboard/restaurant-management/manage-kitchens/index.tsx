import { createFileRoute } from '@tanstack/react-router'
import { ManageKitchens } from '@/features/restaurant-management/manage-kitchens'
export const Route = createFileRoute(
  '/dashboard/restaurant-management/manage-kitchens/',
)({
  component: ManageKitchens,
})