# STRIVE Talk

STRIVE Talk is an AAC communication support app from STRIVE Physical Therapy. It helps users quickly access customizable word cards, personal information cards, and speech output for everyday communication needs.

The app is built as a Nuxt 4 PWA with English and Spanish support, local card/settings persistence, and Supabase-backed account access for STRIVE Talk only.

## Features

- Customizable AAC word and information cards
- Browser speech output with English and Spanish voice settings
- Voice pitch, speed, and voice-type settings
- Light/dark theme support
- Safe delete mode for card management
- PWA install support
- Supabase account access check for the `talk` product
- STRIVE Talk-only auth page
- 60-day STRIVE Talk trial flow
- STRIVE Talk-only pricing page with monthly and yearly plans

## Routes

| Route | Description |
| --- | --- |
| `/` | Main AAC word-card screen |
| `/phrases` | Information/personal detail cards |
| `/settings` | Voice and app settings |
| `/about` | STRIVE Physical Therapy information |
| `/auth.html` | STRIVE Talk-only sign in, account creation, and password reset |
| `/choose-plan.html?product=talk` | STRIVE Talk pricing after trial expiration |

## Access Flow

STRIVE Talk checks access on app load with `checkTalkAccess()`.

- Not logged in: redirects to `/auth.html`
- Logged in with no Talk access row: redirects to `/auth.html?panel=createTalk`
- New Talk account: creates a 60-day trial in `product_access`
- Existing logged-in user with no Talk row: gets a 60-day Talk trial on login
- Active trial, paid, beta, or team access: opens STRIVE Talk
- Expired trial: redirects to `/choose-plan.html?product=talk`

The pricing page only shows after the 60-day trial is expired or paid access is inactive/canceled.

## Pricing Page

`public/choose-plan.html` includes two STRIVE Talk plans:

- Monthly: `$8.99 / month`, checkout plan id `talk_monthly`
- Yearly: `$60 / year`, checkout plan id `talk_yearly`

Checkout requests send:

```js
{
  product: 'talk',
  plan
}
```

## Supabase

The app uses Supabase Auth and a `product_access` table. The access check expects rows like:

```text
user_id
product
has_access
access_type
trial_started_at
trial_ends_at
subscription_status
```

For STRIVE Talk, `product` must be:

```text
talk
```

Recommended access types currently handled:

- `trial`
- `paid`
- `beta`
- `team`

Make sure Supabase Row Level Security policies only allow users to read/update appropriate rows for their own account, and keep privileged checkout/subscription writes behind trusted server or Edge Function logic.

## Environment Variables

The Nuxt app reads these public environment variables:

```bash
NUXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NUXT_PUBLIC_FORMSPREE_ENDPOINT=optional_formspree_endpoint
```

`nuxt.config.ts` currently includes default Supabase public values for local/static builds. Replace those with deployment environment variables when moving this repo to its own deployment.

## Local Development

Requirements:

- Node.js 22+
- pnpm 10+

Install and run:

```bash
corepack pnpm install
corepack pnpm dev
```

Useful checks:

```bash
corepack pnpm typecheck
corepack pnpm test
corepack pnpm lint
```

## Build

```bash
corepack pnpm build
```

For static generation:

```bash
corepack pnpm generate
```

## Notes

- `public/auth.html` and `public/choose-plan.html` are standalone static pages that live alongside the Nuxt app.
- `app/utils/talkAccess.ts` controls the STRIVE Talk app gate.
- The older casual access-code files may still exist from earlier testing, but the active access flow is Supabase-based.
