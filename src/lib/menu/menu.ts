import type { Language } from '$lib/i18n';

import type { LocalizedText, MenuPrice, ServiceMenu } from './types';

const unitLabels = {
	service: { vi: '', en: '' },
	set: { vi: 'bộ', en: 'set' },
	finger: { vi: 'ngón', en: 'finger' },
	piece: { vi: 'chiếc', en: 'piece' },
	color: { vi: 'màu', en: 'color' }
} as const;

const assertTranslation = (value: LocalizedText, subject: string) => {
	for (const language of ['vi', 'en'] as const) {
		if (!value[language].trim()) {
			throw new Error(`Missing ${language} translation for ${subject}`);
		}
	}
};

const assertPositiveAmount = (amount: number, message: string) => {
	if (!Number.isInteger(amount) || amount <= 0) throw new Error(message);
};

export const defineServiceMenu = (menu: ServiceMenu): ServiceMenu => {
	const categoryIds = new Set<string>();
	const serviceIds = new Set<string>();

	for (const category of menu.categories) {
		if (categoryIds.has(category.id)) throw new Error(`Duplicate category id: ${category.id}`);
		categoryIds.add(category.id);
		assertTranslation(category.name, `category ${category.id}`);
		if (!category.services.length) throw new Error(`Category ${category.id} has no services`);

		for (const service of category.services) {
			if (serviceIds.has(service.id)) throw new Error(`Duplicate service id: ${service.id}`);
			serviceIds.add(service.id);
			assertTranslation(service.name, `service ${service.id}`);
			if (service.description)
				assertTranslation(service.description, `service ${service.id} description`);
			service.inclusions?.forEach((inclusion, index) =>
				assertTranslation(inclusion, `service ${service.id} inclusion ${index + 1}`)
			);

			if (service.price.kind === 'fixed') {
				assertPositiveAmount(
					service.price.amount,
					`Service ${service.id} has an invalid price amount`
				);
			} else if (service.price.kind === 'range') {
				if (
					!Number.isInteger(service.price.min) ||
					!Number.isInteger(service.price.max) ||
					service.price.min <= 0 ||
					service.price.max <= 0 ||
					service.price.min > service.price.max
				) {
					throw new Error(`Service ${service.id} has an invalid price range`);
				}
			} else {
				if (!service.price.options.length) {
					throw new Error(`Service ${service.id} has no price variants`);
				}
				for (const option of service.price.options) {
					assertTranslation(option.label, `service ${service.id} price variant`);
					assertPositiveAmount(
						option.amount,
						`Service ${service.id} has an invalid variant amount`
					);
				}
			}
		}
	}

	return menu;
};

const formatAmount = (amount: number, language: Language) =>
	`${new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US').format(amount)}₫`;

const formatUnit = (price: Exclude<MenuPrice, { kind: 'variants' }>, language: Language) => {
	const label = unitLabels[price.unit ?? 'service'][language];
	return label ? ` / ${label}` : '';
};

export const formatMenuPrice = (price: MenuPrice, language: Language) => {
	if (price.kind === 'variants') {
		return price.options
			.map(({ label, amount }) => `${label[language]} ${formatAmount(amount, language)}`)
			.join(' · ');
	}

	const prefix = price.modifier === 'add' ? '+' : '';
	const unit = formatUnit(price, language);
	if (price.kind === 'fixed') return `${prefix}${formatAmount(price.amount, language)}${unit}`;

	const minimum = new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US').format(price.min);
	return `${prefix}${minimum}–${formatAmount(price.max, language)}${unit}`;
};

