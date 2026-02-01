import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/production/add-production/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/production/add-production/"!</div>
}
