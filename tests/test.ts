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

test('reviews page switches page copy without duplicating both languages', async ({ page }) => {
	await page.goto('/reviews');

	await expect(page.getByRole('heading', { name: /Lời nhắn từ khách của Shelf/i })).toBeVisible();

	await page.getByRole('button', { name: 'English' }).click();

	await expect(page.getByRole('heading', { name: /Guest notes/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /View all Google reviews/i })).toBeVisible();
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
