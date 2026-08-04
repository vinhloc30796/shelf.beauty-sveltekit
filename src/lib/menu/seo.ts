import type { Language } from '$lib/i18n';
import { siteOrigin } from '$lib/seo';

import type { MenuService, ServiceMenu } from './types';

const catalogCopy = {
	vi: {
		serviceType: 'Dịch vụ nail và làm đẹp',
		catalogName: 'Dịch vụ và bảng giá'
	},
	en: {
		serviceType: 'Nail and beauty services',
		catalogName: 'Services and prices'
	}
} as const;

const isWholeServiceFixedPrice = (service: MenuService) =>
	service.price.kind === 'fixed' &&
	service.price.modifier !== 'add' &&
	(service.price.unit === undefined ||
		service.price.unit === 'service' ||
		service.price.unit === 'set');

const buildOffer = (service: MenuService, language: Language) => {
	const description =
		service.description?.[language] ??
		service.inclusions?.map((inclusion) => inclusion[language]).join(', ');
	const fixedPrice =
		isWholeServiceFixedPrice(service) && service.price.kind === 'fixed'
			? { price: service.price.amount, priceCurrency: 'VND' as const }
			: {};

	return {
		'@type': 'Offer' as const,
		identifier: service.id,
		...fixedPrice,
		itemOffered: {
			'@type': 'Service' as const,
			name: service.name[language],
			...(description ? { description } : {})
		}
	};
};

export const buildServiceMenuJsonLd = (menu: ServiceMenu, language: Language) => ({
	'@context': 'https://schema.org' as const,
	'@type': 'Service' as const,
	'@id': `${siteOrigin}/${language}/services#service-menu`,
	serviceType: catalogCopy[language].serviceType,
	provider: { '@id': `${siteOrigin}/#localbusiness` },
	areaServed: {
		'@type': 'City' as const,
		name: language === 'vi' ? 'Đà Lạt' : 'Da Lat'
	},
	hasOfferCatalog: {
		'@type': 'OfferCatalog' as const,
		name: catalogCopy[language].catalogName,
		itemListElement: menu.categories.map((category) => ({
			'@type': 'OfferCatalog' as const,
			name: category.name[language],
			itemListElement: category.services.map((service) => buildOffer(service, language))
		}))
	}
});
