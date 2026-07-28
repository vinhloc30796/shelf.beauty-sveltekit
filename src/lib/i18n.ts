export const languages = ['vi', 'en'] as const;
export type Language = (typeof languages)[number];

export const defaultLanguage: Language = 'vi';

export const isLanguage = (value: string | undefined): value is Language =>
	languages.includes(value as Language);

const normalizePath = (pathname: string) => {
	const withSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
	return withSlash === '/' ? '/' : withSlash.replace(/\/+$/g, '');
};

export const languageFromPath = (pathname: string): Language => {
	const [, maybeLanguage] = normalizePath(pathname).split('/');
	return isLanguage(maybeLanguage) ? maybeLanguage : defaultLanguage;
};

export const stripLanguagePrefix = (pathname: string) => {
	const normalizedPath = normalizePath(pathname);
	const segments = normalizedPath.split('/').filter(Boolean);

	if (isLanguage(segments[0])) {
		const pathWithoutLanguage = segments.slice(1).join('/');
		return pathWithoutLanguage ? `/${pathWithoutLanguage}` : '/';
	}

	return normalizedPath;
};

export const localizedPath = (language: Language, pathname: string) => {
	const pathWithoutLanguage = stripLanguagePrefix(pathname);
	return pathWithoutLanguage === '/' ? `/${language}` : `/${language}${pathWithoutLanguage}`;
};

export const alternateLanguagePath = (pathname: string, language: Language) =>
	localizedPath(language, stripLanguagePrefix(pathname));
