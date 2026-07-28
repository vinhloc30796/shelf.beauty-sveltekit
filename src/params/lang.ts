import { isLanguage } from '$lib/i18n';

export const match = (param: string) => isLanguage(param);
