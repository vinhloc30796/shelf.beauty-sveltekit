import type { Language } from './i18n';

const bookingMessages: Record<Language, string> = {
	vi: 'Cho mình xin đặt lịch tại Shelf Beauty Studio với ạ.',
	en: 'Hi, I’d like to book an appointment at Shelf Beauty Studio.'
};

export const getMessengerBookingUrl = (language: Language): string => {
	const query = new URLSearchParams({ text: bookingMessages[language] });
	return `https://m.me/shelfbeautystudio?${query.toString()}`;
};
