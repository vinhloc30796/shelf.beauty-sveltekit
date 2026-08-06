import { describe, expect, test } from 'vitest';

import { GET } from './+server';

describe('GET /fbmessage', () => {
	test('permanently redirects directly to the Vietnamese Messenger booking URL', () => {
		const response = GET();

		expect(response.status).toBe(308);
		expect(response.headers.get('location')).toBe(
			'https://m.me/shelfbeautystudio?text=Cho+m%C3%ACnh+xin+%C4%91%E1%BA%B7t+l%E1%BB%8Bch+t%E1%BA%A1i+Shelf+Beauty+Studio+v%E1%BB%9Bi+%E1%BA%A1.'
		);
	});
});
