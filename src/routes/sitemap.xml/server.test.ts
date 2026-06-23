import { describe, expect, test } from 'vitest';

describe('GET /sitemap.xml', () => {
	test('lists indexable static page routes as absolute URLs', async () => {
		const { GET } = await import('./+server');

		const response = await GET({} as never);
		const xml = await response.text();

		expect(response.headers.get('content-type')).toBe('application/xml');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain('<loc>https://shelf.beauty/</loc>');
		expect(xml).toContain('<loc>https://shelf.beauty/reviews</loc>');
		expect(xml).toContain('<loc>https://shelf.beauty/contact</loc>');
		expect(xml).not.toContain('<loc>https://shelf.beauty/fbmessage</loc>');
		expect(xml).toContain('</urlset>');
	});
});
