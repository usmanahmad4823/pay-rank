# Outbid.lol — Pay-To-Rank Public Leaderboard ("Rank Surge")

A full-stack, production-ready web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Stripe Payments**.

---

## ⚡ Core Mechanic

1. **Pure Price Ordering**: Rank is determined strictly by how much money each entry's owner has paid (`currentBidCents`). Highest paid amount holds #1.
2. **Instant Transparency**: No ad auctions, no algorithms, no minimum spend commitments.
3. **Re-Bid Top-Up Mechanic**: Submitting an existing link/handle recognizes the entry and allows top-ups. The owner is charged **only the difference** required to reach their new target bid total.
4. **Signature-Verified Webhooks**: Entries are marked verified **only** after receiving a valid, signature-verified Stripe webhook event. Pending/failed bids are never shown on the public board.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Actions & API Routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Metallic & Dark Mesh Aesthetic
- **Icons & Motion**: Lucide React + Framer Motion + Canvas Confetti
- **Database & ORM**: PostgreSQL via Prisma ORM
- **Payments**: Stripe Checkout Sessions & Webhooks
- **Deployment Target**: Vercel

---

## 🚀 Environment Variables

Create a `.env` file in the root directory:

```env
# PostgreSQL Database Connection URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pay_rank?schema=public"

# Stripe API Keys (from Stripe Dashboard -> Developers -> API keys)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe Webhook Secret (from Stripe Dashboard -> Webhooks or `stripe listen`)
STRIPE_WEBHOOK_SECRET="whsec_..."

# Base Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Development / Mock Payment Bypass ("true" enables instant testing without Stripe API keys)
MOCK_PAYMENTS="true"
```

---

## 📦 Quick Start & Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database & Prisma

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed sample competitive leaderboard data
npx prisma db seed
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the All-Time Leaderboard or [http://localhost:3000/today](http://localhost:3000/today) for the Daily Board variant.

---

## 💳 Stripe Webhook Configuration

To receive live or test payments locally:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Forward events to your local endpoint:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Copy the secret printed in the terminal (`whsec_...`) into your `.env` file as `STRIPE_WEBHOOK_SECRET`.

---

## 🌐 Deploying to Vercel

1. **Database**: Provision a PostgreSQL database via Vercel Postgres, Supabase, or Neon.
2. **Environment Variables**: Add `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_APP_URL` in your Vercel Project Settings.
3. **Build Command**: Set build command to `npm run build` (which automatically runs `prisma generate && next build`).
4. **Stripe Webhook**: In your Stripe Dashboard, add your Vercel URL endpoint: `https://your-domain.vercel.app/api/webhooks/stripe` listening for `checkout.session.completed`.

---

## 🧪 API Reference Summary

- `GET /api/leaderboard?board=all_time|daily&page=1` - Retrieves verified ranked entries and board statistics.
- `POST /api/entries/check-rebid` - Real-time lookup for existing link re-bid calculations.
- `POST /api/entries` - Validates inputs, calculates top-up math, and creates Stripe Checkout Session.
- `POST /api/webhooks/stripe` - Signature-verified Stripe webhook handler.
- `GET /api/entries/:id/click` - Increments entry click count and performs HTTP 302 redirect.