export const serviceMenu = defineServiceMenu({
	sourceVersion: '2026-08',
	currency: 'VND',
	categories: [
		{
			id: 'nail-design',
			name: { vi: 'Design móng', en: 'Nail design' },
			services: [
				{
					id: 'gel-paint-designs',
					name: { vi: 'Vẽ gel', en: 'Gel paint designs' },
					price: { kind: 'range', min: 5_000, max: 50_000, unit: 'finger' }
				},
				{
					id: 'cartoon-designs',
					name: { vi: 'Vẽ hoạt hình', en: 'Cartoon or comic designs' },
					description: { vi: 'Tuỳ độ khó dễ', en: 'Depending on difficulty' },
					price: { kind: 'range', min: 15_000, max: 100_000, unit: 'finger' }
				},
				{
					id: 'raised-pattern-designs',
					name: { vi: 'Vẽ hoạ tiết, vẽ nổi', en: 'Patterns or raised designs' },
					price: { kind: 'range', min: 10_000, max: 50_000, unit: 'finger' }
				},
				{
					id: 'metallic-designs',
					name: { vi: 'Vẽ metal', en: 'Metallic designs' },
					price: { kind: 'range', min: 10_000, max: 50_000, unit: 'finger' }
				},
				{
					id: '3d-sculpting',
					name: { vi: 'Nặn 3D', en: '3D sculpting' },
					price: { kind: 'range', min: 30_000, max: 50_000, unit: 'finger' }
				},
				{
					id: 'french-tip-designs',
					name: { vi: 'French đầu móng', en: 'French tip designs' },
					price: { kind: 'range', min: 5_000, max: 20_000, unit: 'finger' }
				},
				{
					id: 'marble-designs',
					name: { vi: 'Loang vân đá', en: 'Marble designs' },
					price: { kind: 'range', min: 15_000, max: 40_000, unit: 'finger' }
				},
				{
					id: 'reflective-designs',
					name: { vi: 'Tráng gương', en: 'Reflective designs' },
					price: { kind: 'range', min: 5_000, max: 15_000, unit: 'finger' }
				},
				{
					id: 'ombre-designs',
					name: { vi: 'Ombre 1/2/3/4 màu', en: 'Ombre designs from 1–4 colors' },
					price: { kind: 'range', min: 15_000, max: 30_000, unit: 'finger' }
				},
				{
					id: 'glitter-designs',
					name: { vi: 'Đắp nhũ, rắc nhũ', en: 'Glitter designs' },
					price: { kind: 'range', min: 15_000, max: 30_000, unit: 'finger' }
				},
				{
					id: 'nail-stickers',
					name: { vi: 'Sticker', en: 'Nail stickers' },
					price: { kind: 'range', min: 5_000, max: 15_000, unit: 'finger' }
				},
				{
					id: 'sprinkling-stones',
					name: { vi: 'Đá rắc', en: 'Sprinkling stones' },
					price: { kind: 'fixed', amount: 30_000, unit: 'finger' }
				},
				{
					id: 'small-stones-metals',
					name: { vi: 'Đá nhỏ, kim loại', en: 'Small stones & metals' },
					price: { kind: 'range', min: 1_000, max: 10_000, unit: 'piece' }
				},
				{
					id: 'large-stones',
					name: { vi: 'Đá lớn, đá khối', en: 'Large stones' },
					price: { kind: 'range', min: 5_000, max: 35_000, unit: 'piece' }
				},
				{
					id: 'nail-charms',
					name: { vi: 'Charm nail, phụ kiện', en: 'Other charms & accessories' },
					price: { kind: 'range', min: 10_000, max: 45_000, unit: 'piece' }
				},
				{
					id: 'hidden-charms-flower-designs',
					name: { vi: 'Ẩn xà cừ, hoa khô, khổng tước', en: 'Hidden charms & flower designs' },
					price: { kind: 'range', min: 10_000, max: 30_000, unit: 'finger' }
				}
			]
		},
		{
			id: 'general-nails',
			name: { vi: 'Nail cơ bản', en: 'General nail services' },
			services: [
				{
					id: 'cuticle-cleanup',
					name: { vi: 'Nhặt da sửa móng', en: 'Cleaning cuticles, fixing nail shapes' },
					price: { kind: 'fixed', amount: 40_000, unit: 'set' }
				},
				{
					id: 'nail-shape-change',
					name: { vi: 'Sửa, đổi form móng', en: 'Fixing or changing nail forms & shapes' },
					price: { kind: 'fixed', amount: 10_000, unit: 'set' }
				},
				{
					id: 'normal-polish-removal',
					name: { vi: 'Lau sơn thường', en: 'Removing normal paint' },
					price: { kind: 'fixed', amount: 10_000, unit: 'set' }
				},
				{
					id: 'gel-polish-removal',
					name: { vi: 'Phá sơn gel', en: 'Removing gel paint' },
					price: { kind: 'fixed', amount: 30_000, unit: 'set' }
				},
				{
					id: 'extension-removal',
					name: {
						vi: 'Phá đắp gel/bột/móng úp',
						en: 'Removing gel-built, acrylic, press-on nails'
					},
					price: { kind: 'fixed', amount: 50_000, unit: 'set' }
				},
				{
					id: 'nail-hardening',
					name: { vi: 'Phủ cứng móng', en: 'Nail varnishing & hardening' },
					description: { vi: 'Tạo cầu +15.000₫', en: 'Nail apex +15,000₫' },
					price: { kind: 'fixed', amount: 30_000, unit: 'set' }
				},
				{
					id: 'gel-polish',
					name: { vi: 'Sơn gel', en: 'Gel painting' },
					price: { kind: 'fixed', amount: 100_000, unit: 'set' }
				},
				{
					id: 'jelly-gel-polish',
					name: { vi: 'Sơn gel thạch', en: 'Jelly gel painting' },
					price: { kind: 'fixed', amount: 120_000, unit: 'set' }
				},
				{
					id: 'effect-gel-polish',
					name: {
						vi: 'Sơn gel hiệu ứng mắt mèo, flash,…',
						en: 'Cateye effect or flash effect painting'
					},
					price: { kind: 'fixed', amount: 150_000, unit: 'set' }
				},
				{
					id: 'mixed-color-gel',
					name: { vi: 'Sơn mix màu', en: 'Multiple colors' },
					description: { vi: 'Từ 2 màu trở lên', en: '2 and above' },
					price: { kind: 'fixed', amount: 10_000, modifier: 'add', unit: 'color' }
				},
				{
					id: 'nail-touch-up',
					name: { vi: 'Dặm che khuyết điểm', en: 'Nail touch-up to conceal blemishes' },
					price: { kind: 'fixed', amount: 50_000, unit: 'set' }
				}
			]
		},
		{
			id: 'nail-extensions',
			name: { vi: 'Nối móng', en: 'Nail extensions' },
			services: [
				{
					id: 'glue-press-on-nails',
					name: { vi: 'Gắn móng úp keo', en: 'Press-on nails with glue' },
					price: { kind: 'fixed', amount: 100_000, unit: 'set' }
				},
				{
					id: 'gel-press-on-nails',
					name: { vi: 'Gắn móng úp gel', en: 'Press-on nails with gel' },
					price: { kind: 'fixed', amount: 120_000, unit: 'set' }
				},
				{
					id: 'gel-acrylic-extensions',
					name: { vi: 'Nối móng đắp gel', en: 'Press-on extension with gel-built' },
					price: { kind: 'range', min: 230_000, max: 270_000, unit: 'set' }
				},
				{
					id: 'gel-acrylic-natural-nails',
					name: { vi: 'Đắp gel móng thật', en: 'Gel-built nails on real nails' },
					price: { kind: 'range', min: 150_000, max: 200_000, unit: 'set' }
				},
				{
					id: 'gel-acrylic-fill',
					name: { vi: 'Fill gel', en: 'Gel-built filling' },
					price: { kind: 'range', min: 110_000, max: 180_000, unit: 'set' }
				},
				{
					id: 'ready-made-nailbox',
					name: { vi: 'Nailbox có sẵn tại tiệm', en: 'Nailbox available at the shop' },
					price: { kind: 'range', min: 100_000, max: 399_000, unit: 'set' }
				},
				{
					id: 'nailbox-application',
					name: { vi: 'Úp nailbox tại tiệm', en: 'Applying nailbox at the shop' },
					price: { kind: 'fixed', amount: 50_000, unit: 'set' }
				}
			]
		},
		{
			id: 'eyelashes',
			name: { vi: 'Dịch vụ nối mi', en: 'Eyelash services' },
			services: [
				{
					id: 'classic-natural-eyelashes',
					name: { vi: 'Mi Classic tự nhiên', en: 'Classic eyelashes, natural' },
					price: { kind: 'fixed', amount: 230_000 }
				},
				{
					id: 'volume-natural-eyelashes',
					name: { vi: 'Mi Volume tự nhiên', en: 'Volume eyelashes, natural' },
					price: { kind: 'fixed', amount: 260_000 }
				},
				{
					id: 'rabbit-fur-eyelashes',
					name: { vi: 'Mi lông thỏ', en: 'Rabbit fur eyelashes' },
					price: { kind: 'fixed', amount: 280_000 }
				},
				{
					id: 'designed-eyelashes',
					name: { vi: 'Mi thiết kế', en: 'Designed eyelashes' },
					price: { kind: 'range', min: 250_000, max: 350_000 }
				},
				{
					id: 'mixed-color-eyelashes',
					name: { vi: 'Mix mi màu', en: 'Mixed colored eyelashes' },
					price: { kind: 'range', min: 30_000, max: 50_000, modifier: 'add' }
				},
				{
					id: 'eyelash-fills',
					name: { vi: 'Dặm mi', en: 'Eyelash fills' },
					price: { kind: 'range', min: 100_000, max: 170_000 }
				},
				{
					id: 'bottom-eyelashes',
					name: { vi: 'Mi dưới', en: 'Bottom eyelash' },
					price: { kind: 'range', min: 40_000, max: 60_000 }
				},
				{
					id: 'eyelash-removal-serum',
					name: { vi: 'Tháo xả mi + dưỡng', en: 'Removing eyelashes + serum' },
					price: { kind: 'range', min: 30_000, max: 50_000 }
				},
				{
					id: 'eyelash-curl-collagen',
					name: { vi: 'Uốn mi + dưỡng collagen', en: 'Eyelash curling + collagen serum' },
					price: { kind: 'fixed', amount: 190_000 }
				},
				{
					id: 'eyelash-curl-keratin',
					name: {
						vi: 'Uốn mi + phủ đen + Keratin',
						en: 'Eyelash curling + black tinting + Keratin'
					},
					price: { kind: 'fixed', amount: 210_000 }
				},
				{
					id: 'mega-volume-eyelashes',
					name: { vi: 'Mi Mega Volume (dày)', en: 'Mega Volume Eyelashes (thick)' },
					price: { kind: 'fixed', amount: 350_000 }
				},
				{
					id: 'baby-doll-eyelashes',
					name: { vi: 'Mi em bé', en: 'Baby Doll Eyelashes' },
					price: { kind: 'fixed', amount: 280_000 }
				},
				{
					id: 'korean-lash-lift-black-tinting',
					name: {
						vi: 'Uốn mi Hàn Quốc + phủ đen',
						en: 'Korean-Style Lash Lift + black tinting'
					},
					price: { kind: 'fixed', amount: 260_000 }
				}
			]
		},
		{
			id: 'shampooing',
			name: { vi: 'Dịch vụ gội đầu', en: 'Shampooing services' },
			services: [
				{
					id: 'normal-shampoo',
					name: { vi: 'Gội đầu dầu thường', en: 'Normal shampoo' },
					price: { kind: 'fixed', amount: 65_000 }
				},
				{
					id: 'premium-pair-shampoo',
					name: { vi: 'Gội đầu dầu cặp', en: 'Premium pair shampoo' },
					price: { kind: 'fixed', amount: 90_000 }
				},
				{
					id: 'organic-shampoo',
					name: { vi: 'Gội đầu dầu thuần chay', en: 'Organic shampoo' },
					price: { kind: 'fixed', amount: 130_000 }
				},
				{
					id: 'hair-extension-shampoo-fee',
					name: { vi: '(Phụ phí) Tóc nối', en: 'Extra fee for hair extension' },
					price: { kind: 'fixed', amount: 10_000, modifier: 'add' }
				},
				{
					id: 'shampoo-package-1',
					name: { vi: 'Combo gội 1', en: 'Shampoo package 1' },
					inclusions: [
						{ vi: 'Tẩy trang', en: 'Makeup cleanse' },
						{ vi: 'Rửa mặt', en: 'Face wash' },
						{ vi: 'Tẩy tế bào chết', en: 'Facial scrub' },
						{ vi: 'Đắp mặt nạ', en: 'Facial mask' },
						{ vi: 'Gội đầu dầu cặp', en: 'Premium pair shampoo' }
					],
					price: { kind: 'fixed', amount: 190_000 }
				},
				{
					id: 'shampoo-package-2',
					name: { vi: 'Combo gội 2', en: 'Shampoo package 2' },
					inclusions: [
						{ vi: 'Tẩy trang', en: 'Makeup cleanse' },
						{ vi: 'Rửa mặt', en: 'Face wash' },
						{ vi: 'Tẩy tế bào chết', en: 'Facial scrub' },
						{ vi: 'Massage mặt nâng cơ', en: 'Face-lift massage' },
						{ vi: 'Đắp mặt nạ', en: 'Facial mask' },
						{ vi: 'Gội đầu dầu cặp', en: 'Premium pair shampoo' }
					],
					price: { kind: 'fixed', amount: 230_000 }
				}
			]
		},
		{
			id: 'misc-services',
			name: { vi: 'Các dịch vụ lẻ', en: 'Miscellaneous services' },
			services: [
				{
					id: 'face-wash',
					name: { vi: 'Rửa mặt', en: 'Face wash' },
					price: { kind: 'fixed', amount: 10_000 }
				},
				{
					id: 'makeup-cleanse',
					name: { vi: 'Tẩy trang', en: 'Makeup cleanse' },
					price: { kind: 'fixed', amount: 10_000 }
				},
				{
					id: 'facial-scrub',
					name: { vi: 'Tẩy tế bào chết da mặt', en: 'Facial scrub' },
					price: { kind: 'fixed', amount: 30_000 }
				},
				{
					id: 'facial-mask',
					name: { vi: 'Đắp mặt nạ', en: 'Facial mask' },
					price: { kind: 'fixed', amount: 65_000 }
				},
				{
					id: 'hand-feet-nurturing-mask',
					name: { vi: 'Đắp nạ dưỡng da tay/chân', en: 'Hand/feet nurturing mask' },
					price: {
						kind: 'variants',
						options: [
							{ label: { vi: 'Tay', en: 'Hands' }, amount: 40_000 },
							{ label: { vi: 'Chân', en: 'Feet' }, amount: 50_000 }
						]
					}
				},
				{
					id: 'hand-feet-scrub-cream',
					name: {
						vi: 'Tẩy tế bào chết, dưỡng da tay/chân',
						en: 'Hand/feet scrub and nurturing cream'
					},
					price: {
						kind: 'variants',
						options: [
							{ label: { vi: 'Tay', en: 'Hands' }, amount: 40_000 },
							{ label: { vi: 'Chân', en: 'Feet' }, amount: 60_000 }
						]
					}
				},
				{
					id: 'heel-scrub-cream',
					name: { vi: 'Chà gót, dưỡng da chân', en: 'Heel scrub and nurturing cream' },
					price: { kind: 'fixed', amount: 130_000 }
				},
				{
					id: 'feet-package-1',
					name: { vi: 'Combo chân 1', en: 'Feet package 1' },
					inclusions: [
						{ vi: 'Chà gót', en: 'Heel scrub' },
						{ vi: 'Tẩy tế bào chết', en: 'Skin scrub' },
						{ vi: 'Dưỡng da chân', en: 'Nurturing cream' }
					],
					price: { kind: 'fixed', amount: 160_000 }
				},
				{
					id: 'feet-package-2',
					name: { vi: 'Combo chân 2', en: 'Feet package 2' },
					inclusions: [
						{ vi: 'Chà gót', en: 'Heel scrub' },
						{ vi: 'Tẩy tế bào chết', en: 'Skin scrub' },
						{ vi: 'Đắp nạ dưỡng da chân', en: 'Nurturing mask' }
					],
					price: { kind: 'fixed', amount: 200_000 }
				},
				{
					id: 'hair-styling',
					name: { vi: 'Tạo kiểu tóc', en: 'Hair styling' },
					description: {
						vi: 'Uốn giả, dập phồng hoặc kẹp tạo kiểu',
						en: 'Curling, waving, crimping, or heat styling'
					},
					price: { kind: 'range', min: 30_000, max: 100_000 }
				},
				{
					id: 'hand-combo-1',
					name: { vi: 'Combo tay 1', en: 'Hand combo 1' },
					inclusions: [
						{ vi: 'Tẩy tế bào chết', en: 'Hand exfoliation' },
						{ vi: 'Đắp nạ dưỡng da tay', en: 'Hand moisturizing mask' }
					],
					price: { kind: 'fixed', amount: 70_000 }
				},
				{
					id: 'hand-combo-2',
					name: { vi: 'Combo tay 2', en: 'Hand combo 2' },
					inclusions: [
						{ vi: 'Nhặt da', en: 'Cuticle removal' },
						{ vi: 'Tẩy tế bào chết', en: 'Hand exfoliation' },
						{ vi: 'Đắp nạ dưỡng da tay', en: 'Hand moisturizing mask' }
					],
					price: { kind: 'fixed', amount: 100_000 }
				}
			]
		}
	]
});
