import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/purchase-manage/purchase-item/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/purchase-manage/purchase-item/"!</div>
}
