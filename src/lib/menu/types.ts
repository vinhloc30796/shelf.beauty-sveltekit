import type { Language } from '$lib/i18n';

export type LocalizedText = Record<Language, string>;

export type PriceUnit = 'service' | 'set' | 'finger' | 'piece' | 'color';

type PriceModifier = 'add';

export type MenuPrice =
	| {
			kind: 'fixed';
			amount: number;
			modifier?: PriceModifier;
			unit?: PriceUnit;
	  }
	| {
			kind: 'range';
			min: number;
			max: number;
			modifier?: PriceModifier;
			unit?: PriceUnit;
	  }
	| {
			kind: 'variants';
			options: Array<{
				label: LocalizedText;
				amount: number;
			}>;
	  };

export type MenuService = {
	id: string;
	name: LocalizedText;
	description?: LocalizedText;
	inclusions?: LocalizedText[];
	price: MenuPrice;
	kiotVietCode?: string;
};

export type MenuCategory = {
	id: string;
	name: LocalizedText;
	services: MenuService[];
};

export type ServiceMenu = {
	sourceVersion: string;
	currency: 'VND';
	categories: MenuCategory[];
};
