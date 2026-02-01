import { createFileRoute } from '@tanstack/react-router'
import { OrderFeature } from '@/features/orders'
import { useEffect } from 'react';

export const Route = createFileRoute('/dashboard/orders/')({
  validateSearch: (search: Record<string, string | undefined>) => {
    const allowed = ['pending', 'cancelled', 'completed', 'all'];
    const status = allowed.includes(search.status ?? '') ? search.status : 'all';
    return { status };
  },
  component: RouteComponent,
});


function RouteComponent() {
  const { status } = Route.useSearch();
  useEffect(() => {
    console.log('Order status changed:', status);
  }, [status]);
  console.log('Status:', status);
  return <OrderFeature status={status} />;
}