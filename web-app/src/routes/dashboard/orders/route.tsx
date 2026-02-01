import { createFileRoute } from '@tanstack/react-router'
import { OrderFeature } from '@/features/orders'

export const Route = createFileRoute('/dashboard/orders')({
  validateSearch: (search: Record<string, string | undefined>) => {
    const allowed = ['pending', 'processing', 'completed', 'served', 'cancelled', 'all']
    const status = allowed.includes(search.status ?? '') ? search.status : 'all'
    return { status }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { status } = Route.useSearch()
  return <OrderFeature status={status} />
}
