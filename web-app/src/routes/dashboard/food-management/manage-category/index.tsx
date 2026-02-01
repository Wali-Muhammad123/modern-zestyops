import { createFileRoute } from '@tanstack/react-router'
import { ManageCategory } from '@/features/food-management/manage-category'

export const Route = createFileRoute(
  '/dashboard/food-management/manage-category/'
)({
  component: ManageCategory,
})
 