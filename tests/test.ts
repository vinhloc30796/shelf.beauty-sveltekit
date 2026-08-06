import { expect, test } from '@playwright/test';

const messengerBookingUrls = {
	vi: 'https://m.me/shelfbeautystudio?text=Cho+m%C3%ACnh+xin+%C4%91%E1%BA%B7t+l%E1%BB%8Bch+t%E1%BA%A1i+Shelf+Beauty+Studio+v%E1%BB%9Bi+%E1%BA%A1.',
	en: 'https://m.me/shelfbeautystudio?text=Hi%2C+I%E2%80%99d+like+to+book+an+appointment+at+Shelf+Beauty+Studio.'
} as const;

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

test('the legacy Messenger bridge redirects once while localized bridge routes remain absent', async ({
	request
}) => {
	const legacyBridge = await request.get('/fbmessage', { maxRedirects: 0 });
	const vietnameseBridge = await request.get('/vi/fbmessage', { maxRedirects: 0 });
	const englishBridge = await request.get('/en/fbmessage', { maxRedirects: 0 });

	expect(legacyBridge.status()).toBe(308);
	expect(legacyBridge.headers().location).toBe(messengerBookingUrls.vi);
	expect(vietnameseBridge.status()).toBe(404);
	expect(englishBridge.status()).toBe(404);
});

test('localized booking actions and footer expose direct route-language Messenger URLs', async ({
	page
}) => {
	for (const language of ['vi', 'en'] as const) {
		await page.goto(`/${language}`);
		await expect(
			page.getByRole('link', {
				name: language === 'vi' ? 'Đặt hẹn' : 'Book appointment',
				exact: true
			})
		).toHaveAttribute('href', messengerBookingUrls[language]);
		await expect(
			page.getByRole('link', { name: 'Shelf Beauty Studio Facebook Messenger', exact: true })
		).toHaveAttribute('href', messengerBookingUrls[language]);

		await page.goto(`/${language}/contact`);
		await expect(
			page.getByRole('link', {
				name: language === 'vi' ? 'Nhắn tin đặt lịch' : 'Message to book',
				exact: true
			})
		).toHaveAttribute('href', messengerBookingUrls[language]);
		await expect(
			page.getByRole('link', { name: 'Shelf Beauty Studio Facebook Messenger', exact: true })
		).toHaveAttribute('href', messengerBookingUrls[language]);

		await page.goto(`/${language}/services`);
		await expect(
			page.getByRole('link', {
				name: language === 'vi' ? 'Đặt hẹn với Shelf' : 'Book with Shelf',
				exact: true
			})
		).toHaveAttribute('href', messengerBookingUrls[language]);
	}
});

