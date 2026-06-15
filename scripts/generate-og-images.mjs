import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'static', 'og');
const logoPath = path.join(root, 'src/lib/images/branding/shelf-light-landscape.png');

const width = 1200;
const height = 630;
const colors = {
	cream: '#EAE1C9',
	ink: '#1F120E',
	rust: '#8B3C22',
	turquoise: '#51BCBF',
	white: '#FFF8EE'
};

const pages = [
	{
		source: 'src/lib/images/operations/4.jpg',
		output: 'home.jpg',
		title: 'Shelf Beauty Studio',
		subtitle: 'Warm nail and beauty care in Da Lat',
		label: 'Da Lat beauty studio',
		position: 'center',
		plaque: { x: 64, y: 300, width: 560, titleMaxChars: 24 }
	},
	{
		source: 'src/lib/images/operations/9.jpg',
		output: 'reviews.jpg',
		title: 'Khách nói gì về Shelf',
		subtitle: 'Real notes from careful appointments',
		label: 'Guest notes',
		position: 'center',
		plaque: { x: 64, y: 48, width: 570, titleMaxChars: 20 }
	},
	{
		source: 'src/lib/images/operations/3.jpg',
		output: 'contact.jpg',
		title: 'Ghé Shelf tại Đà Lạt',
		subtitle: '35 Yersin, phường 10',
		label: 'Visit Shelf',
		position: 'center',
		plaque: { x: 654, y: 288, width: 482, titleMaxChars: 16 }
	}
];

const escapeXml = (value) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');

const wrapText = (text, maxChars) => {
	const words = text.split(' ');
	const lines = [];
	let line = '';

	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (next.length > maxChars && line) {
			lines.push(line);
			line = word;
		} else {
			line = next;
		}
	}

	if (line) lines.push(line);
	return lines;
};

const renderTextLines = (
	lines,
	x,
	y,
	size,
	lineHeight,
	weight = 700,
	opacity = 1,
	fill = colors.white
) =>
	lines
		.map(
			(line, index) =>
				`<text x="${x}" y="${y + index * lineHeight}" font-size="${size}" font-weight="${weight}" opacity="${opacity}" fill="${fill}">${escapeXml(
					line
				)}</text>`
		)
		.join('');

const getPlaqueMetrics = ({ title, subtitle, plaque }) => {
	const titleLines = wrapText(title, plaque.titleMaxChars ?? 22);
	const subtitleLines = wrapText(subtitle, 34);
	const titleHeight = titleLines.length * 52;
	const subtitleHeight = subtitleLines.length * 32;
	const plaqueHeight = 225 + titleHeight + subtitleHeight;

	return { titleLines, subtitleLines, titleHeight, subtitleHeight, plaqueHeight, plaque };
};

const overlaySvg = (page) => {
	const { title, subtitle, label } = page;
	const { titleLines, subtitleLines, titleHeight, subtitleHeight, plaqueHeight, plaque } =
		getPlaqueMetrics(page);
	const contentX = plaque.x + 34;
	const labelY = plaque.y + 48;
	const titleY = plaque.y + 112;
	const subtitleY = titleY + titleHeight + 18;
	const ruleY = subtitleY + subtitleHeight + 26;

	return Buffer.from(`
		<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="edge-wash" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stop-color="${colors.ink}" stop-opacity="0.24"/>
					<stop offset="54%" stop-color="${colors.ink}" stop-opacity="0.1"/>
					<stop offset="100%" stop-color="${colors.ink}" stop-opacity="0.34"/>
				</linearGradient>
			</defs>
			<rect width="${width}" height="${height}" fill="url(#edge-wash)"/>
			<rect x="${plaque.x}" y="${plaque.y}" width="${plaque.width}" height="${plaqueHeight}" rx="18" fill="${colors.ink}" opacity="0.78"/>
			<rect x="${plaque.x}" y="${plaque.y}" width="6" height="${plaqueHeight}" rx="3" fill="${colors.rust}"/>
			<g font-family="Arial, Helvetica, 'DejaVu Sans', sans-serif">
				<text x="${contentX}" y="${labelY}" font-size="24" font-weight="700" fill="${colors.cream}" opacity="0.86">${escapeXml(
					label
				)}</text>
				${renderTextLines(titleLines, contentX, titleY, 46, 52, 800)}
				${renderTextLines(subtitleLines, contentX, subtitleY, 24, 32, 650, 0.9, colors.cream)}
			</g>
			<line x1="${contentX}" y1="${ruleY}" x2="${contentX + 176}" y2="${ruleY}" stroke="${colors.turquoise}" stroke-width="4" stroke-linecap="round" opacity="0.86"/>
		</svg>
	`);
};

await mkdir(outputDir, { recursive: true });

for (const page of pages) {
	const input = path.join(root, page.source);
	const output = path.join(outputDir, page.output);
	const logo = await sharp(logoPath)
		.resize({ width: 126, withoutEnlargement: true })
		.png()
		.toBuffer();
	const overlay = overlaySvg(page);
	const { plaqueHeight } = getPlaqueMetrics(page);
	const logoTop = page.plaque.y + plaqueHeight - 84;

	await sharp(input)
		.resize(width, height, { fit: 'cover', position: page.position ?? 'center' })
		.composite([
			{ input: overlay, top: 0, left: 0 },
			{ input: logo, top: logoTop, left: page.plaque.x + 34 }
		])
		.jpeg({ quality: 88, mozjpeg: true })
		.toFile(output);

	const metadata = await sharp(output).metadata();
	if (metadata.width !== width || metadata.height !== height) {
		throw new Error(
			`${page.output} must be ${width}x${height}; got ${metadata.width}x${metadata.height}`
		);
	}

	console.log(`Generated static/og/${page.output} (${metadata.width}x${metadata.height})`);
}
