import { describe, expect, test } from 'vitest';

import {
	buildHreflangAlternates,
	buildJsonLdScript,
	canonicalRedirectUrl,
	defaultSocialImage,
	localBusinessJsonLd,
	socialImages,
	toAbsoluteUrl
} from './seo';
import { getMessengerBookingUrl } from './messenger';

describe('SEO URL helpers', () => {
	test('resolves the root path to the production origin with a trailing slash', () => {
		expect(toAbsoluteUrl('/')).toBe('https://www.shelf.beauty/');
	});

	test('resolves nested paths without duplicate slashes', () => {
		expect(toAbsoluteUrl('/reviews')).toBe('https://www.shelf.beauty/reviews');
		expect(toAbsoluteUrl('contact')).toBe('https://www.shelf.beauty/contact');
	});

	test('resolves static Open Graph images to the production origin', () => {
		expect(toAbsoluteUrl('/og/home.jpg')).toBe('https://www.shelf.beauty/og/home.jpg');
	});

	test('normalizes local preview asset URLs to the production origin', () => {
		expect(toAbsoluteUrl('http://localhost:4174/_app/immutable/assets/shelf.png')).toBe(
			'https://www.shelf.beauty/_app/immutable/assets/shelf.png'
		);
	});

	test('normalizes legacy apex URLs to the canonical production origin', () => {
		expect(toAbsoluteUrl('https://shelf.beauty/en/reviews?source=legacy#guest-notes')).toBe(
			'https://www.shelf.beauty/en/reviews?source=legacy#guest-notes'
		);
	});

	test('keeps authority-like legacy paths on the canonical host', () => {
		expect(toAbsoluteUrl('https://shelf.beauty//evil.example/phish')).toBe(
			'https://www.shelf.beauty//evil.example/phish'
		);
	});

	test('leaves external absolute URLs unchanged', () => {
		expect(toAbsoluteUrl('https://m.me/shelfbeautystudio')).toBe('https://m.me/shelfbeautystudio');
	});

	test('exposes an absolute default social image URL', () => {
		expect(defaultSocialImage).toBe('https://www.shelf.beauty/og/home.jpg');
	});

	test('exposes absolute page social image URLs', () => {
		expect(socialImages).toEqual({
			home: 'https://www.shelf.beauty/og/home.jpg',
			reviews: 'https://www.shelf.beauty/og/reviews.jpg',
			contact: 'https://www.shelf.beauty/og/contact.jpg'
		});
	});

	test('builds absolute hreflang alternates for localized pages', () => {
		expect(buildHreflangAlternates('/en/reviews')).toEqual([
			{ hreflang: 'vi', href: 'https://www.shelf.beauty/vi/reviews' },
			{ hreflang: 'en', href: 'https://www.shelf.beauty/en/reviews' },
			{ hreflang: 'x-default', href: 'https://www.shelf.beauty/vi/reviews' }
		]);
	});
});

describe('canonical host redirects', () => {
	test('redirects the apex root directly to the Vietnamese www URL', () => {
		expect(canonicalRedirectUrl(new URL('https://shelf.beauty/?source=apex'))).toBe(
			'https://www.shelf.beauty/vi?source=apex'
		);
	});

	test('preserves the path and query when redirecting an apex URL', () => {
		expect(canonicalRedirectUrl(new URL('https://shelf.beauty/en/reviews?page=2'))).toBe(
			'https://www.shelf.beauty/en/reviews?page=2'
		);
	});

	test('keeps authority-like paths on the canonical host', () => {
		expect(canonicalRedirectUrl(new URL('https://shelf.beauty//evil.example/phish'))).toBe(
			'https://www.shelf.beauty//evil.example/phish'
		);
	});

	test('does not redirect canonical, preview, or local hosts', () => {
		expect(canonicalRedirectUrl(new URL('https://www.shelf.beauty/en'))).toBeNull();
		expect(canonicalRedirectUrl(new URL('https://shelf-beauty-git-main.vercel.app/en'))).toBeNull();
		expect(canonicalRedirectUrl(new URL('http://localhost:4174/en'))).toBeNull();
	});
});

describe('LocalBusiness JSON-LD', () => {
	test('describes Shelf as a BeautySalon with verified local business fields', () => {
		expect(localBusinessJsonLd).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'BeautySalon',
			'@id': 'https://www.shelf.beauty/#localbusiness',
			name: 'Shelf Beauty Studio',
			url: 'https://www.shelf.beauty/vi',
			image: 'https://www.shelf.beauty/og/home.jpg',
			address: {
				'@type': 'PostalAddress',
				streetAddress: '35 Yersin',
				addressLocality: 'Đà Lạt',
				addressRegion: 'Lâm Đồng',
				addressCountry: 'VN'
			},
			geo: {
				'@type': 'GeoCoordinates',
				latitude: 11.9415682,
				longitude: 108.451834
			}
		});
		expect(localBusinessJsonLd.sameAs).toEqual([
			'https://facebook.com/shelfbeautystudio',
			'https://instagram.com/shelfbeautystudio',
			'https://tiktok.com/@shelfbeautystudio'
		]);
		expect(localBusinessJsonLd.potentialAction.target.urlTemplate).toBe(
			getMessengerBookingUrl('vi')
		);
	});

	test('builds one parseable JSON-LD script tag', () => {
		const script = buildJsonLdScript(localBusinessJsonLd);
		const openingTag = '<script type="application/ld+json">';
		const closingTag = '</script>';

		expect(script.startsWith(openingTag)).toBe(true);
		expect(script.endsWith(closingTag)).toBe(true);
		expect(script.match(/<script type="application\/ld\+json">/g)).toHaveLength(1);
		expect(script.match(/<\/script>/g)).toHaveLength(1);

		const json = script.slice(openingTag.length, -closingTag.length);
		expect(JSON.parse(json)).toEqual(localBusinessJsonLd);
	});

	test('escapes less-than characters inside JSON-LD data', () => {
		const script = buildJsonLdScript({ name: '</script><script>alert("x")</script>' });

		expect(script).not.toContain('</script><script>');
		expect(script).toContain('\\u003c/script>');
		expect(script.match(/<\/script>/g)).toHaveLength(1);
	});
});
