import { createFileRoute } from '@tanstack/react-router'
import { KitchenDashboard } from '@/features/kitchendashboard'

export const Route = createFileRoute('/kitchen-dashboard')({
  component: KitchenDashboard,
})
