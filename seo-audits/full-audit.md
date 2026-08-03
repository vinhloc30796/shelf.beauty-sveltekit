# Shelf Beauty Studio SEO Audit

Analyzed: 2026-08-04

Scope: current source, Node 24 production build, rendered local production HTML, six localized indexable routes, live production redirects/crawl files, and specialist reviews for technical SEO, content, schema, GEO, and images.

## Executive summary

**SEO health score: 68/100**

The project has a sound small-site technical base: important content and metadata are server-rendered, localized routes are explicit, titles and descriptions are unique, hreflang is reciprocal, the sitemap contains only intended localized pages, and the homepage emits valid-looking `BeautySalon` JSON-LD. The strongest constraint is not crawlability; it is contradictory hostname signaling and insufficient first-party service content.

No critical robots, sitemap, or route-level indexing block was found. Two high-priority defects remain reproducible in current source and production: production resolves on `www`, while all generated SEO URLs declare the apex host; and `/fbmessage` is an empty indexable `200` route whose redirect depends on client analytics.

## Weighted scores

| Category | Weight | Score | Weighted result |
|---|---:|---:|---:|
| Technical SEO | 22% | 72 | 15.84 |
| Content quality | 23% | 56 | 12.88 |
| On-page SEO | 20% | 70 | 14.00 |
| Schema / structured data | 10% | 72 | 7.20 |
| Performance / CWV readiness | 10% | 79 | 7.90 |
| AI search readiness | 10% | 57 | 5.70 |
| Images | 5% | 81 | 4.05 |
| **Total** | **100%** |  | **67.57 → 68** |

Performance is a source/build estimate, not a current Lighthouse or CrUX field score. INP was not measured.

## Priority findings

### High — align the canonical hostname

Current production behavior was rechecked on 2026-08-04:

- `https://shelf.beauty/` returns `308` to `https://www.shelf.beauty/`.
- `https://www.shelf.beauty/` returns another `308` to `/vi`.
- Canonical, hreflang, Open Graph URLs, JSON-LD IDs, robots sitemap URL, and every sitemap `<loc>` use `https://shelf.beauty`.

Evidence: `src/lib/seo.ts:3`, `src/lib/components/SeoHead.svelte:10-29`, `src/routes/sitemap.xml/+server.ts:21`, `static/robots.txt:4`.

Choose one final host and make deployment redirects, application metadata, schema, sitemap, robots, conversion URLs, and tests agree. With current Vercel behavior, changing generated signals to `https://www.shelf.beauty` is the smallest code-side correction. Also redirect apex `/` directly to the final `/vi` URL to avoid a two-hop chain.

### High — replace the indexable Messenger bridge

`/fbmessage` returns an HTML `200` with no title, description, canonical, H1, or `noindex`. Navigation waits for a `window.gtag` callback, and the route is linked site-wide from the footer.

Evidence: `src/routes/fbmessage/+page.svelte:1-27`, `src/routes/+layout.svelte:33-44`.

Prefer direct Messenger links with analytics as progressive enhancement. If the bridge must remain, implement a server redirect and send `X-Robots-Tag: noindex, nofollow`.

### High — build service-discovery content

The sitemap and navigation expose only home, reviews, and contact. Nail care, hair washing, and beauty care receive only brief homepage mentions. There is no useful first-party detail about service inclusions, duration, price/range, process, products, hygiene, suitability, removal/aftercare, or booking policies.

Evidence: `src/routes/sitemap.xml/+server.ts:5-17`, `src/routes/Header.svelte:18-22`, `src/routes/[lang=lang]/+page.svelte:27-83`.

Create a bilingual service hub and only those service pages that can provide substantial verified content. Add contextual links from homepage service summaries to proof, location, and booking. Avoid thin city/service variants.

### High — strengthen local facts and E-E-A-T

The site provides an address, map, reviews, dynamic hours, and social identities, but no public phone/email, pricing guidance, named staff, credentials, service process, hygiene practices, accessibility information, payment methods, or booking/cancellation terms. JSON-LD omits `telephone`, `openingHoursSpecification`, `priceRange`, and a visible service catalog.

Evidence: `src/lib/seo.ts:43-79`, `src/routes/[lang=lang]/+page.svelte:167-270`.

