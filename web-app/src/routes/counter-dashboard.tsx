import { createFileRoute } from '@tanstack/react-router'
import { CounterDashboard } from '@/features/counterdashboard'

export const Route = createFileRoute('/counter-dashboard')({
  component: CounterDashboard,
})
