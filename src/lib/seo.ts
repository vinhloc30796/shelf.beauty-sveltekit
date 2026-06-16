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
