import { toAbsoluteUrl } from '$lib/seo';
import type { RequestHandler } from './$types';

const pageRoutes = import.meta.glob('/src/routes/**/+page.svelte');
const excludedPaths = new Set(['/fbmessage']);

const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

const toRoutePath = (filePath: string) => {
	const routePath = filePath
		.replace('/src/routes', '')
		.replace('/+page.svelte', '')
		.split('/')
		.filter((segment) => segment && !segment.startsWith('('))
		.join('/');

	return routePath ? `/${routePath}` : '/';
};

const sitemapPaths = Object.keys(pageRoutes)
	.map(toRoutePath)
	.filter((path) => !path.includes('['))
	.filter((path) => !excludedPaths.has(path))
	.sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

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
