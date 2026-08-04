# Shelf Beauty Studio SEO Action Plan

Based on the 2026-08-04 audit refresh. Progress last updated **2026-08-05**. The current weighted health score remains **68/100** until the next audit rerun. No critical crawl or indexing block was found.

## Progress Update: 2026-08-05

- **Completed high-priority action 1:** [PR #33](https://github.com/vinhloc30796/shelf.beauty-sveltekit/pull/33) made `https://www.shelf.beauty` the single SEO origin and added one-hop apex redirects.
- Assigned both `shelf.beauty` and `www.shelf.beauty` to the Vercel Production environment and updated their recommended DNS records.
- Live validation confirmed that the apex root redirects directly to `/vi`, all six sitemap URLs return direct `200` responses, and each declares a matching self-referential canonical.
- **Next:** high-priority action 2, replacing `/fbmessage` and making analytics non-blocking.

## High Priority: Complete Within One Week

| Order | Status | Action | Why | Effort | Validation |
|---:|---|---|---|---:|---|
| 1 | **Complete — 2026-08-05** | Select one primary host and align redirects, `siteOrigin`, canonical, hreflang, sitemap, robots, schema, social images, and tests. | Production forces `www`, while all SEO signals declare the apex host. | 0.5-1 day | Every sitemap URL returns direct `200`; canonical and hreflang hosts match the final URL. |
| 2 | Open | Replace `/fbmessage` with a server redirect or direct localized Messenger links. Make analytics non-blocking. | The current empty `200` route is indexable and fails when `gtag` is unavailable. | 0.5 day | `/fbmessage` returns a redirect; no localized `/vi/fbmessage` or `/en/fbmessage` links are generated. |
| 3 | Open | Add intrinsic dimensions/aspect ratio to page logos and serve one optimized header logo per theme. | Reduces observed CLS and unnecessary image transfer. | 0.5-1 day | Repeated mobile runs stay comfortably below CLS `0.1`; only the required theme logo downloads. |
| 4 | Open | Correct dark-mode contrast and low-opacity text combinations. | Several normal-text combinations measured below WCAG AA `4.5:1`. | 0.5-1 day | Automated and manual contrast checks pass in light and dark themes. |
| 5 | Open | Publish verified business facts in visible HTML and schema. | Local and AI crawlers need consistent hours, address, contact, price range, and service details. | 1-2 days | Rich Results/Schema validator passes; visible facts match GBP exactly. |
| 6 | Open | Move or summarize the homepage value proposition and booking CTA above the mobile hero. | The primary intent and action begin below the first mobile viewport. | 0.5 day | At 390x844, business category, H1, and booking action are visible before or alongside the hero. |

For action 5, do not invent a telephone number, postal code, prices, hours, or credentials. Add only facts verified with the business owner and Google Business Profile.

## Medium Priority: Complete Within One Month

### Service And Expertise Content

- Add substantial bilingual content for verified core services such as nail care and hair washing.
- Include useful facts: what is included, duration, price or price range, appointment process, products, hygiene, removal/aftercare, and suitability.
- Add an authentic About/Studio section with staff experience, quality practices, accessibility, and booking/cancellation policy.
- Create dedicated service pages only when each can provide unique, first-hand value. Avoid scaled city/service doorway pages.

### On-Page And Conversion

- Add direct local-service wording to reviews and contact titles/H1s without keyword stuffing.
- Add contextual body links: home to reviews/contact, reviews to booking, contact to services, and service sections to proof and booking.
- Add a prominent booking CTA to reviews pages.
- Localize English booking prompts, weekdays, and address terminology.
- Preserve original review text but add reliable per-review language annotations and disclosed translations where useful.

### Structured Data

- Add verified `openingHoursSpecification`, `telephone` if public, `postalCode`, `priceRange`, `logo`, and visible service offers.
- Keep GBP, visible content, and JSON-LD synchronized.
- Evolve to a connected graph using the existing `#localbusiness` ID and localized `WebPage`/`ContactPage` nodes.
- Evaluate `WebSite` site-name markup only after deciding how the redirecting domain root should behave.
- Do not add self-serving aggregate rating markup, HowTo markup, or commercial FAQ markup for Google rich-result benefit.

### Performance And Platform

- Audit whether Google Ads/Analytics, Vercel Analytics, and Speed Insights all need immediate startup execution.
- Add `fetchpriority="high"` to the reviews LCP image only after confirming it remains the LCP element.
- Align SvelteKit and Svelte versions to remove build-time missing-export warnings; rerun build, checks, and browser tests.
- Add security headers, introducing CSP only after planning nonces/hashes for inline and third-party scripts.

## Low Priority: Backlog

- Rename source photography descriptively before future asset revisions.
- Add a skip-to-content link.
- Increase the mobile sheet close target to at least `24x24` CSS pixels.
- Consider `llms.txt` only as optional third-party documentation after first-party content is complete.
- Establish an SEO drift baseline after hostname and metadata fixes are deployed.

## Measurement Plan

1. Configure Search Console and submit the corrected sitemap.
2. **Complete (2026-08-05):** Inspected every sitemap URL across route types and languages after deployment; all returned direct `200` responses with matching canonicals.
3. Record 28-day GSC baselines for clicks, impressions, CTR, and query/page coverage.
4. Collect CrUX or PageSpeed field data for LCP, INP, and CLS; do not substitute lab interaction timing for INP.
5. Track booking and direction conversions by locale without making navigation depend on analytics callbacks.
6. Re-run the audit after the high-priority changes and compare the weighted category scores.

## Release Checklist

- [x] Final URL, canonical, hreflang, Open Graph URL, JSON-LD URL, robots sitemap, and sitemap `<loc>` use one host.
- [x] Every sitemap URL returns direct `200` and a self-referential canonical.
- [ ] `/fbmessage` is no longer an indexable empty page.
- [ ] English and Vietnamese booking paths use appropriate language.
- [ ] Visible business facts match JSON-LD and GBP.
- [ ] One H1 remains on every indexable route.
- [ ] Mobile dark-mode contrast passes.
- [ ] Mobile CLS remains below `0.1`, with a target of `0.05` or better in lab checks.
- [ ] `pnpm check`, unit tests, production build, and Playwright integration tests pass under Node 24.
