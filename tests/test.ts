import { expect, test } from '@playwright/test';

const directionsUrl =
	'https://www.google.com/maps/dir/?api=1&destination=shelf+beauty+studio,+Yersin,+Ph%C6%B0%E1%BB%9Dng+10,+Dalat,+Lam+Dong&destination_place_id=ChIJHydiEXkTcTERBlm-4kPGIWk';

const expectSeoUrls = async (
	page: import('@playwright/test').Page,
	path: string,
	expectedTitle: string,
	expectedDescription: string,
	expectedImage: string
) => {
	const absoluteUrl = `https://www.shelf.beauty${path}`;
	const unprefixedPath = path.replace(/^\/(vi|en)(?=\/|$)/, '') || '/';
	const viPath = unprefixedPath === '/' ? '/vi' : `/vi${unprefixedPath}`;
	const enPath = unprefixedPath === '/' ? '/en' : `/en${unprefixedPath}`;

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', absoluteUrl);
	await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expectedTitle);
	await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
		'content',
		expectedDescription
	);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', absoluteUrl);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', expectedImage);
	await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveAttribute(
		'href',
		`https://www.shelf.beauty${viPath}`
	);
	await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
		'href',
		`https://www.shelf.beauty${enPath}`
	);
	await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
		'href',
		`https://www.shelf.beauty${viPath}`
	);
	await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
		'content',
		'summary_large_image'
	);
	await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
		'content',
		expectedImage
	);
};

test('directions redirects temporarily to Shelf Beauty Studio on Google Maps', async ({
	request
}) => {
	const response = await request.get('/directions', { maxRedirects: 0 });

	expect(response.status()).toBe(302);
	expect(response.headers().location).toBe(directionsUrl);
});

test('homepage and contact direction actions open the internal redirect in a new tab', async ({
	page
}) => {
	for (const path of ['/en', '/en/contact']) {
		await page.goto(path);
		const link = page.getByRole('link', { name: 'Get directions', exact: true });

		await expect(link).toHaveAttribute('href', '/directions');
		await expect(link).toHaveAttribute('target', '_blank');
	}
});

test('homepage and contact direction conversion payloads omit navigation callbacks', async ({
	page
}) => {
	for (const path of ['/en', '/en/contact']) {
		await page.goto(path);
		await page.evaluate(() => {
			const calls: unknown[][] = [];
			Object.assign(window, {
				__gtagCalls: calls,
				gtag: (...args: unknown[]) => calls.push(args)
			});
		});
		const link = page.getByRole('link', { name: 'Get directions', exact: true });

		await link.evaluate((element) => {
			element.addEventListener('click', (event) => event.preventDefault(), { once: true });
			element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		});

		const payload = await page.evaluate(() => {
			const calls = (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls;
			return calls.at(-1)?.[2] as Record<string, unknown>;
		});

		expect(payload.send_to).toMatch(/\/XeK7CPaZ2YUZEJue89oq$/);
		expect(payload).not.toHaveProperty('event_callback');
	}
});

test('legacy public page URLs redirect permanently to Vietnamese URLs', async ({ request }) => {
	const home = await request.get('/', { maxRedirects: 0 });
	const reviews = await request.get('/reviews', { maxRedirects: 0 });
	const contact = await request.get('/contact', { maxRedirects: 0 });
	const services = await request.get('/services', { maxRedirects: 0 });

	expect(home.status()).toBe(308);
	expect(home.headers().location).toBe('/vi');
	expect(reviews.status()).toBe(308);
	expect(reviews.headers().location).toBe('/vi/reviews');
	expect(contact.status()).toBe(308);
	expect(contact.headers().location).toBe('/vi/contact');
	expect(services.status()).toBe(308);
	expect(services.headers().location).toBe('/vi/services');
});

test('localized public page URLs render directly in their URL language', async ({ page }) => {
	await page.goto('/vi');
	await expect(page.getByRole('heading', { name: /Chăm sóc sắc đẹp tại Đà Lạt/i })).toBeVisible();

	await page.goto('/en');
	await expect(page.getByRole('heading', { name: /Beauty care in Da Lat/i })).toBeVisible();

	await page.goto('/vi/reviews');
	await expect(page.getByRole('heading', { name: /Lời nhắn từ khách của Shelf/i })).toBeVisible();

	await page.goto('/en/reviews');
	await expect(page.getByRole('heading', { name: /Guest notes/i })).toBeVisible();

	await page.goto('/vi/contact');
	await expect(page.getByRole('heading', { name: /Ghé Shelf/i })).toBeVisible();

	await page.goto('/en/contact');
	await expect(page.getByRole('heading', { name: /Visit Shelf/i })).toBeVisible();
});

test('localized homepage renders actions and status in its route language', async ({ page }) => {
	await page.goto('/vi');

	await expect(page.getByRole('heading', { name: /Chăm sóc sắc đẹp tại Đà Lạt/i })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Đặt hẹn', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Tìm đường', exact: true })).toBeVisible();
	await expect(page.getByText('Trạng thái', { exact: true })).toBeVisible();

	await page.goto('/en');

	await expect(page.getByRole('heading', { name: /Beauty care in Da Lat/i })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Book appointment', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Get directions', exact: true })).toBeVisible();
	await expect(page.getByText('Status', { exact: true })).toBeVisible();
	await expect(page.getByText('Opening hours', { exact: true })).toBeVisible();
});

