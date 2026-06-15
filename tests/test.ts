import { expect, test } from '@playwright/test';

test('homepage defaults to Vietnamese and switches actions and status to English', async ({
	page
}) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { name: /Chăm sóc sắc đẹp tại Đà Lạt/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /Đặt hẹn/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /Tìm đường/i })).toBeVisible();
	await expect(page.getByText(/Trạng thái/i)).toBeVisible();

	await page.getByRole('button', { name: 'English' }).click();

	await expect(page.getByRole('heading', { name: /Beauty care in Da Lat/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /Book appointment/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /Get directions/i })).toBeVisible();
	await expect(page.getByText(/Status/i)).toBeVisible();
	await expect(page.getByText(/Opening hours/i)).toBeVisible();
});

test('homepage renders canonical, Open Graph, and Twitter metadata', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://shelf.beauty/'
	);
	await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
		'content',
		'Shelf Beauty Studio, chăm sóc sắc đẹp tại Đà Lạt'
	);
	await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
		'content',
		'Shelf Beauty Studio tại Đà Lạt. Đặt lịch làm nail, xem giờ mở cửa, đọc đánh giá, và tìm đường đến studio.'
	);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/og/home.jpg'
	);
	await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
		'content',
		'summary_large_image'
	);
	await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/og/home.jpg'
	);
});

test('reviews page switches page copy without duplicating both languages', async ({ page }) => {
	await page.goto('/reviews');

	await expect(page.getByRole('heading', { name: /Lời nhắn từ khách của Shelf/i })).toBeVisible();

	await page.getByRole('button', { name: 'English' }).click();

	await expect(page.getByRole('heading', { name: /Guest notes/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /View all Google reviews/i })).toBeVisible();
});

test('reviews page renders canonical, Open Graph, and Twitter metadata', async ({ page }) => {
	await page.goto('/reviews');

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://shelf.beauty/reviews'
	);
	await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
		'content',
		'Đánh giá, Shelf Beauty Studio'
	);
	await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
		'content',
		'Đọc cảm nhận của khách và đánh giá Google của Shelf Beauty Studio tại Đà Lạt.'
	);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/reviews'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/og/reviews.jpg'
	);
	await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
		'content',
		'summary_large_image'
	);
	await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/og/reviews.jpg'
	);
});

test('contact page presents visit details, map, social links, and directions', async ({ page }) => {
	await page.goto('/contact');

	await expect(page.getByRole('heading', { name: /Ghé Shelf/i })).toBeVisible();
	await expect(page.getByText('35 Yersin, phường 10, Đà Lạt, Lâm Đồng')).toBeVisible();
	await expect(page.getByTitle('Bản đồ vị trí Shelf Beauty Studio')).toBeVisible();
	await expect(page.getByRole('link', { name: /Tìm đường/i })).toBeVisible();

	await page.getByRole('button', { name: 'English' }).click();

	await expect(page.getByRole('heading', { name: /Visit Shelf/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /Get directions/i })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Facebook, shelfbeautystudio' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Instagram, shelfbeautystudio' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'TikTok, shelfbeautystudio' })).toBeVisible();
});

test('contact page renders canonical, Open Graph, and Twitter metadata', async ({ page }) => {
	await page.goto('/contact');

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://shelf.beauty/contact'
	);
	await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
		'content',
		'Ghé Shelf Beauty Studio tại Đà Lạt'
	);
	await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
		'content',
		'Tìm Shelf Beauty Studio tại 35 Yersin, phường 10, Đà Lạt. Tìm đường, nhắn tin đặt lịch, và theo dõi Shelf trên mạng xã hội.'
	);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/contact'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/og/contact.jpg'
	);
	await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
		'content',
		'summary_large_image'
	);
	await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
		'content',
		'https://shelf.beauty/og/contact.jpg'
	);
});
