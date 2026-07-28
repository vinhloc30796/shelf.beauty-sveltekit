import type { Handle } from '@sveltejs/kit';

import { languageFromPath } from '$lib/i18n';

export const handle: Handle = async ({ event, resolve }) => {
	const language = languageFromPath(event.url.pathname);

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%shelf.lang%', language)
	});
};
