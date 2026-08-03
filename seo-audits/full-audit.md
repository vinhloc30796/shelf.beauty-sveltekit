# Shelf Beauty Studio SEO Audit

Analyzed: 2026-07-29

Primary production host observed: `https://www.shelf.beauty`

Declared site origin: `https://shelf.beauty`

Business type: Local service, beauty salon

Scope: Source audit, local production build, live response checks, six localized pages, desktop/mobile browser checks

## Executive Summary

**SEO Health Score: 67/100**

The site has a sound small-business SEO foundation: server-rendered pages, unique bilingual metadata, reciprocal hreflang annotations, a valid sitemap, one H1 per page, descriptive photography, authentic Google reviews, and valid `BeautySalon` JSON-LD. No critical crawl or indexing block was found.

The largest technical issue is conflicting hostname signals. Production redirects the apex domain to `www`, while canonicals, hreflang, sitemap URLs, social metadata, and structured data all declare the apex domain. Content is also too shallow to compete well for non-brand service searches. Local business facts, service expertise, dark-mode accessibility, layout stability, and the Messenger booking bridge need improvement.

### Weighted Scores

| Category | Weight | Score | Weighted result |
|---|---:|---:|---:|
| Technical SEO | 22% | 70 | 15.40 |
| Content Quality | 23% | 56 | 12.88 |
| On-Page SEO | 20% | 70 | 14.00 |
| Schema / Structured Data | 10% | 72 | 7.20 |
| Performance / CWV | 10% | 80 | 8.00 |
| AI Search Readiness | 10% | 57 | 5.70 |
| Images | 5% | 81 | 4.05 |
| **Total** | **100%** |  | **67.23** |

Performance is an audit estimate supported by mobile lab checks, not a Lighthouse or CrUX score. INP was not measured.

### Top Priority Findings

1. **High: Canonical host conflicts with production redirects.** Every apex URL redirects to `www`, but generated SEO URLs use the apex host (`src/lib/seo.ts:3`; `src/lib/components/SeoHead.svelte:10-29`; `src/routes/sitemap.xml/+server.ts:15-23`; `static/robots.txt:4`). All six sitemap page URLs therefore redirect before returning `200`.
2. **High: Service and expertise content is too shallow.** Only home, reviews, and contact pages are indexable (`src/routes/sitemap.xml/+server.ts:5-17`). Nail care, hair washing, pricing, process, hygiene, team expertise, policies, and service suitability lack useful first-party detail.
3. **High: Public business facts are incomplete for local and AI search.** Schema omits verified opening hours, telephone, postal code, price range, and service offers (`src/lib/seo.ts:43-79`). Opening hours initially render as loading text and arrive in deferred scripts (`src/routes/[lang=lang]/+page.svelte:238-270`).
4. **High: Dark-mode text and controls have contrast failures.** Measured examples ranged from approximately `2.90:1` to `4.17:1`, below the `4.5:1` target for normal text. The primary dark tokens are at `src/app.css:55-62`.
5. **High: The site-wide Messenger bridge is fragile and indexable.** `/fbmessage` returns `200`, has no metadata or `noindex`, and depends on `window.gtag` before redirecting (`src/routes/fbmessage/+page.svelte:1-27`). Localized language-switch links from that page lead to `404`s.
6. **High: Mobile relevance and CLS need attention.** On the homepage, the full hero precedes the H1 and booking actions on mobile (`src/routes/[lang=lang]/+page.svelte:127-130`, `197-209`). Undimensioned landscape logos produced observed CLS as high as `0.0956` (`src/routes/[lang=lang]/+page.svelte:130-135`; reviews `160-165`; contact `86-91`).

### Quick Wins

- Align `siteOrigin`, redirects, sitemap, robots, schema, social images, and tests to one primary hostname.
- Replace `/fbmessage` with a server redirect or direct localized Messenger links; keep analytics as progressive enhancement.
- Add intrinsic dimensions or an aspect ratio to page logos.
- Correct dark-mode color tokens and low-opacity text combinations.
- Add verified opening hours and contact details to visible HTML and matching JSON-LD.
- Add contextual links among home, reviews, contact, and booking.
- Localize English booking prompts, weekday labels, and address wording.

