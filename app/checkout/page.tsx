import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/format';
import { CheckoutForm } from '@/components/CheckoutForm';

type Relation = { title: string | null; price: number | null };
type CartItem = {
  quantity: number;
  products: Relation | Relation[] | null;
  product_variants: Relation | Relation[] | null;
};

function firstRelation(value: Relation | Relation[] | null | undefined): Relation | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function Checkout() {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();

  if (!user) {
    return <div className="container py-10">Please sign in to continue to checkout.</div>;
  }

  const { data: rawData, error } = await s
    .from('cart_items')
    .select('quantity,products(title,price),product_variants(title,price)')
    .eq('user_id', user.id);

  if (error) throw error;

  const data = (rawData ?? []) as unknown as CartItem[];
  const total = data.reduce((sum, item) => {
    const variant = firstRelation(item.product_variants);
    const product = firstRelation(item.products);
    return sum + Number(variant?.price ?? product?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="mb-6 text-3xl font-black">Checkout</h1>
      <div className="mb-6 rounded-2xl border bg-white p-5">
        Order total <b className="float-right">{money(total)}</b>
      </div>
      <CheckoutForm />
    </div>
  );
}
