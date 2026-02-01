import { createFileRoute } from '@tanstack/react-router'
import { POSInvoiceFeature } from '@/features/posinvoice'

export const Route = createFileRoute('/pos-invoice')({
  component: POSInvoiceFeature,
})
