import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/purchase-manage/purchase-return/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/purchase-manage/purchase-return/"!</div>
}