## Crawlability And Indexability

### Strengths

- `robots.txt` permits crawling and declares a sitemap (`static/robots.txt:2-4`).
- The sitemap returns valid XML with six unique localized page URLs (`src/routes/sitemap.xml/+server.ts:5-29`).
- `/`, `/reviews`, and `/contact` use permanent `308` redirects to Vietnamese equivalents (`src/routes/+page.server.ts:3-5`; `src/routes/reviews/+page.server.ts`; `src/routes/contact/+page.server.ts:3-5`).
- All six localized pages returned `200` on the `www` host during the audit.
- Unsupported routes return actual `404`s.
- Titles, descriptions, canonical links, hreflang, H1s, image alt text, and JSON-LD are present in initial SSR HTML.

### Findings

#### High: Primary Host Conflict

Live behavior on 2026-07-29:

- `https://shelf.beauty/vi` returned `308` to `https://www.shelf.beauty/vi`.
- `https://www.shelf.beauty/vi` returned `200` but declared `https://shelf.beauty/vi` as canonical.
- The sitemap is served from `www`, but every `<loc>` uses the apex host and redirects.
- The same apex origin feeds hreflang, Open Graph images, and the LocalBusiness entity ID.

This is contradictory rather than catastrophic, but it wastes crawl requests and weakens canonical consolidation. Choose one host and make every signal agree. Given current Vercel behavior, changing generated URLs to `https://www.shelf.beauty` is the smallest application-side change unless the apex redirect is intentionally reversed at deployment level.

#### Medium: Indexable Utility Route

`/fbmessage` returns an empty `200` response with no title, description, canonical, H1, or robots directive (`src/routes/fbmessage/+page.svelte:1-27`). It is linked from every page (`src/routes/+layout.svelte:33-44`). A server redirect is preferable to relying on client analytics.

#### Medium: Security Header Coverage

Live responses included HSTS but did not include CSP, `X-Content-Type-Options`, `Referrer-Policy`, frame restrictions, or `Permissions-Policy`. This is primarily security hardening, not a direct ranking factor. The inline analytics and theme scripts require nonce/hash planning before adding CSP (`src/app.html:8-18`).

#### Low: Dependency Compatibility Warnings

The Node 24 production build completed, but Rollup reported that `untrack`, `fork`, and `settled` are not exported by installed Svelte `4.2.20` for installed SvelteKit `2.65.1`. `pnpm check` remains clean. This is not currently an SEO defect, but dependency alignment should be addressed before it causes hydration or deployment regressions.

## International SEO

### Strengths

- `html lang` is replaced server-side based on the route (`src/app.html:2`; `src/hooks.server.ts:5-10`).
- Each localized page has reciprocal `vi`, `en`, and `x-default` alternates (`src/lib/seo.ts:24-32`).
- Canonicals are self-referential by language route, apart from the hostname conflict.
- Language navigation uses crawlable links (`src/routes/Header.svelte:66-83`, `118-131`).

### Findings

- English users receive a Vietnamese Messenger prefilled message (`src/routes/[lang=lang]/+page.svelte:25`; contact `:19`; schema `src/lib/seo.ts:72-77`).
- Weekday labels are always formatted in Vietnamese with English abbreviations (`src/routes/[lang=lang]/+page.server.ts:96-125`).
- English contact content retains `phuong 10` rather than consistently localized wording (`src/routes/[lang=lang]/contact/+page.svelte:39-44`).
- Mixed-language reviews have no per-review `lang` annotation (`src/routes/[lang=lang]/reviews/+page.svelte:191-227`).

## Content Quality And E-E-A-T

**Score: 56/100**

### Strengths

- Original studio photography and a concrete Da Lat location provide first-hand experience signals.
- Reviews are server-rendered, dated, and backed by Google Business Profile data with credible fallbacks (`src/routes/[lang=lang]/reviews/+page.server.ts:4-64`).
- Address, directions, map, opening hours, and active social profiles support trust.
- Copy is unique by locale and page purpose.

### Findings

#### High: Insufficient Service Depth

