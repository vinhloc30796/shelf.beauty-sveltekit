import { describe, expect, test } from 'vitest';

import { defaultSocialImage, toAbsoluteUrl } from './seo';

describe('SEO URL helpers', () => {
	test('resolves the root path to the production origin with a trailing slash', () => {
		expect(toAbsoluteUrl('/')).toBe('https://shelf.beauty/');
	});

	test('resolves nested paths without duplicate slashes', () => {
		expect(toAbsoluteUrl('/reviews')).toBe('https://shelf.beauty/reviews');
		expect(toAbsoluteUrl('contact')).toBe('https://shelf.beauty/contact');
	});

	test('normalizes local preview asset URLs to the production origin', () => {
		expect(toAbsoluteUrl('http://localhost:4174/_app/immutable/assets/shelf.png')).toBe(
			'https://shelf.beauty/_app/immutable/assets/shelf.png'
		);
	});

	test('exposes an absolute default social image URL', () => {
		expect(defaultSocialImage).toMatch(/^https:\/\/shelf\.beauty\/.+/);
	});
});
