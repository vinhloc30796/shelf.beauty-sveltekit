import { describe, expect, test } from 'vitest';

import { handle } from './hooks.server';

describe('canonical host handling', () => {
	test('redirects the apex root before resolving the page', async () => {
		const resolve = () => {
			throw new Error('resolve should not be called for the apex host');
		};

		await expect(
			handle({
				event: { url: new URL('https://shelf.beauty/?source=apex') },
				resolve
			} as never)
		).rejects.toMatchObject({
			status: 308,
			location: 'https://www.shelf.beauty/vi?source=apex'
		});
	});
});