test('localized reviews render route-language content and Google reviews action', async ({
	page
}) => {
	await page.goto('/vi/reviews');

	await expect(page.getByRole('heading', { name: /Lời nhắn từ khách của Shelf/i })).toBeVisible();

	await page.goto('/en/reviews');

	await expect(page.getByRole('heading', { name: /Guest notes/i })).toBeVisible();
	await expect(
		page.getByRole('link', { name: 'View all Google reviews', exact: true })
	).toBeVisible();
});

test('localized contact renders visit details, map, social links, and directions', async ({
	page
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/vi/contact');

	await expect(page.getByRole('heading', { name: /Ghé Shelf/i })).toBeVisible();
	await expect(page.getByText('35 Yersin, phường 10, Đà Lạt, Lâm Đồng')).toBeVisible();
	await expect(page.getByText('Điện thoại', { exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: '0969 016 106', exact: true })).toHaveAttribute(
		'href',
		'tel:+84969016106'
	);
	await expect(page.getByTitle('Bản đồ vị trí Shelf Beauty Studio')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Tìm đường', exact: true })).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth > document.documentElement.clientWidth
		)
	).toBe(false);

	await page.goto('/en/contact');

	await expect(page.getByRole('heading', { name: /Visit Shelf/i })).toBeVisible();
	await expect(page.getByText('Phone', { exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: '0969 016 106', exact: true })).toHaveAttribute(
		'href',
		'tel:+84969016106'
	);
	await expect(page.getByRole('link', { name: 'Get directions', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Facebook, shelfbeautystudio' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Instagram, shelfbeautystudio' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'TikTok, shelfbeautystudio' })).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth > document.documentElement.clientWidth
		)
	).toBe(false);
});

test('localized service menu renders audited services, prices, packages, and booking action', async ({
	page
}) => {
	await page.goto('/vi/services');

	await expect(page.getByRole('heading', { name: 'Dịch vụ và bảng giá' })).toBeVisible();
	const vietnameseGeneralNails = page.getByRole('region', { name: 'Nail cơ bản' });
	await expect(vietnameseGeneralNails).toBeVisible();
	await expect(vietnameseGeneralNails.getByText('Sơn gel', { exact: true })).toBeVisible();
	await expect(vietnameseGeneralNails.getByText('100.000₫ / bộ', { exact: true })).toBeVisible();
	const vietnameseSkinCare = page.getByRole('region', { name: 'Dịch vụ chăm sóc da' });
	await expect(vietnameseSkinCare).toBeVisible();
	await expect(vietnameseSkinCare.getByText(/^Điện di tinh chất/)).toBeVisible();
	await expect(page.getByRole('link', { name: 'Đặt hẹn với Shelf' })).toBeVisible();

	await page.goto('/en/services');

	await expect(page.getByRole('heading', { name: 'Services and prices' })).toBeVisible();
	const englishGeneralNails = page.getByRole('region', { name: 'General nail services' });
	await expect(englishGeneralNails).toBeVisible();
	await expect(englishGeneralNails.getByText('Gel polish', { exact: true })).toBeVisible();
	await expect(englishGeneralNails.getByText('100,000₫ / set', { exact: true })).toBeVisible();
	await expect(
		page.getByRole('region', { name: 'Skin care services' }).getByText(/^Essence infusion/)
	).toBeVisible();
	await expect(page.getByRole('link', { name: 'Book with Shelf' })).toBeVisible();
});

