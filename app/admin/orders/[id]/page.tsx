import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/format';

export default async function AdminOrder({
  params,
}: {
  params: { id: string };
}) {
  const s = await createClient();
  const { data: o } = await s
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!o) {
    return <div className="container py-10">Order not found</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-black">{o.order_number}</h1>
      <p className="mt-3">
        {money(Number(o.total))} · {o.status}
      </p>
      <pre className="mt-6 overflow-auto rounded-xl bg-white p-5">
        {JSON.stringify(o.shipping_address, null, 2)}
      </pre>
    </div>
  );
}
