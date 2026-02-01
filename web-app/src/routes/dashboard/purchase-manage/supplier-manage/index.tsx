import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/purchase-manage/supplier-manage/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/purchase-manage/supplier-manage/"!</div>
}
