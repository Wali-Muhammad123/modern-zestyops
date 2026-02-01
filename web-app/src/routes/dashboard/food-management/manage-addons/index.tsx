import { createFileRoute } from '@tanstack/react-router'
import { ManageAddOns } from '@/features/food-management/manage-addons'

export const Route = createFileRoute(
  '/dashboard/food-management/manage-addons/'
)({
  component: ManageAddOns,
})
