import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Language = 'vi' | 'en';

const storageKey = 'shelf-language';

const initialLanguage = (): Language => {
	if (!browser) return 'vi';
	return localStorage.getItem(storageKey) === 'en' ? 'en' : 'vi';
};

const createLanguageStore = () => {
	const { subscribe, set } = writable<Language>(initialLanguage());

	return {
		subscribe,
		set: (language: Language) => {
			if (browser) localStorage.setItem(storageKey, language);
			set(language);
		}
	};
};

export const language = createLanguageStore();
