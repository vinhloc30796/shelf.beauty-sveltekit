import { describe, expect, test } from 'vitest';

import { serviceMenu } from './menu';
import { buildServiceMenuJsonLd } from './seo';

describe('service menu JSON-LD', () => {
	test('publishes whole-service fixed prices without flattening partial or variable prices', () => {
		const jsonLd = buildServiceMenuJsonLd(serviceMenu, 'en');
		const offers = jsonLd.hasOfferCatalog.itemListElement.flatMap(
			({ itemListElement }) => itemListElement
		);

		expect(offers.find(({ identifier }) => identifier === 'gel-polish')).toMatchObject({
			'@type': 'Offer',
			identifier: 'gel-polish',
			price: 100_000,
			priceCurrency: 'VND',
			itemOffered: { '@type': 'Service' }
		});
		expect(offers.find(({ identifier }) => identifier === 'glitter-designs')).not.toHaveProperty(
			'price'
		);
		expect(offers.find(({ identifier }) => identifier === 'sprinkling-stones')).not.toHaveProperty(
			'price'
		);
		expect(offers.find(({ identifier }) => identifier === 'mixed-color-gel')).not.toHaveProperty(
			'price'
		);
		expect(
			offers.find(({ identifier }) => identifier === 'hair-extension-shampoo-fee')
		).not.toHaveProperty('price');
		expect(
			offers.find(({ identifier }) => identifier === 'hand-feet-nurturing-mask')
		).not.toHaveProperty('price');
	});
});
