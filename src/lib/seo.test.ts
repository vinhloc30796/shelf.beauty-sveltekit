import { describe, expect, test } from 'vitest';

import {
	buildJsonLdScript,
	defaultSocialImage,
	localBusinessJsonLd,
	socialImages,
	toAbsoluteUrl
} from './seo';

describe('SEO URL helpers', () => {
	test('resolves the root path to the production origin with a trailing slash', () => {
		expect(toAbsoluteUrl('/')).toBe('https://shelf.beauty/');
	});

	test('resolves nested paths without duplicate slashes', () => {
		expect(toAbsoluteUrl('/reviews')).toBe('https://shelf.beauty/reviews');
		expect(toAbsoluteUrl('contact')).toBe('https://shelf.beauty/contact');
	});

	test('resolves static Open Graph images to the production origin', () => {
		expect(toAbsoluteUrl('/og/home.jpg')).toBe('https://shelf.beauty/og/home.jpg');
	});

	test('normalizes local preview asset URLs to the production origin', () => {
		expect(toAbsoluteUrl('http://localhost:4174/_app/immutable/assets/shelf.png')).toBe(
			'https://shelf.beauty/_app/immutable/assets/shelf.png'
		);
	});

	test('exposes an absolute default social image URL', () => {
		expect(defaultSocialImage).toBe('https://shelf.beauty/og/home.jpg');
	});

	test('exposes absolute page social image URLs', () => {
		expect(socialImages).toEqual({
			home: 'https://shelf.beauty/og/home.jpg',
			reviews: 'https://shelf.beauty/og/reviews.jpg',
			contact: 'https://shelf.beauty/og/contact.jpg'
		});
	});
});

describe('LocalBusiness JSON-LD', () => {
	test('describes Shelf as a BeautySalon with verified local business fields', () => {
		expect(localBusinessJsonLd).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'BeautySalon',
			'@id': 'https://shelf.beauty/#localbusiness',
			name: 'Shelf Beauty Studio',
			url: 'https://shelf.beauty/',
			image: 'https://shelf.beauty/og/home.jpg',
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
