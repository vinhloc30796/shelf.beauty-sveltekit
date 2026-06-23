import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

const robotsTxt = readFileSync('static/robots.txt', 'utf8');

describe('robots.txt', () => {
	test('advertises the sitemap endpoint', () => {
		expect(robotsTxt).toContain('Sitemap: https://shelf.beauty/sitemap.xml');
	});
});
