import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initializePaystack } from '@/lib/paystack';

type CartRelation = {
  price: number | null;
  stock: number | null;
  is_active: boolean | null;
};

type CartItem = {
  quantity: number;
  products: CartRelation | CartRelation[] | null;
  product_variants: CartRelation | CartRelation[] | null;
};

function firstRelation(value: CartRelation | CartRelation[] | null | undefined): CartRelation | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function POST(req: Request) {
  try {
    const s = await createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const address = await req.json();
    if (!address.full_name || !address.phone || !address.region || !address.city || !address.address) {
      return NextResponse.json({ error: 'Complete the required delivery fields.' }, { status: 400 });
    }

    const { data: rawItems, error: cartError } = await s
      .from('cart_items')
      .select('quantity,products(price,stock,is_active),product_variants(price,stock,is_active)')
      .eq('user_id', user.id);
    if (cartError) throw cartError;

    const items = (rawItems ?? []) as unknown as CartItem[];
    if (!items.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

    let total = 0;
    for (const item of items) {
      const product = firstRelation(item.products);
      const variant = firstRelation(item.product_variants);
      const price = Number(variant?.price ?? product?.price ?? 0);
      const stock = Number(variant?.stock ?? product?.stock ?? 0);
      if (product?.is_active !== true || variant?.is_active === false || item.quantity > stock) {
        return NextResponse.json({ error: 'Cart contains unavailable or insufficient-stock items.' }, { status: 409 });
      }
      total += price * item.quantity;
    }

    const reference = 'MY-' + crypto.randomUUID().replaceAll('-', '').slice(0, 24);
    const { error } = await s.from('checkout_intents').insert({ user_id: user.id, shipping_address: address, total, reference });
    if (error) throw error;

    const pay = await initializePaystack(
      user.email || '',
      total,
      reference,
      (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin) + '/api/payments/callback',
    );
    return NextResponse.json(pay);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to initialize payment' }, { status: 500 });
  }
}
