import { expect, test, type Locator, type Page } from '@playwright/test';

const MINIMUM_NORMAL_TEXT_CONTRAST = 4.5;
const themes = ['light', 'dark'] as const;

type Theme = (typeof themes)[number];

async function forceTheme(page: Page, theme: Theme) {
	await page.emulateMedia({ colorScheme: theme });
	await page.addInitScript((selectedTheme) => {
		window.localStorage.setItem('mode-watcher-mode', selectedTheme);
	}, theme);
}

async function resolvedContrast(locator: Locator) {
	return locator.evaluate((element) => {
		type Rgba = { red: number; green: number; blue: number; alpha: number };

		const parseColor = (value: string): Rgba => {
			const channels = value.match(/[\d.]+/g)?.map(Number);
			if (!channels || channels.length < 3) {
				throw new Error('Unsupported computed color: ' + value);
			}

			return {
				red: channels[0],
				green: channels[1],
				blue: channels[2],
				alpha: channels[3] ?? 1
			};
		};
		const composite = (foreground: Rgba, background: Rgba): Rgba => {
			const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
			if (alpha === 0) return { red: 0, green: 0, blue: 0, alpha: 0 };

			return {
				red:
					(foreground.red * foreground.alpha +
						background.red * background.alpha * (1 - foreground.alpha)) /
					alpha,
				green:
					(foreground.green * foreground.alpha +
						background.green * background.alpha * (1 - foreground.alpha)) /
					alpha,
				blue:
					(foreground.blue * foreground.alpha +
						background.blue * background.alpha * (1 - foreground.alpha)) /
					alpha,
				alpha
			};
		};
		const luminance = ({ red, green, blue }: Rgba) => {
			const [linearRed, linearGreen, linearBlue] = [red, green, blue].map((channel) => {
				const normalized = channel / 255;
				return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
			});
			return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
		};

		const backgroundLayers: Rgba[] = [];
		let ancestor: Element | null = element;
		while (ancestor) {
			backgroundLayers.push(parseColor(getComputedStyle(ancestor).backgroundColor));
			ancestor = ancestor.parentElement;
		}

		const background = backgroundLayers
			.reverse()
			.reduce((composited, layer) => composite(layer, composited), {
				red: 255,
				green: 255,
				blue: 255,
				alpha: 1
			});
		const foreground = composite(parseColor(getComputedStyle(element).color), background);
		const lighter = Math.max(luminance(foreground), luminance(background));
		const darker = Math.min(luminance(foreground), luminance(background));

		return {
			ratio: (lighter + 0.05) / (darker + 0.05),
			color: getComputedStyle(element).color,
			backgroundColor:
				'rgb(' + background.red + ', ' + background.green + ', ' + background.blue + ')'
		};
	});
}

async function expectAaContrast(locator: Locator, label: string) {
	await expect(locator, label + ' should be visible').toBeVisible();
	const result = await resolvedContrast(locator);

	expect(
		result.ratio,
		label +
			': ' +
			result.color +
			' on ' +
			result.backgroundColor +
			' resolves to ' +
			result.ratio.toFixed(2) +
			':1'
	).toBeGreaterThanOrEqual(MINIMUM_NORMAL_TEXT_CONTRAST);
}

const routes = [
	{ path: '/en' },
	{
		path: '/en/services',
		supportingText: 'main .text-primary-foreground\\/85',
		inverseCta: 'main .bg-primary-foreground.text-primary-surface'
	},
	{
		path: '/en/reviews',
		supportingText: 'main .text-primary-foreground\\/80',
		inverseCta: 'main .bg-primary-foreground.text-primary-surface'
	},
	{ path: '/en/contact' }
] as const;

for (const theme of themes) {
	test(
		theme + ' theme keeps representative semantic text at WCAG AA contrast',
		async ({ page }) => {
			await forceTheme(page, theme);

			for (const route of routes) {
				await page.goto(route.path);

				if (theme === 'dark') {
					await expect(page.locator('html')).toHaveClass(/\bdark\b/);
				} else {
					await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
				}

				await expectAaContrast(
					page.getByRole('link', { name: 'English', exact: true }).first(),
					theme + ' ' + route.path + ' active language'
				);
				await expectAaContrast(
					page.locator('main .text-primary').first(),
					theme + ' ' + route.path + ' primary text'
				);
				await expectAaContrast(
					page.locator('main .bg-primary-surface.text-primary-foreground').first(),
					theme + ' ' + route.path + ' filled primary surface'
				);

				if ('supportingText' in route) {
					await expectAaContrast(
						page.locator(route.supportingText).first(),
						theme + ' ' + route.path + ' low-opacity supporting text'
					);
				}
				if ('inverseCta' in route) {
					await expectAaContrast(
						page.locator(route.inverseCta).first(),
						theme + ' ' + route.path + ' inverse CTA'
					);
				}
			}
		}
	);
}
