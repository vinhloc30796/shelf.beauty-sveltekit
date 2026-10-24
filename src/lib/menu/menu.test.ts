import { describe, expect, test } from 'vitest';

import { defineServiceMenu, formatMenuPrice } from './menu';
import type { ServiceMenu } from './types';

const validMenu = (): ServiceMenu => ({
	sourceVersion: 'test',
	currency: 'VND',
	categories: [
		{
			id: 'nails',
			name: { vi: 'Móng', en: 'Nails' },
			services: [
				{
					id: 'gel-polish',
					name: { vi: 'Sơn gel', en: 'Gel polish' },
					price: { kind: 'fixed', amount: 100_000, unit: 'set' }
				}
			]
		}
	]
});

describe('service menu validation', () => {
	test('accepts the complete bilingual menu contract', () => {
		expect(defineServiceMenu(validMenu())).toEqual(validMenu());
	});

	test('rejects duplicate category and service identifiers', () => {
		const menu = validMenu();
		menu.categories.push({ ...menu.categories[0] });
		expect(() => defineServiceMenu(menu)).toThrow('Duplicate category id: nails');

		const duplicateServiceMenu = validMenu();
		duplicateServiceMenu.categories[0].services.push({
			...duplicateServiceMenu.categories[0].services[0]
		});
		expect(() => defineServiceMenu(duplicateServiceMenu)).toThrow(
			'Duplicate service id: gel-polish'
		);
	});

	test('rejects missing translations and empty categories', () => {
		const missingTranslation = validMenu();
		missingTranslation.categories[0].services[0].name.en = '';
		expect(() => defineServiceMenu(missingTranslation)).toThrow(
			'Missing en translation for service gel-polish'
		);

		const emptyCategory = validMenu();
		emptyCategory.categories[0].services = [];
		expect(() => defineServiceMenu(emptyCategory)).toThrow('Category nails has no services');
	});

	test('rejects non-positive amounts, reversed ranges, and malformed variants', () => {
		const invalidAmount = validMenu();
		invalidAmount.categories[0].services[0].price = { kind: 'fixed', amount: 0 };
		expect(() => defineServiceMenu(invalidAmount)).toThrow(
			'Service gel-polish has an invalid price amount'
		);

		const reversedRange = validMenu();
		reversedRange.categories[0].services[0].price = {
			kind: 'range',
			min: 50_000,
			max: 10_000
		};
		expect(() => defineServiceMenu(reversedRange)).toThrow(
			'Service gel-polish has an invalid price range'
		);

		const malformedVariants = validMenu();
		malformedVariants.categories[0].services[0].price = { kind: 'variants', options: [] };
		expect(() => defineServiceMenu(malformedVariants)).toThrow(
			'Service gel-polish has no price variants'
		);
	});
});

describe('service menu price formatting', () => {
	test('formats fixed and ranged VND prices in the route language', () => {
		expect(formatMenuPrice({ kind: 'fixed', amount: 100_000, unit: 'set' }, 'vi')).toBe(
			'100.000₫ / bộ'
		);
		expect(formatMenuPrice({ kind: 'fixed', amount: 100_000, unit: 'set' }, 'en')).toBe(
			'100,000₫ / set'
		);
		expect(formatMenuPrice({ kind: 'range', min: 15_000, max: 50_000, unit: 'finger' }, 'vi')).toBe(
			'15.000–50.000₫ / ngón'
		);
		expect(formatMenuPrice({ kind: 'range', min: 15_000, max: 50_000, unit: 'finger' }, 'en')).toBe(
			'15,000–50,000₫ / finger'
		);
	});

	test('formats add-ons and labeled price variants', () => {
		expect(
			formatMenuPrice(
				{ kind: 'range', min: 30_000, max: 50_000, modifier: 'add', unit: 'service' },
				'en'
			)
		).toBe('+30,000–50,000₫');
		expect(
			formatMenuPrice(
				{
					kind: 'variants',
					options: [
						{ label: { vi: 'Tay', en: 'Hands' }, amount: 40_000 },
						{ label: { vi: 'Chân', en: 'Feet' }, amount: 50_000 }
					]
				},
				'vi'
			)
		).toBe('Tay 40.000₫ · Chân 50.000₫');
	});
});
