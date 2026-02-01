import { createFileRoute } from '@tanstack/react-router'
import { ManageFood } from '@/features/food-management/manage-food'

export const Route = createFileRoute('/dashboard/food-management/manage-food/')(
  {
    component: ManageFood,
  }
)
