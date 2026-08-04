import { describe, expect, test } from 'vitest';

import { getMessengerBookingUrl } from './messenger';

describe('getMessengerBookingUrl', () => {
	test('builds the Vietnamese booking URL with an encoded localized message', () => {
		expect(getMessengerBookingUrl('vi')).toBe(
			'https://m.me/shelfbeautystudio?text=Cho+m%C3%ACnh+xin+%C4%91%E1%BA%B7t+l%E1%BB%8Bch+t%E1%BA%A1i+Shelf+Beauty+Studio+v%E1%BB%9Bi+%E1%BA%A1.'
		);
	});

	test('builds the English booking URL with punctuation encoded by URLSearchParams', () => {
		expect(getMessengerBookingUrl('en')).toBe(
			'https://m.me/shelfbeautystudio?text=Hi%2C+I%E2%80%99d+like+to+book+an+appointment+at+Shelf+Beauty+Studio.'
		);
	});
});
