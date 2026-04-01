# ProofWork MVP

ProofWork is a two-sided student marketplace where learners attempt real company projects, pay to unlock briefs, submit work, and receive structured review feedback.

## Tech stack

- Next.js App Router (TypeScript)
- Prisma + PostgreSQL
- NextAuth (Google OAuth)
- Tailwind CSS
- Razorpay (payments)
- Supabase Storage (submission files)

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy env vars:

```bash
cp .env.example .env
```

3. Run database migration / generate client:

```bash
npx prisma generate
```

4. Start dev server:

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Payment flow notes

- If `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set, `/api/payments/create-order` uses live Razorpay.
- If keys are missing, payment endpoints run in mock mode for local development.
- Webhook verification uses `RAZORPAY_WEBHOOK_SECRET` when configured.

## Useful commands

```bash
npm run lint
npm run build
```