test('localized pages never generate legacy or localized Messenger bridge links', async ({
	page
}) => {
	for (const language of ['vi', 'en'] as const) {
		for (const path of ['', '/services', '/reviews', '/contact']) {
			await page.goto(`/${language}${path}`);
			const hrefs = await page
				.locator('a')
				.evaluateAll((links) =>
					links
						.map((link) => link.getAttribute('href'))
						.filter((href): href is string => href !== null)
				);

			expect(hrefs).not.toContain('/fbmessage');
			expect(hrefs).not.toContain(`/${language}/fbmessage`);
		}
	}
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
	await page.locator('html').evaluate((html) => html.classList.add('dark'));
	const phoneLink = page.getByRole('link', { name: '0969 016 106', exact: true });
	const phoneColors = await phoneLink.evaluate((link) => {
		const card = link.closest('.surface-panel');
		if (!card) throw new Error('Phone link card was not found');

		const parseRgb = (color: string) =>
			color
				.match(/\d+(?:\.\d+)?/g)
				?.slice(0, 3)
				.map(Number) ?? [];
		const relativeLuminance = (color: string) => {
			const [red, green, blue] = parseRgb(color).map((channel) => {
				const normalized = channel / 255;
				return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
			});

			return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
		};
		const foreground = getComputedStyle(link).color;
		const background = getComputedStyle(card).backgroundColor;
		const foregroundLuminance = relativeLuminance(foreground);
		const backgroundLuminance = relativeLuminance(background);

		return {
			foreground,
			background,
			contrast:
				(Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
				(Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
		};
	});

	expect(
		phoneColors.contrast,
		`${phoneColors.foreground} on ${phoneColors.background}`
	).toBeGreaterThanOrEqual(4.5);
	expect(await phoneLink.evaluate((link) => getComputedStyle(link).textDecorationLine)).toContain(
		'underline'
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

const squareLogoAssetPaths = (urls: string[]) =>
	Array.from(
		new Set(
			urls
				.map((url) => new URL(url).pathname)
				.filter((pathname) => /shelf-(dark|light)-logo[^/]*\.png$/.test(pathname))
		)
	);

test('header downloads only the square logo for the active theme', async ({ browser }) => {
	for (const theme of [
		{ colorScheme: 'light', expectedAsset: 'shelf-dark-logo' },
		{ colorScheme: 'dark', expectedAsset: 'shelf-light-logo' }
	] as const) {
		const context = await browser.newContext({ colorScheme: theme.colorScheme });
		const page = await context.newPage();
		const requestedUrls: string[] = [];
		page.on('request', (request) => requestedUrls.push(request.url()));

		await page.goto('/vi/services');
		await expect(page.getByTestId('header-logo')).toBeVisible();
		await page.waitForLoadState('load');
		expect(await page.locator('html').evaluate((html) => html.classList.contains('dark'))).toBe(
			theme.colorScheme === 'dark'
		);

		const requestedLogoPaths = squareLogoAssetPaths(requestedUrls);
		expect(requestedLogoPaths).toHaveLength(1);
		expect(requestedLogoPaths[0]).toContain(theme.expectedAsset);

		await context.close();
	}
});

test('header logo pre-paint setup uses a same-origin external script', async ({ page }) => {
	const response = await page.goto('/vi/services');
	const markup = await response?.text();
	const setupPosition = markup?.indexOf('data-header-logo-bootstrap') ?? -1;
	expect(setupPosition).toBeGreaterThan(-1);
	const scriptPosition = markup?.lastIndexOf('<script', setupPosition) ?? -1;
	const scriptOpeningTag = markup?.slice(scriptPosition, markup.indexOf('>', scriptPosition) + 1);
	expect(scriptOpeningTag).toContain('src="/header-logo-theme.js"');
	expect(scriptOpeningTag).not.toContain('%sveltekit.nonce%');
});

test('both header logos follow a theme toggle and request the newly active asset', async ({
	page
}) => {
	const requestedUrls: string[] = [];
	page.on('request', (request) => requestedUrls.push(request.url()));

	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/vi/services');
	await expect(page.locator('html')).not.toHaveClass(/dark/);

	await page.getByRole('button', { name: 'Toggle theme' }).click();
	await expect(page.locator('html')).toHaveClass(/dark/);
	await page.getByRole('button', { name: 'Open navigation menu' }).click();

	const headerLogos = page.getByTestId('header-logo');
	await expect(headerLogos).toHaveCount(2);
	expect(
		await headerLogos.evaluateAll((logos) =>
			logos.every((logo) => getComputedStyle(logo).backgroundImage.includes('shelf-light-logo'))
		)
	).toBe(true);

	await expect
		.poll(() => squareLogoAssetPaths(requestedUrls))
		.toEqual(expect.arrayContaining([expect.stringContaining('shelf-light-logo')]));
});

test('both header placements reserve a 48 by 48 logo box', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/vi/services');

	const headerLogos = page.getByTestId('header-logo');
	await expect(headerLogos).toHaveCount(1);
	await page.getByRole('button', { name: 'Open navigation menu' }).click();
	await expect(headerLogos).toHaveCount(2);

	const boxes = await headerLogos.evaluateAll((logos) =>
		logos.map((logo) => {
			const { width, height } = logo.getBoundingClientRect();
			return { width, height };
		})
	);
	expect(boxes).toEqual([
		{ width: 48, height: 48 },
		{ width: 48, height: 48 }
	]);
});

test('landscape page logos expose intrinsic dimensions and render at two to one', async ({
	page
}) => {
	for (const path of ['/vi', '/vi/reviews', '/vi/contact']) {
		await page.goto(path);
		const logo = page.getByRole('img', { name: 'Shelf Beauty Studio', exact: true });
		await expect(logo).toHaveAttribute('width', '1000');
		await expect(logo).toHaveAttribute('height', '500');
		expect(
			await logo.evaluate((image) => {
				const { width, height } = image.getBoundingClientRect();
				return width / height;
			})
		).toBeCloseTo(2, 5);
	}
});

test('affected mobile routes stay at or below 0.05 CLS across fresh navigations', async ({
	browser
}) => {
	test.setTimeout(120_000);
	for (const path of ['/vi', '/vi/reviews', '/vi/contact', '/vi/services']) {
		for (let run = 0; run < 3; run += 1) {
			const context = await browser.newContext({
				viewport: { width: 390, height: 844 }
			});
			await context.addInitScript(() => {
				let cumulativeLayoutShift = 0;
				const layoutShifts: Array<{
					value: number;
					startTime: number;
					sources: string[];
				}> = [];
				const recordLayoutShifts = (entries: PerformanceEntry[]) => {
					for (const entry of entries) {
						const layoutShift = entry as PerformanceEntry & {
							hadRecentInput: boolean;
							sources?: Array<{ node?: Node | null }>;
							value: number;
						};
						if (layoutShift.hadRecentInput) continue;
						cumulativeLayoutShift += layoutShift.value;
						layoutShifts.push({
							value: layoutShift.value,
							startTime: layoutShift.startTime,
							sources:
								layoutShift.sources?.flatMap(({ node }) =>
									node instanceof Element
										? [
												`${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${
													node.getAttribute('class')
														? `.${node.getAttribute('class')?.trim().replace(/\s+/g, '.')}`
														: ''
												}`
											]
										: []
								) ?? []
						});
					}
				};
				const observer = new PerformanceObserver((list) => recordLayoutShifts(list.getEntries()));
				observer.observe({ type: 'layout-shift', buffered: true });
				Object.defineProperty(window, '__shelfTakeLayoutShiftResult', {
					value: () => {
						recordLayoutShifts(observer.takeRecords());
						return { value: cumulativeLayoutShift, entries: layoutShifts };
					}
				});
			});
			const page = await context.newPage();
			await page.goto(path);
			await page.waitForLoadState('networkidle');
			await page.evaluate(async () => {
				await document.fonts.ready;
				const visibleImages = Array.from(document.images).filter((image) => {
					const bounds = image.getBoundingClientRect();
					return bounds.width > 0 && bounds.height > 0;
				});
				await Promise.all(
					visibleImages.map(
						(image) =>
							image.complete ||
							new Promise<void>((resolve) => {
								image.addEventListener('load', () => resolve(), { once: true });
								image.addEventListener('error', () => resolve(), { once: true });
							})
					)
				);
				await new Promise<void>((resolve) =>
					requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
				);
			});
			await page.waitForTimeout(1000);

			const layoutShiftResult = await page.evaluate(() =>
				(
					window as Window &
						typeof globalThis & {
							__shelfTakeLayoutShiftResult: () => {
								value: number;
								entries: Array<{ value: number; startTime: number; sources: string[] }>;
							};
						}
				).__shelfTakeLayoutShiftResult()
			);
			expect(
				layoutShiftResult.value,
				`${path} run ${run + 1}: ${JSON.stringify(layoutShiftResult.entries)}`
			).toBeLessThanOrEqual(0.05);
			await context.close();
		}
	}
});
