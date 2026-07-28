import { localizedPath, languages } from '$lib/i18n';
import { toAbsoluteUrl } from '$lib/seo';
import type { RequestHandler } from './$types';

const pagePaths = ['/', '/reviews', '/contact'];

const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

const sitemapPaths = pagePaths.flatMap((path) =>
	languages.map((language) => localizedPath(language, path))
);

export const GET: RequestHandler = () => {
	const urls = sitemapPaths
		.map((path) => `\t<url>\n\t\t<loc>${escapeXml(toAbsoluteUrl(path))}</loc>\n\t</url>`)
		.join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml'
		}
	});
};
