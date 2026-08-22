# Kids Store — Children's Qameez Shalwar E-Commerce

A full-stack Next.js e-commerce store for **Kids Store**, owned by tailor **Zeeshan**, selling children's Qameez Shalwar (boys, ages 5–14).

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- PostgreSQL + Prisma ORM
- Cloudinary (product image storage)
- JWT session auth (bcrypt password hashing)
- Zod validation on every API route

## Getting Started

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL, AUTH_SECRET, CLOUDINARY_*, NEXT_PUBLIC_WHATSAPP_NUMBER

npx prisma generate
npx prisma db push        # or: npx prisma migrate dev --name init
npm run db:seed           # creates admin user + 4 sample products

npm run dev
```

> **Note:** `prisma generate` and `db push` need real internet access to
> download Prisma's engine binaries — run these on your own machine, CI, or
> deploy platform, not inside a network-restricted sandbox.

## Default accounts (from seed)

- **Admin:** `zeeshan@kidsstore.pk` / `Admin@12345` — change this after first login.
- **Sample customer:** `customer@example.com` / `Customer@123`

Admin panel: `/admin/login`

## Environment Variables

See `.env.example`. Cloudinary is required for image upload to work; without
it the admin upload endpoint returns a clear "not configured yet" error
instead of failing silently. Easypaisa is optional — checkout works fully
with Cash on Delivery even with no Easypaisa credentials set.

## Production build

```bash
npm run lint
npm run build
npm run start
```

## Project structure

- `app/` — pages and API routes (App Router)
- `app/admin/(protected)/` — admin dashboard, products, orders, settings (server-verified auth on every route)
- `components/` — UI components grouped by feature
- `lib/` — db client, auth, validation schemas, Cloudinary, WhatsApp, Easypaisa abstraction
- `prisma/schema.prisma` — full relational schema
- `prisma/seed.ts` — sample/dev data (clearly marked, safe to delete before going live)

## Notes on Easypaisa

`lib/payments/easypaisa.ts` is a clean integration point, not a working
gateway — Anthropic/this build never fabricates a successful online payment.
Until `EASYPAISA_MERCHANT_ID`, `EASYPAISA_API_KEY` and `EASYPAISA_SECRET` are
set, checkout only offers Cash on Delivery. Wire the real Easypaisa merchant
API calls into that file once credentials are available.