test('service menu stays within a mobile viewport while category links remain scrollable', async ({
	page
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/vi/services');

	const pageOverflows = await page.evaluate(
		() => document.documentElement.scrollWidth > document.documentElement.clientWidth
	);
	expect(pageOverflows).toBe(false);

	const categoryLinks = page
		.getByRole('navigation', { name: 'Xem nhanh theo dịch vụ' })
		.locator('div');
	await expect(categoryLinks).toBeVisible();
	expect(await categoryLinks.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
		true
	);
});

test('language switcher and navigation use real localized links', async ({ page }) => {
	await page.goto('/vi/reviews');

	await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
	await expect(page.getByRole('link', { name: 'Trang chủ', exact: true })).toHaveAttribute(
		'href',
		'/vi'
	);
	await expect(page.getByRole('link', { name: 'Đánh giá', exact: true })).toHaveAttribute(
		'href',
		'/vi/reviews'
	);
	await expect(page.getByRole('link', { name: 'Dịch vụ', exact: true })).toHaveAttribute(
		'href',
		'/vi/services'
	);
	await expect(page.getByRole('link', { name: 'Liên hệ', exact: true })).toHaveAttribute(
		'href',
		'/vi/contact'
	);
	await expect(page.getByRole('link', { name: 'English' }).first()).toHaveAttribute(
		'href',
		'/en/reviews'
	);

	await page.goto('/en/contact');

	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute(
		'href',
		'/en'
	);
	await expect(page.getByRole('link', { name: 'Reviews', exact: true })).toHaveAttribute(
		'href',
		'/en/reviews'
	);
	await expect(page.getByRole('link', { name: 'Services', exact: true })).toHaveAttribute(
		'href',
		'/en/services'
	);
	await expect(page.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute(
		'href',
		'/en/contact'
	);
	await expect(page.getByRole('link', { name: 'Tiếng Việt' }).first()).toHaveAttribute(
		'href',
		'/vi/contact'
	);
});

test('localized pages render self-canonical SEO metadata and hreflang alternates', async ({
	page
}) => {
	await page.goto('/vi');
	await expectSeoUrls(
		page,
		'/vi',
		'Shelf Beauty Studio, chăm sóc sắc đẹp tại Đà Lạt',
		'Shelf Beauty Studio tại Đà Lạt. Đặt lịch làm nail, xem giờ mở cửa, đọc đánh giá, và tìm đường đến studio.',
		'https://www.shelf.beauty/og/home.jpg'
	);

	await page.goto('/en');
	await expectSeoUrls(
		page,
		'/en',
		'Shelf Beauty Studio, Da Lat beauty care',
		'Shelf Beauty Studio in Da Lat. Book nail and beauty care, check opening hours, read guest notes, and get directions.',
		'https://www.shelf.beauty/og/home.jpg'
	);

	await page.goto('/vi/reviews');
	await expectSeoUrls(
		page,
		'/vi/reviews',
		'Đánh giá, Shelf Beauty Studio',
		'Đọc cảm nhận của khách và đánh giá Google của Shelf Beauty Studio tại Đà Lạt.',
		'https://www.shelf.beauty/og/reviews.jpg'
	);

	await page.goto('/en/reviews');
	await expectSeoUrls(
		page,
		'/en/reviews',
		'Guest notes, Shelf Beauty Studio reviews',
		'Read guest notes and Google reviews for Shelf Beauty Studio in Da Lat.',
		'https://www.shelf.beauty/og/reviews.jpg'
	);

	await page.goto('/vi/contact');
	await expectSeoUrls(
		page,
		'/vi/contact',
		'Ghé Shelf Beauty Studio tại Đà Lạt',
		'Tìm Shelf Beauty Studio tại 35 Yersin, phường 10, Đà Lạt. Tìm đường, nhắn tin đặt lịch, và theo dõi Shelf trên mạng xã hội.',
		'https://www.shelf.beauty/og/contact.jpg'
	);

	await page.goto('/en/contact');
	await expectSeoUrls(
		page,
		'/en/contact',
		'Visit Shelf Beauty Studio in Da Lat',
		'Find Shelf Beauty Studio at 35 Yersin, phường 10, Da Lat. Get directions, message to book, and follow Shelf on social media.',
		'https://www.shelf.beauty/og/contact.jpg'
	);

	await page.goto('/vi/services');
	await expectSeoUrls(
		page,
		'/vi/services',
		'Bảng giá dịch vụ nail và làm đẹp tại Đà Lạt | Shelf',
		'Xem dịch vụ và bảng giá nail, nối mi, chăm sóc da, gội đầu tại Shelf Beauty Studio, Đà Lạt.',
		'https://www.shelf.beauty/og/home.jpg'
	);

	await page.goto('/en/services');
	await expectSeoUrls(
		page,
		'/en/services',
		'Nail and beauty service prices in Da Lat | Shelf',
		'Explore nail, eyelash, skin care, and shampoo services and prices at Shelf Beauty Studio in Da Lat.',
		'https://www.shelf.beauty/og/home.jpg'
	);

	const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
	const serviceCatalog = structuredData
		.map((value) => JSON.parse(value))
		.find((value) => value['@type'] === 'Service');
	expect(serviceCatalog.hasOfferCatalog.itemListElement).toHaveLength(7);
	expect(
		serviceCatalog.hasOfferCatalog.itemListElement.flatMap(
			(category: { itemListElement: unknown[] }) => category.itemListElement
		)
	).toHaveLength(63);
});
