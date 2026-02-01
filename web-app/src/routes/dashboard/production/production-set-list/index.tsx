import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/production/production-set-list/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/production/production-set-list/"!</div>
}
