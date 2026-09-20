import {createClient} from '@/lib/supabase/server';
import {ProductCard} from '@/components/ProductCard';

type Product = {
  id: string;
  [key: string]: unknown;
};

type WishlistItem = {
  products: Product | Product[] | null;
};

function firstProduct(value: Product | Product[] | null | undefined): Product | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function Wishlist() {
  const s = await createClient();
  const {data: {user}} = await s.auth.getUser();

  if (!user) {
    return <div className="container py-12">Sign in to view your wishlist.</div>;
  }

  const {data, error} = await s
    .from('wishlist_items')
    .select('products(*)')
    .eq('user_id', user.id);

  if (error) {
    return <div className="container py-12">Unable to load your wishlist.</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-black">Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {((data ?? []) as WishlistItem[]).map((item, index) => {
          const product = firstProduct(item.products);
          if (!product) return null;
          return <ProductCard key={product.id ?? index} p={product} />;
        })}
      </div>
    </div>
  );
}