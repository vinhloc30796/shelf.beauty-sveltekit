import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

const appHtml = readFileSync('src/app.html', 'utf8');

describe('app document analytics tags', () => {
	test('configures Google Ads and Analytics from one global head tag', () => {
		expect(appHtml.match(/googletagmanager\.com\/gtag\/js/g)).toHaveLength(1);
		expect(appHtml).toContain(
			'<script async src="https://www.googletagmanager.com/gtag/js?id=AW-11464920859"></script>'
		);
		expect(appHtml).toContain("gtag('config', 'AW-11464920859');");
		expect(appHtml).toContain("gtag('config', 'G-XQ3RMF0HWH');");
		expect(appHtml.indexOf('googletagmanager.com/gtag/js')).toBeLessThan(
			appHtml.indexOf('%sveltekit.head%')
		);
	});
});
