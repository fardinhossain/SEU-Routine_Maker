You are an expert Next.js / React + Vercel SEO specialist. Our site is https://seuroutine.vercel.app/ — a SEU Routine Maker (class/course schedule/routine builder for students, likely Southeast University or similar).
Goal: Make the site rank in the top positions for searches like "seu routine maker", "seu routine", "seu class routine maker", "seu schedule maker", etc.
Tasks (implement all of these):

Metadata & SEO Basics (App Router preferred):
Use Next.js Metadata API (or generateMetadata) for dynamic titles, descriptions, keywords, and Open Graph / Twitter cards.
Homepage title: "SEU Routine Maker - Create Your Class Schedule Easily | SEU Students"
Meta description: Something compelling like "Free SEU Routine Maker. Build clash-free class schedules, save and share your SEU semester routine in seconds. Perfect for Southeast University students."
Add relevant keywords naturally.
Implement proper Open Graph images (generate at least one good OG image).

Technical SEO:
Create /app/robots.ts (or public/robots.txt) allowing full crawling.
Create /app/sitemap.ts that includes at least the homepage and any other important routes. Make it dynamic if possible.
Ensure clean, semantic URLs (no hash routing).
Add structured data (JSON-LD) — use SoftwareApplication or WebApplication schema for the routine maker tool.

Performance & Rendering:
Switch to Server-Side Rendering (SSR) or Static Generation (SSG/ISR) wherever possible instead of pure client-side rendering. Search engines must see full HTML content immediately.