The homepage introduces nail care, hair washing, and beauty appointments in one short passage (`src/routes/[lang=lang]/+page.svelte:27-83`). There are no pages or substantial sections answering common service decisions: what is included, prices or ranges, duration, nail art options, products, hygiene, removal, aftercare, appointment requirements, accessibility, or who performs the services.

Add substantial bilingual service content based on verified operations. Create dedicated pages only where each page can be genuinely useful and unique; do not generate thin city/service doorway pages.

#### High: Expertise And Transparency Gaps

No staff names, experience, credentials, hygiene practices, policies, guarantees, direct contact details, or pricing guidance are visible. An authentic About/Studio section should establish who provides the service and how quality and safety are maintained.

#### Medium: Route-Level Thin Content

- Home is strong for branded/location intent but thin for service comparison.
- Contact is useful but has little content beyond directions, booking guidance, map, and social links.
- Reviews has better first-hand depth, but English users may receive mostly Vietnamese quotations without disclosed translations or language labels.

## On-Page SEO And SXO

**Score: 70/100**

### Strengths

- Every intended page has one descriptive H1 and unique title/description.
- Primary actions are clear on home and contact.
- Header navigation keeps every localized page within one click of every other page.
- Image alt text is descriptive and localized.

### Findings

- Review page titles and H1s underuse direct local intent terms such as "Shelf Beauty Studio reviews in Da Lat" (`src/routes/[lang=lang]/reviews/+page.svelte:27-31`, `45-49`).
- Contact H1s emphasize proximity but not the business category (`src/routes/[lang=lang]/contact/+page.svelte:22-53`).
- Internal linking is navigational rather than contextual. Body copy does not connect services, proof, location, and booking journeys.
- On mobile, the homepage image pushes the H1 and booking actions below the initial viewport.
- Review pages emphasize an outbound Google link but lack a strong direct booking action.
- Meta descriptions are unique and accurate but generally short, approximately 70-124 characters.

## Schema And Structured Data

**Score: 72/100**

### Strengths

- `BeautySalon` is an appropriate subtype and has a stable `@id` (`src/lib/seo.ts:43-47`).
- Required business name and postal address are present.
- Precise coordinates, map URL, official profiles, and a booking action support entity reconciliation.
- JSON-LD is server-delivered, safely escaped, and parsed successfully in live HTML (`src/lib/seo.ts:81-82`).
- The site correctly avoids self-serving review/aggregate-rating markup, deprecated HowTo markup, and commercial FAQ rich-result markup.

### Findings

- Add verified `openingHoursSpecification`, `telephone` if public, `postalCode`, `priceRange`, `logo`, and service offers when those values can match visible content and GBP.
- Visible addresses include `phuong 10`, while schema only uses `35 Yersin`; verify and normalize the official address.
- The same English business description and `/vi` entity URL are emitted on both language homepages.
- Contact and review pages have no connected `WebPage` or `ContactPage` graph nodes.
- A `WebSite` node can help explicit site-name understanding, but Google prefers it on the domain root. The current root redirects, so this should be designed rather than duplicated arbitrarily on locale routes.

## Local SEO

**Supplemental score: 68/100**

Strong local signals include business category, address, coordinates, directions, embedded map, current GBP hours, Google reviews, and social identities. Gaps are incomplete NAP, absent service details, limited first-party expertise, and no repository evidence for citation consistency, review responses, or GBP category/settings quality.

The live review page showed a `4.8` rating from `361` reviews during the audit. No ranking conclusion is inferred from that point-in-time value.

## Performance And Core Web Vitals

**Score: 80/100**

Mobile lab checks used Chromium at `390x844`, 4x CPU slowdown, 150 ms latency, and approximately 1.6 Mbps download. These are synthetic observations, not 75th-percentile field data.

| Route | FCP | LCP | Observed CLS range |
|---|---:|---:|---:|
| `/vi` | 1.00 s | 1.99 s | 0.0001-0.0322 |
| `/vi/reviews` | 0.83 s | 1.99 s | 0.0001-0.0956 |
| `/vi/contact` | 1.00 s | 1.00 s | 0.0001-0.0950 |

### Strengths

