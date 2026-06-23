export const siteOrigin = 'https://shelf.beauty';
export const siteName = 'Shelf Beauty Studio';

export const toAbsoluteUrl = (path: string) => {
	if (path.startsWith('http://') || path.startsWith('https://')) {
		const url = new URL(path);
		const isLocalAsset = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
		return isLocalAsset
			? new URL(`${url.pathname}${url.search}${url.hash}`, siteOrigin).toString()
			: path;
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return new URL(normalizedPath, siteOrigin).toString();
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
	url: toAbsoluteUrl('/'),
	image: socialImages.home,
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
			urlTemplate: 'https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+làm+nail+với+ạ'
		}
	}
} as const;

export const buildJsonLdScript = (data: unknown) =>
	`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
