import { describe, expect, test } from 'vitest';

import { defaultSocialImage, socialImages, toAbsoluteUrl } from './seo';

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