Add only owner-verified facts, show them in visible HTML, and then mirror them in a connected schema graph. Do not add self-serving aggregate rating markup for imported Google reviews.

### Medium — remove dependency compatibility warnings

The Node 24 production build succeeds, but Rollup reports that installed SvelteKit `2.65.1` imports `untrack`, `fork`, and `settled`, which installed Svelte `4.2.20` does not export. Static checks pass, but this is a hydration/regression risk.

Align Svelte, SvelteKit, the Svelte Vite plugin, and adapter versions; then rerun build and browser interaction tests.

### Medium — reduce latency and layout-shift risks

- The reviews route blocks SSR on an external Google API request and has no explicit short timeout (`src/routes/[lang=lang]/reviews/+page.server.ts:47-64`). A local fallback request completed in about 0.85 s, but cold/upstream latency remains uncontrolled.
- Landscape page logos lack intrinsic dimensions or an aspect ratio (`src/routes/[lang=lang]/+page.svelte:131-135`; reviews `:161-165`; contact `:87-91`).
- The header emits both light and dark PNG logos while displaying one (`src/routes/Header.svelte:40-43`, `108-110`).
- Google Tag Manager, Vercel Analytics, and Speed Insights all load globally (`src/app.html:8-18`; `src/routes/+layout.svelte:2-8`).

Add a short upstream timeout and durable cache for reviews, dimension branding assets, serve an appropriately sized logo, and measure whether all analytics must initialize during startup.

### Medium — improve page targeting and internal journeys

- Reviews titles/H1s underuse direct local intent such as reviews in Da Lat.
- Contact H1s emphasize proximity rather than the salon category.
- Body-level internal linking is nearly absent; primary page journeys mostly point to external Messenger, Maps, or Google reviews.
- Reviews lacks a semantic H2 and a direct booking CTA.
- English Messenger prompts and weekday labels remain partly Vietnamese.

Evidence: `src/routes/[lang=lang]/reviews/+page.svelte:27-60,152-170,271-285`; `src/routes/[lang=lang]/contact/+page.svelte:22-53`; `src/routes/[lang=lang]/+page.server.ts:96-125`.

## Strengths to preserve

- Server-rendered titles, descriptions, canonicals, hreflang, page copy, initial reviews, and homepage JSON-LD.
- Unique localized metadata and one H1 on every intended indexable page.
- Permanent redirects from legacy `/`, `/reviews`, and `/contact` routes.
- A valid permissive robots file and a focused six-URL sitemap.
- Descriptive localized alt text and responsive AVIF/WebP/JPEG output from `enhanced:img`.
- Original studio photography, a concrete address/map, and authentic Google review content.
- Valid `BeautySalon` entity type with address, geo, map, social profiles, and reservation action.

## Verification evidence

- `pnpm check` under Node 24: passed, 0 errors and 0 warnings.
- Unit tests: 8 files and 26 tests passed.
- Production build: passed with Svelte/SvelteKit compatibility warnings and an optional `node-fetch` dependency warning.
- Local production SSR: `/` returned `308`; localized routes, `/fbmessage`, sitemap, and robots returned expected `200` responses.
- Rendered localized pages contained correct `html lang`, unique title/description, self-path canonical, reciprocal `vi`/`en`/`x-default`, Open Graph metadata, and one H1.
- Live production: apex-to-`www` redirect and apex sitemap URLs were reconfirmed.
- Playwright integration suite was not rerun because its configured port `4174` was already occupied; existing browser artifacts were preserved.

## Recommended sequence

1. Align the final hostname and remove the two-hop homepage redirect.
2. Replace or `noindex` the Messenger bridge.
3. Publish verified service, price/range, process, team, policy, and contact facts in both languages.
4. Synchronize visible facts, GBP, and richer LocalBusiness/Service schema.
5. Fix dependency alignment, logo dimensions, and review API timeout/caching.
6. Retarget reviews/contact headings, add contextual internal links, and localize remaining mixed-language UI.
7. Configure Search Console and field CWV measurement, then rerun the audit after deployment.

## Limitations

No Search Console, URL Inspection, CrUX, PageSpeed, GA4, Moz, Bing backlink, live keyword-volume, ranking, citation-consistency, or competitor dataset was available. The score therefore measures implementation readiness and source/live-response evidence, not organic visibility or market authority.
