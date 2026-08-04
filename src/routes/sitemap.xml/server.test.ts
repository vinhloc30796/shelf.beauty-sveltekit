import { describe, expect, test } from 'vitest';

describe('GET /sitemap.xml', () => {
	test('lists only indexable localized page routes as absolute URLs', async () => {
		const { GET } = await import('./+server');

		const response = await GET({} as never);
		const xml = await response.text();

		expect(response.headers.get('content-type')).toBe('application/xml');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain('<loc>https://www.shelf.beauty/vi</loc>');
		expect(xml).toContain('<loc>https://www.shelf.beauty/en</loc>');
		expect(xml).toContain('<loc>https://www.shelf.beauty/vi/reviews</loc>');
		expect(xml).toContain('<loc>https://www.shelf.beauty/en/reviews</loc>');
		expect(xml).toContain('<loc>https://www.shelf.beauty/vi/contact</loc>');
		expect(xml).toContain('<loc>https://www.shelf.beauty/en/contact</loc>');
		expect(xml).not.toContain('<loc>https://www.shelf.beauty/</loc>');
		expect(xml).not.toContain('<loc>https://www.shelf.beauty/reviews</loc>');
		expect(xml).not.toContain('<loc>https://www.shelf.beauty/contact</loc>');
		expect(xml).not.toContain('<loc>https://www.shelf.beauty/fbmessage</loc>');
		expect(xml).not.toContain('<loc>https://shelf.beauty');
		expect(xml).toContain('</urlset>');
	});
});
