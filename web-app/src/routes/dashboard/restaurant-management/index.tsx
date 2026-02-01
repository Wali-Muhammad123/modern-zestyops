import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/restaurant-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/restaurant-management/"!</div>
}
