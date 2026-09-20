# Myshop

Ghana-focused ecommerce application built with Next.js 14, React 18, TypeScript, Tailwind, Supabase SSR/Postgres/Auth/Storage and Paystack.

## Local setup
Copy .env.example to .env.local, set the Supabase URL/publishable key, service-role key, Paystack secret and site URL, then run npm install, npx tsc --noEmit, npm run build and npm start.

## Supabase
The connected Myshops Supabase project contains RLS-protected catalog, variants, carts, wishlist, recently viewed products, reviews, orders, tracking, checkout intents and Storage buckets. Enable Email and Google OAuth and allow /auth/callback.

## Admin
Create an Auth user and promote its profiles.role to ADMIN through a trusted SQL/admin workflow. Do not use editable user metadata for authorization.

## Paystack
PAYSTACK_SECRET_KEY is server-only. Checkout calculates its amount from database prices. Paystack verification checks status, GHS currency and exact amount. The place_order database function performs atomic inventory decrement, order snapshotting, tracking and cart clearing after verified payment.

## Render
Node Web Service. Build command: npm install && npm run build. Start command: npm start. Node >=20.10.0 <25. Set all .env.example variables in Render and set NEXT_PUBLIC_SITE_URL to the deployed Render URL.

## Jumia
The protected admin importer accepts a Jumia Ghana URL or share message containing a product URL, extracts the product ID, reports HTTP blocking distinctly, refuses fabricated data, prevents duplicate source IDs and saves successful imports as inactive products for review.

## Security
Supabase RLS is enabled for application data and Storage. Service-role credentials remain server-only. Customer ownership is enforced by auth.uid(). Payment and inventory decisions are server/database authoritative.
