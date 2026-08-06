import { localizedPath, type Language } from './i18n';
import { getMessengerBookingUrl } from './messenger';

const apexHostname = 'shelf.beauty';
const canonicalHostname = 'www.shelf.beauty';
const firstPartyHostnames = new Set([apexHostname, canonicalHostname, 'localhost', '127.0.0.1']);

export const siteOrigin = `https://${canonicalHostname}`;
export const siteName = 'Shelf Beauty Studio';
export const businessPhone = {
	display: '0969 016 106',
	e164: '+84969016106'
} as const;

export const toAbsoluteUrl = (path: string) => {
	if (path.startsWith('http://') || path.startsWith('https://')) {
		const url = new URL(path);
		if (!firstPartyHostnames.has(url.hostname)) return path;

		url.protocol = 'https:';
		url.hostname = canonicalHostname;
		url.port = '';
		return url.toString();
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return new URL(`${siteOrigin}${normalizedPath}`).toString();
};

export const canonicalRedirectUrl = (requestUrl: URL) => {
	if (requestUrl.hostname !== apexHostname) return null;

	const targetUrl = new URL(requestUrl);
	targetUrl.protocol = 'https:';
	targetUrl.hostname = canonicalHostname;
	targetUrl.port = '';
	if (targetUrl.pathname === '/') targetUrl.pathname = '/vi';
	return targetUrl.toString();
};

export type HreflangAlternate = {
	hreflang: Language | 'x-default';
	href: string;
};

export const buildHreflangAlternates = (pathname: string): HreflangAlternate[] => {
	const viPath = localizedPath('vi', pathname);
	const enPath = localizedPath('en', pathname);

	return [
		{ hreflang: 'vi', href: toAbsoluteUrl(viPath) },
		{ hreflang: 'en', href: toAbsoluteUrl(enPath) },
		{ hreflang: 'x-default', href: toAbsoluteUrl(viPath) }
	];
};

export const socialImages = {
	home: toAbsoluteUrl('/og/home.jpg'),
	reviews: toAbsoluteUrl('/og/reviews.jpg'),
	contact: toAbsoluteUrl('/og/contact.jpg')
} as const;

export const defaultSocialImage = socialImages.home;

export const localBusinessJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'BeautySalon',
	'@id': `${siteOrigin}/#localbusiness`,
	name: siteName,
	url: toAbsoluteUrl('/vi'),
	image: socialImages.home,
	telephone: businessPhone.e164,
	description:
		'Shelf Beauty Studio is a nail and beauty care studio in Da Lat, Vietnam, offering detailed nail care, hair washing, and beauty appointments.',
	address: {
		'@type': 'PostalAddress',
		streetAddress: '35 Yersin',
		addressLocality: 'Đà Lạt',
		addressRegion: 'Lâm Đồng',
		addressCountry: 'VN'
	},
	geo: {
		'@type': 'GeoCoordinates',
		latitude: 11.9415682,
		longitude: 108.451834
	},
	hasMap:
		'https://www.google.com/maps/place/shelf+beauty+studio/@11.9415682,108.4492591,17z/data=!4m18!1m9!3m8!1s0x317113791162271f:0x6921c643e2be5906!2sshelf+beauty+studio!8m2!3d11.9415682!4d108.451834!9m1!1b1!16s%2Fg%2F11s8wb0ng4!3m7!1s0x317113791162271f:0x6921c643e2be5906!8m2!3d11.9415682!4d108.451834!9m1!1b1!16s%2Fg%2F11s8wb0ng4?entry=ttu',
	knowsAbout: ['Nail care', 'Beauty care', 'Hair washing'],
	sameAs: [
		'https://facebook.com/shelfbeautystudio',
		'https://instagram.com/shelfbeautystudio',
		'https://tiktok.com/@shelfbeautystudio'
	],
	potentialAction: {
		'@type': 'ReserveAction',
		target: {
			'@type': 'EntryPoint',
			urlTemplate: getMessengerBookingUrl('vi')
		}
	}
} as const;

export const buildJsonLdScript = (data: unknown) =>
	`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
