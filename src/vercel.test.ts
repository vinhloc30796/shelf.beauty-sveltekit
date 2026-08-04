import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

describe('Vercel canonical host redirects', () => {
	test('redirects apex requests before filesystem routing', () => {
		const configPath = 'vercel.json';
		expect(existsSync(configPath), 'vercel.json must define edge redirects').toBe(true);
		if (!existsSync(configPath)) return;

		const config = JSON.parse(readFileSync(configPath, 'utf8'));
		expect(config.redirects).toEqual([
			{
				source: '/',
				has: [{ type: 'host', value: 'shelf.beauty' }],
				destination: 'https://www.shelf.beauty/vi',
				permanent: true
			},
			{
				source: '/:path*',
				has: [{ type: 'host', value: 'shelf.beauty' }],
				destination: 'https://www.shelf.beauty/:path*',
				permanent: true
			}
		]);
	});
});
