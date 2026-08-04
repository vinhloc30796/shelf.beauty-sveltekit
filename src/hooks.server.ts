import { redirect, type Handle } from '@sveltejs/kit';

import { languageFromPath } from '$lib/i18n';
import { canonicalRedirectUrl } from '$lib/seo';

export const handle: Handle = async ({ event, resolve }) => {
	const redirectUrl = canonicalRedirectUrl(event.url);
	if (redirectUrl) redirect(308, redirectUrl);

	const language = languageFromPath(event.url.pathname);

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%shelf.lang%', language)
	});
};
