import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/purchase-manage/stock-out-ingredients/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/purchase-manage/stock-out-ingredients/"!</div>
}
