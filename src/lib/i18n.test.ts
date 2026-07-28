import { describe, expect, test } from 'vitest';

import {
	alternateLanguagePath,
	defaultLanguage,
	isLanguage,
	languageFromPath,
	localizedPath,
	stripLanguagePrefix
} from './i18n';

describe('language route helpers', () => {
	test('accepts only supported language prefixes', () => {
		expect(isLanguage('vi')).toBe(true);
		expect(isLanguage('en')).toBe(true);
		expect(isLanguage('fr')).toBe(false);
		expect(isLanguage(undefined)).toBe(false);
	});

	test('reads language from the first URL segment', () => {
		expect(languageFromPath('/vi/reviews')).toBe('vi');
		expect(languageFromPath('/en/contact')).toBe('en');
		expect(languageFromPath('/reviews')).toBe(defaultLanguage);
	});

	test('removes supported language prefixes while preserving page paths', () => {
		expect(stripLanguagePrefix('/vi')).toBe('/');
		expect(stripLanguagePrefix('/vi/reviews')).toBe('/reviews');
		expect(stripLanguagePrefix('/en/contact')).toBe('/contact');
		expect(stripLanguagePrefix('/contact')).toBe('/contact');
	});

	test('builds localized paths without duplicate slashes', () => {
		expect(localizedPath('vi', '/')).toBe('/vi');
		expect(localizedPath('en', '/reviews')).toBe('/en/reviews');
		expect(localizedPath('vi', 'contact')).toBe('/vi/contact');
		expect(localizedPath('en', '/vi/reviews')).toBe('/en/reviews');
	});

	test('maps the current route to the requested language equivalent', () => {
		expect(alternateLanguagePath('/vi/reviews', 'en')).toBe('/en/reviews');
		expect(alternateLanguagePath('/en/contact', 'vi')).toBe('/vi/contact');
		expect(alternateLanguagePath('/reviews', 'en')).toBe('/en/reviews');
	});
});
