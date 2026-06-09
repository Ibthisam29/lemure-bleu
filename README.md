# Lemure Blue — Luxury Jewellery Platform

**Stack:** Next.js 14 · Supabase · Stripe · Resend · Tailwind CSS

---

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in .env.local values
npm run dev
```

---

## Setup Checklist

### 1. Supabase
1. Create project at supabase.com
2. Run `supabase-schema.sql` in SQL Editor
3. Copy URL + anon key + service_role key to `.env.local`

### 2. Stripe
1. Create products in Stripe Dashboard (or use dynamic pricing as configured)
2. Add webhook endpoint: `https://lemurebleu.com/api/webhooks/stripe`
3. Listen for: `checkout.session.completed`
4. Copy keys to `.env.local`

### 3. Resend (Email)
1. Create account at resend.com
2. Verify domain `lemurebleu.com`
3. Add API key to `.env.local`

### 4. Deploy (Vercel)
```bash
vercel --prod
```
Add all env vars in Vercel dashboard.

---

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/vip` | VIP registration |
| `/vip-preorder` | Stripe preorder |
| `/appointment` | Booking form |
| `/stone-vault` | Gemstone listings |
| `/limited-editions` | Collections |
| `/admin` | Admin dashboard |
| `/admin/leads` | VIP leads CRM |
| `/admin/preorders` | Stripe preorders |
| `/admin/stones` | Stone Vault CMS |
| `/admin/collections` | Collections CMS |
| `/admin/appointments` | Appointment manager |
| `/admin/content` | Content editor |
| `/admin/settings` | System settings |
| `/privacy-policy` | Legal |
| `/terms` | Legal |
| `/refund-policy` | Legal |

---

## Preorder Tiers

| Tier | SGD | Stripe Amount |
|------|-----|---------------|
| Blue Entry | 300 | 30000 |
| Maison | 1,000 | 100000 |
| Legacy | 3,000 | 300000 |

---

## Admin Access
Navigate to `/admin`. Auth is currently open — **protect with Supabase Auth or middleware before going live.**

### Recommended: Add Middleware Auth
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const auth = request.headers.get('authorization')
    const expected = `Basic ${Buffer.from(
      `admin:${process.env.ADMIN_PASSWORD}`
    ).toString('base64')}`
    
    if (auth !== expected) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
      })
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
```
# Supabase restored Tue Jun  9 15:13:10 UTC 2026
