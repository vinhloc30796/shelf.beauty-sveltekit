import { describe, expect, test } from 'vitest';

import { defineServiceMenu, formatMenuPrice, serviceMenu } from './menu';
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

describe('August 2026 canonical service menu', () => {
	test('contains every category and service from the August source menu', () => {
		expect(serviceMenu.sourceVersion).toBe('2026-08');
		expect(serviceMenu.currency).toBe('VND');
		expect(serviceMenu.categories.map(({ id, services }) => [id, services.length])).toEqual([
			['nail-design', 16],
			['general-nails', 11],
			['nail-extensions', 7],
			['eyelashes', 13],
			['shampooing', 6],
			['misc-services', 12]
		]);
		expect(serviceMenu.categories.flatMap(({ services }) => services)).toHaveLength(65);
	});

	test('preserves the audited bilingual labels and prices', () => {
		const services = serviceMenu.categories.flatMap(({ services }) => services);

		expect(services.find(({ id }) => id === 'cuticle-cleanup')).toMatchObject({
			name: { vi: 'Nhặt da sửa móng', en: 'Cleaning cuticles, fixing nail shapes' },
			price: { kind: 'fixed', amount: 40_000, unit: 'set' }
		});
		expect(services.find(({ id }) => id === 'nail-hardening')).toMatchObject({
			description: { vi: 'Tạo cầu +15.000₫', en: 'Nail apex +15,000₫' }
		});
		expect(services.find(({ id }) => id === 'nail-touch-up')).toMatchObject({
			name: { vi: 'Dặm che khuyết điểm', en: 'Nail touch-up to conceal blemishes' },
			price: { kind: 'fixed', amount: 50_000, unit: 'set' }
		});
		expect(services.find(({ id }) => id === 'gel-acrylic-extensions')).toMatchObject({
			price: { kind: 'range', min: 230_000, max: 270_000, unit: 'set' }
		});
		expect(services.find(({ id }) => id === 'baby-doll-eyelashes')).toMatchObject({
			name: { vi: 'Mi em bé', en: 'Baby Doll Eyelashes' },
			price: { kind: 'fixed', amount: 280_000 }
		});
		expect(services.find(({ id }) => id === 'korean-lash-lift-black-tinting')).toMatchObject({
			name: {
				vi: 'Uốn mi Hàn Quốc + phủ đen',
				en: 'Korean-Style Lash Lift + black tinting'
			},
			price: { kind: 'fixed', amount: 260_000 }
		});
		expect(services.find(({ id }) => id === 'normal-shampoo')).toMatchObject({
			price: { kind: 'fixed', amount: 65_000 }
		});
		expect(services.find(({ id }) => id === 'heel-scrub-cream')).toMatchObject({
			price: { kind: 'fixed', amount: 130_000 }
		});
		expect(services.find(({ id }) => id === 'shampoo-package-1')).toMatchObject({
			price: { kind: 'fixed', amount: 190_000 }
		});
		expect(services.find(({ id }) => id === 'hand-feet-nurturing-mask')).toMatchObject({
			price: {
				kind: 'variants',
				options: [
					{ label: { vi: 'Tay', en: 'Hands' }, amount: 40_000 },
					{ label: { vi: 'Chân', en: 'Feet' }, amount: 50_000 }
				]
			}
		});
		expect(services.find(({ id }) => id === 'shampoo-package-2')?.inclusions).toHaveLength(6);
	});
});
