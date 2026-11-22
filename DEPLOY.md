# Cloudflare Pages Deployment for RAWAJ (Next.js 15)

## Prerequisites
1. GitHub account
2. Cloudflare account
3. Push this repo to GitHub

## Quick Deploy (one-time setup)

### 1. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/rawaj-agency.git
git push -u origin master
```

### 2. Cloudflare Pages Dashboard
1. Go to https://dash.cloudflare.com → Pages → Create a project
2. Connect to Git → Select your repo
3. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave empty)
4. Environment variables (add in Pages → Settings → Environment variables):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://cbbytmcocumjbntzopjx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_8mXuGXIlZdrAKXEA9Yj9zg_8geHMUW4`
   - `OWNER_EMAIL` = `123ONETWO123123@GMAIL.COM`
   - `NEXT_TELEMETRY_DISABLED` = `1`
5. Click **Save and Deploy**

### 3. First Deploy - Click Allow
**When the browser prompts "Allow Cloudflare Pages to access your GitHub repositories?" — click Allow.**

### 4. Custom Domain (optional)
After deploy: Pages → Custom domains → Add your domain → Follow DNS instructions.

## Alternative: Cloudflare CLI (wrangler)
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy .next --project-name=rawaj-agency
```

## Notes
- Next.js 15 works on Cloudflare Pages with standard build output (`.next` directory)
- Edge runtime: middleware, API routes run on edge
- Supabase: anon key is public-safe; RLS handles authorization
- Preview deployments: auto-created on PR/push
- Production: auto-deploy on push to `master`

## Environment Variables Reference
| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | Supabase anon/publishable key |
| OWNER_EMAIL | Yes | Admin owner email for /admin/setup |
| NEXT_TELEMETRY_DISABLED | No | Disable Next.js telemetry (1) |

## Post-Deploy Checklist
- [ ] Visit `/ar` - campaign loads, Intro shows
- [ ] Visit `/ar/campaign` - all 8 stages work
- [ ] Visit `/ar/admin/setup` - owner can claim
- [ ] Visit `/admin` - admin panel works
- [ ] Visit `/ar/channels` - channels room loads
- [ ] Visit `/ar/contact` - contact form works
- [ ] Check Console - no errors
- [ ] Mobile viewport - no horizontal overflow