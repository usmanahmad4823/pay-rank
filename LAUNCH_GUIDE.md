# PayRank Production Launch Guide 🚀

This document outlines the step-by-step instructions to take **PayRank** from local development to a live, production-ready web application accessible to real users.

---

## 📋 Pre-Launch Summary Checklist

- [ ] Production PostgreSQL Database Provisioned (Supabase / Neon / Railway)
- [ ] Safepay Live Merchant Account & KYC Verified
- [ ] Production Safepay API & Webhook Credentials Obtained
- [ ] Vercel / Host Environment Variables Configured
- [ ] Webhook URL Configured in Safepay Dashboard
- [ ] Custom Domain & SSL Configured (`payrank.lol`)
- [ ] Live PKR Test Transaction Verified

---

## Step 1: Set Up Production PostgreSQL Database

Local development uses SQLite (`dev.db`). For production multi-user concurrency and reliability, use a hosted PostgreSQL instance.

1. **Choose a Database Provider**:
   - **Supabase** (Recommended free tier): [supabase.com](https://supabase.com)
   - **Neon Tech**: [neon.tech](https://neon.tech)
   - **Railway**: [railway.app](https://railway.app)

2. **Obtain Connection String**:
   Copy your PostgreSQL connection URL:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST]:5432/pay_rank?schema=public&sslmode=require"
   ```

3. **Deploy Database Schema**:
   Run the following command to create all tables (`restaurants` and `payments`) on your production PostgreSQL database:
   ```bash
   npx prisma db push
   ```

4. *(Optional)* **Seed Initial Listings**:
   To pre-populate initial Pakistani restaurant listings:
   ```bash
   npx ts-node prisma/seed.ts
   ```

---

## Step 2: Set Up Live Safepay Merchant Account

To collect real payments from users via Cards, EasyPaisa, JazzCash, or Bank Transfer:

1. **Register Account**:
   - Create a merchant account at [getsafepay.com](https://getsafepay.com).
   - Complete standard business verification (KYC / Bank account details).

2. **Retrieve Production Credentials**:
   - Log into Safepay Merchant Dashboard -> **Developer / API Keys**.
   - Copy the following live credentials:
     - **Production Secret Key** (`sec_live_...`)
     - **Production Public Key / Client ID** (`sec_live_...`)
     - **Production Webhook Secret** (`whsec_live_...`)

3. **Configure Webhook Endpoint**:
   - Go to **Safepay Dashboard** -> **Webhooks** -> **Add Endpoint**.
   - Set **Endpoint URL**:
     `https://payrank.lol/api/webhooks/safepay` *(Replace with your actual domain)*
   - Enable Webhook Events:
     - `payment:created`
     - `payment:completed`
     - `intent:created`
     - `invoice.payment_succeeded`

---

## Step 3: Deploy to Vercel

Vercel is the recommended hosting platform for Next.js 14 App Router applications.

1. **Import Repository**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Connect your GitHub account and import `usmanahmad4823/pay-rank`.

2. **Configure Environment Variables**:
   In the Vercel project deployment settings, add the following environment variables:

   | Variable Name | Production Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgresql://...` | Production PostgreSQL Connection String |
   | `NEXT_PUBLIC_APP_URL` | `https://payrank.lol` | Your live production domain URL |
   | `SAFEPAY_ENVIRONMENT` | `production` | Set to `production` for real payments |
   | `SAFEPAY_API_KEY` | `sec_live_...` | Live Safepay Secret Key |
   | `NEXT_PUBLIC_SAFEPAY_CLIENT_ID` | `sec_live_...` | Live Safepay Public Client ID |
   | `SAFEPAY_WEBHOOK_SECRET` | `whsec_live_...` | Live Safepay Webhook Secret Key |
   | `MOCK_PAYMENTS` | `false` | MUST be `false` in production |

3. **Deploy**:
   - Click **Deploy**. Vercel will run `prisma generate` and `next build` automatically.

---

## Step 4: Configure Custom Domain & SSL

1. **Add Custom Domain in Vercel**:
   - Go to **Vercel Dashboard** -> **Project Settings** -> **Domains**.
   - Add `payrank.lol` (and `www.payrank.lol`).

2. **Configure DNS Records**:
   Add the following DNS records at your domain registrar (e.g. Namecheap, GoDaddy, Cloudflare):

   | Type | Name / Host | Target / Value |
   | :--- | :--- | :--- |
   | **A Record** | `@` | `76.76.21.21` |
   | **CNAME** | `www` | `cname.vercel-dns.com` |

3. Vercel automatically issues and renews free Let's Encrypt SSL/TLS certificates.

---

## Step 5: Post-Deployment Smoke Test

Before opening the site to the public, perform a live test:

1. **Test Registration & Bid**:
   - Go to `https://payrank.lol`.
   - Click **Claim Rank** and submit a test entry with 10 PKR.
   - Verify you are redirected to Safepay live checkout page.

2. **Test Payment & Webhook**:
   - Complete payment of 10 PKR via card/wallet.
   - Verify return to `https://payrank.lol/checkout/success`.
   - Confirm status says **Payment Confirmed & Verified**.
   - Check leaderboard to confirm the entry is live at position #1.

3. **Verify Idempotency**:
   - Refresh the page / re-trigger status polling. Confirm total paid remains 10 PKR without double counting.

---

## Step 6: Ongoing Maintenance & Monitoring

- **Safepay Webhook Logs**: Check Safepay Dashboard -> Webhook History to monitor delivery success rates.
- **Vercel Monitoring**: Enable Vercel Analytics and Sentry for exception tracking.
- **Database Backups**: Enable automatic daily backups on Supabase / Neon database dashboard.

---

🎉 **Congratulations! Your PayRank platform is now live and ready to accept payments!**
