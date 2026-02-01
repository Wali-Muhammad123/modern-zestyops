import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/production/set-production-unit/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/production/set-production-unit/"!</div>
}
