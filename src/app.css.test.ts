import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const MINIMUM_NORMAL_TEXT_CONTRAST = 4.5;
const stylesheet = readFileSync(new URL('./app.css', import.meta.url), 'utf8');

type Rgb = readonly [red: number, green: number, blue: number];

function parseTheme(selector: ':root' | '.dark') {
	const escapedSelector = selector.replace('.', '\\.');
	const block = stylesheet.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\}`))?.[1];

	expect(block, `${selector} theme tokens should exist`).toBeDefined();

	return new Map(
		Array.from(block!.matchAll(/--([\w-]+):\s*([^;]+);/g), ([, name, value]) => [
			name,
			value.trim()
		])
	);
}

function parseHsl(value: string): Rgb {
	const match = value.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
	expect(match, `expected an HSL triplet, received "${value}"`).not.toBeNull();

	const hue = Number(match![1]) % 360;
	const saturation = Number(match![2]) / 100;
	const lightness = Number(match![3]) / 100;
	const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const hueSegment = hue / 60;
	const secondComponent = chroma * (1 - Math.abs((hueSegment % 2) - 1));
	const matchLightness = lightness - chroma / 2;

	let channels: Rgb;
	if (hueSegment < 1) channels = [chroma, secondComponent, 0];
	else if (hueSegment < 2) channels = [secondComponent, chroma, 0];
	else if (hueSegment < 3) channels = [0, chroma, secondComponent];
	else if (hueSegment < 4) channels = [0, secondComponent, chroma];
	else if (hueSegment < 5) channels = [secondComponent, 0, chroma];
	else channels = [chroma, 0, secondComponent];

	return channels.map((channel) => channel + matchLightness) as unknown as Rgb;
}

function composite(foreground: Rgb, background: Rgb, alpha = 1): Rgb {
	return foreground.map(
		(channel, index) => channel * alpha + background[index] * (1 - alpha)
	) as unknown as Rgb;
}

function relativeLuminance([red, green, blue]: Rgb) {
	const [linearRed, linearGreen, linearBlue] = [red, green, blue].map((channel) =>
		channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
	);

	return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
}

function contrastRatio(foreground: Rgb, background: Rgb) {
	const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
	const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
	return (lighter + 0.05) / (darker + 0.05);
}

function token(theme: Map<string, string>, name: string) {
	const value = theme.get(name);
	expect(value, `--${name} should be defined`).toBeDefined();
	return parseHsl(value!);
}

const semanticPairs = [
	['foreground', 'background'],
	['muted-foreground', 'background'],
	['muted-foreground', 'card'],
	['primary', 'background'],
	['primary', 'card'],
	['primary-foreground', 'primary-surface'],
	['secondary-foreground', 'secondary'],
	['accent-foreground', 'accent'],
	['destructive-foreground', 'destructive']
] as const;

describe.each([':root', '.dark'] as const)('%s theme contrast', (selector) => {
	const theme = parseTheme(selector);

	it.each(semanticPairs)('%s on %s meets WCAG AA for normal text', (foreground, background) => {
		const ratio = contrastRatio(token(theme, foreground), token(theme, background));
		expect(ratio, `${foreground} on ${background}: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
			MINIMUM_NORMAL_TEXT_CONTRAST
		);
	});

	it.each([
		{ alpha: 0.8, percentage: 80 },
		{ alpha: 0.85, percentage: 85 },
		{ alpha: 0.9, percentage: 90 }
	])(
		'primary foreground at $percentage% opacity remains readable on the primary surface',
		({ alpha, percentage }) => {
			const surface = token(theme, 'primary-surface');
			const foreground = composite(token(theme, 'primary-foreground'), surface, alpha);
			const ratio = contrastRatio(foreground, surface);

			expect(
				ratio,
				`primary foreground at ${percentage}%: ${ratio.toFixed(2)}:1`
			).toBeGreaterThanOrEqual(MINIMUM_NORMAL_TEXT_CONTRAST);
		}
	);
});
