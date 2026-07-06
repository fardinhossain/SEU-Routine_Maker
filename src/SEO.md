# SEU Routine Maker SEO instructions

Site: `https://seuroutine.vercel.app/`

Goal: help the site rank for searches such as:

- `seu routine maker`
- `seu routine`
- `seu class routine maker`
- `seu schedule maker`
- `Southeast University routine`

## Implemented technical SEO

- Use the Next.js App Router Metadata API in `app/layout.tsx` and route pages.
- Homepage title: `Build Your SEU Routine Within Seconds | SEU Routine Maker`.
- Add descriptive metadata, keywords, Open Graph data, Twitter card data, and canonical URLs.
- Add JSON-LD structured data in `app/page.tsx` using `WebSite`, `WebApplication`, and `Person`.
- Add `app/robots.ts` and `app/sitemap.ts`.
- Add `app/manifest.ts` for app name, icon, theme color, and install metadata.
- Keep clean routes such as `/`, `/about`, `/faq`, and `/organizer`.
- Avoid hash-only navigation for real pages.
- Use custom icons from `public/favicon.svg`, `public/favicon-192.png`, and `public/apple-touch-icon.png`.

## Post-deploy checklist

After every SEO-related deploy, verify these URLs are live:

- `https://seuroutine.vercel.app/`
- `https://seuroutine.vercel.app/sitemap.xml`
- `https://seuroutine.vercel.app/robots.txt`
- `https://seuroutine.vercel.app/manifest.webmanifest`
- `https://seuroutine.vercel.app/favicon.svg`
- `https://seuroutine.vercel.app/favicon-192.png`
- `https://seuroutine.vercel.app/7e4d2c0a9b8f4e6db1a3c5f0e2d9a718.txt`

## Google indexing

1. Open Google Search Console.
2. Add or verify `https://seuroutine.vercel.app/`.
3. Submit `https://seuroutine.vercel.app/sitemap.xml`.
4. Use URL Inspection for the homepage.
5. Click **Request indexing**.

Google can take days or weeks to refresh the title, favicon, site name, and ranking.

## Bing / Edge indexing

Edge search uses Bing.

1. Open Bing Webmaster Tools.
2. Add or import the site from Google Search Console.
3. Submit `https://seuroutine.vercel.app/sitemap.xml`.
4. After the IndexNow key file is live, run:

```bash
npm run submit:indexnow
```

Bing can still take hours or days to show the page after submission.

## iPhone search behavior

iPhone does not have one single search engine:

- Safari usually uses Google by default.
- Edge uses Bing by default.
- Chrome usually uses Google by default.

To check Safari's provider: `Settings → Safari → Search Engine`.

## Content guidance

- Keep the phrase `SEU Routine Maker` visible on the homepage.
- Keep `Southeast University` in descriptions and FAQ text.
- Prefer natural language over keyword stuffing.
- Add student-useful FAQ entries when real users ask repeated questions.
- Keep the About page clear that this is a student utility, not an official UMS replacement.