- No horizontal overflow was observed at 390 px.
- Home gives its LCP image eager loading and high priority (`src/routes/[lang=lang]/+page.svelte:199-206`).
- Below-fold photography and the map use lazy loading.
- Hashed production assets are cacheable.
- Reduced-motion handling is present (`src/app.css:109-117`).

### Findings

- Undimensioned landscape logos can shift the H1 by 112-128 px during loading.
- Header renders both light and dark PNG logos, downloading approximately 131 KB while displaying only one (`src/routes/Header.svelte:40-43`, `108-110`).
- Google Analytics/Ads, Vercel Analytics, and Speed Insights increase startup main-thread work (`src/app.html:8-18`; `src/routes/+layout.svelte:2-8`).
- Startup long tasks reached approximately 244-254 ms under throttling. This is an INP risk, not an INP measurement.
- INP and field CWV are unavailable because Google API/CrUX credentials were not configured and PageSpeed requests were rate-limited.

## Visual And Accessibility Review

**Supplemental score: 74/100**

Desktop and mobile layouts are responsive and visually coherent. Captures are stored in `screenshots/`.

### Findings

- Dark-mode color combinations fail WCAG AA for several normal-text uses.
- Homepage booking actions appear below the first mobile viewport because the hero is ordered first.
- The mobile sheet close control is approximately `16x16`, below the WCAG 2.5.8 minimum target size (`src/lib/components/ui/sheet/sheet-content.svelte:40-45`).
- No skip link bypasses repeated navigation (`src/routes/+layout.svelte:26-31`).

## Image SEO

**Score: 81/100**

### Strengths

- `@sveltejs/enhanced-img` generates AVIF/WebP/JPEG sources with intrinsic dimensions and responsive candidates (`vite.config.ts:2-6`).
- Photo alt text is descriptive and localized.
- Hero payloads were efficient in mobile lab checks.

### Findings

- Page logos need intrinsic dimensions or an aspect ratio.
- Both header theme logos download even when one is hidden.
- Numeric source names such as `1.jpg`, `4.jpg`, and `7.jpg` provide weak image-search context.
- The reviews LCP image is eager but lacks `fetchpriority="high"` (`src/routes/[lang=lang]/reviews/+page.svelte:173-180`).

## AI Search Readiness

**Score: 57/100**

### Strengths

- Important content is SSR and crawlable without client rendering.
- Robots policy permits search and AI crawlers.
- Business identity, location, reviews, and core category are stated consistently in visible content.
- Short, direct page sections are structurally extractable.

### Findings

- First-party answers about services, prices, duration, policies, team expertise, hygiene, and suitability are missing.
- Deferred hours are less accessible to non-rendering crawlers than visible SSR content and matching schema.
- Mixed-language reviews lack language annotations.
- No About or service pages establish stronger expertise and authority signals.
- `llms.txt` is absent, but this is not a Google SEO defect and is lower priority than improving crawlable HTML.

## Build And Test Evidence

- `pnpm build` under Node `24.18.0`: passed with Svelte/SvelteKit export compatibility warnings and an optional `encoding` warning from `node-fetch`.
- `pnpm check` under Node `24.18.0`: passed, 0 errors and 0 warnings.
- `pnpm test:unit --run` under Node `24.18.0`: passed, 8 files and 26 tests.
- Local production preview: expected root `308`; localized pages returned `200`.
- Live checks: apex-to-`www` redirect confirmed; six sitemap page URLs and primary metadata inspected.

## Data Limitations

- No Google API credentials were configured for Search Console, CrUX, PageSpeed, URL Inspection, or GA4.
- No Moz or Bing backlink credentials were configured. Common Crawl was available, but backlink authority was not scored because no reliable complete profile was produced.
- No prior SEO drift baseline existed.
- No live keyword volume, rankings, SERP intent, GBP configuration, citation consistency, or competitor data was available.
- INP was not measured. Synthetic click timing and long tasks are not substitutes for field INP.
- Screenshots are point-in-time captures; lazy assets can remain blank in a full-page capture until scrolled into view.

## Screenshot Inventory

- `screenshots/home-desktop.png`
- `screenshots/home-mobile.png`
- `screenshots/reviews-desktop.png`
- `screenshots/reviews-mobile.png`
- `screenshots/contact-desktop.png`
- `screenshots/contact-mobile.png`
