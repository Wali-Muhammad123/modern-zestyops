import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/production/production-setting/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/production/production-setting/"!</div>
}
