import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/purchase-manage/return-invoice/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/purchase-manage/return-invoice/"!</div>
}
