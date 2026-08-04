import { describe, expect, test } from 'vitest';

import { serviceMenu } from './menu';
import { buildServiceMenuJsonLd } from './seo';

describe('service menu JSON-LD', () => {
	test('builds a localized offer catalog with all canonical services', () => {
		const jsonLd = buildServiceMenuJsonLd(serviceMenu, 'vi');

		expect(jsonLd).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'Service',
			serviceType: 'Dịch vụ nail và làm đẹp',
			provider: { '@id': 'https://shelf.beauty/#localbusiness' },
			hasOfferCatalog: {
				'@type': 'OfferCatalog',
				name: 'Dịch vụ và bảng giá'
			}
		});

		const catalogs = jsonLd.hasOfferCatalog.itemListElement;
		expect(catalogs).toHaveLength(7);
		expect(catalogs.flatMap(({ itemListElement }) => itemListElement)).toHaveLength(63);
		expect(catalogs[0]).toMatchObject({ '@type': 'OfferCatalog', name: 'Design móng' });
	});

	test('publishes exact fixed prices but does not flatten ranges or variants', () => {
		const jsonLd = buildServiceMenuJsonLd(serviceMenu, 'en');
		const offers = jsonLd.hasOfferCatalog.itemListElement.flatMap(
			({ itemListElement }) => itemListElement
		);

		expect(offers.find(({ identifier }) => identifier === 'gel-polish')).toMatchObject({
			'@type': 'Offer',
			identifier: 'gel-polish',
			price: 100_000,
			priceCurrency: 'VND',
			itemOffered: { '@type': 'Service', name: 'Gel polish' }
		});
		expect(offers.find(({ identifier }) => identifier === 'glitter-designs')).not.toHaveProperty(
			'price'
		);
		expect(
			offers.find(({ identifier }) => identifier === 'hand-feet-nurturing-mask')
		).not.toHaveProperty('price');
	});
});
