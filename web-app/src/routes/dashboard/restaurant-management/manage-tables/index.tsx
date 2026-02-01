import { createFileRoute } from '@tanstack/react-router'
import { ManageTables } from '@/features/restaurant-management/manage-tables'

export const Route = createFileRoute(
    '/dashboard/restaurant-management/manage-tables/',
)({
    component: ManageTables,
})
