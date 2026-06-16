import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'static', 'og');
const logoPath = path.join(root, 'src/lib/images/branding/shelf-dark-landscape.png');

const width = 1200;
const height = 630;
const panelWidth = 470;
const dividerWidth = 12;
const photoX = panelWidth + dividerWidth;
const photoWidth = width - photoX;

const colors = {
	cream: '#EAE1C9',
	ink: '#1F120E',
	rust: '#8B3C22',
	turquoise: '#51BCBF',
	white: '#FFF8EE',
	softCream: '#F6EEDB'
};

const textStyles = {
	title: { size: 52, lineHeight: 58, weight: 800 },
	subtitle: { size: 25, lineHeight: 33, weight: 650 }
};

const logo = {
	width: 280,
	height: 140,
	x: 58,
	y: 58
};

const pages = [
	{
		source: 'src/lib/images/operations/4.jpg',
		output: 'home.jpg',
		position: 'south',
		titleLines: ['Shelf Beauty', 'Studio'],
		subtitleLines: ['Nail and beauty care', 'in Da Lat']
	},
	{
		source: 'src/lib/images/operations/9.jpg',
		output: 'reviews.jpg',
		position: 'center',
		titleLines: ['Khách nói gì', 'về Shelf'],
		subtitleLines: ['Cảm nhận thật từ', 'khách ghé studio']
	},
	{
		source: 'src/lib/images/operations/3.jpg',
		output: 'contact.jpg',
		position: 'north',
		titleLines: ['Ghé Shelf tại', 'Đà Lạt'],
		subtitleLines: ['35 Yersin, phường 10']
	}
];

const escapeXml = (value) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');

const renderTextLines = (
	lines,
	x,
	y,
	{ size, lineHeight, weight },
	fill,
	opacity = 1,
	extraAttributes = ''
) =>
	lines
		.map(
			(line, index) =>
				`<text x="${x}" y="${
					y + index * lineHeight
				}" font-size="${size}" font-weight="${weight}" opacity="${opacity}" fill="${fill}" ${extraAttributes}>${escapeXml(
					line
				)}</text>`
		)
		.join('');

const overlaySvg = (page) => {
	const contentX = 58;
	const titleY = 320;
	const subtitleY = titleY + page.titleLines.length * textStyles.title.lineHeight + 22;

	return Buffer.from(`
		<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="photo-tone" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stop-color="${colors.ink}" stop-opacity="0.12"/>
					<stop offset="54%" stop-color="${colors.rust}" stop-opacity="0.03"/>
					<stop offset="100%" stop-color="${colors.ink}" stop-opacity="0.2"/>
				</linearGradient>
			</defs>
			<rect x="0" y="0" width="${panelWidth}" height="${height}" fill="${colors.cream}"/>
			<path d="M0 0H${panelWidth}V${height}H0Z" fill="${colors.white}" opacity="0.22"/>
			<circle cx="386" cy="88" r="132" fill="${colors.rust}" opacity="0.08"/>
			<circle cx="74" cy="560" r="180" fill="${colors.turquoise}" opacity="0.1"/>
			<rect x="${photoX}" y="0" width="${photoWidth}" height="${height}" fill="url(#photo-tone)"/>
			<rect x="${panelWidth}" y="0" width="${dividerWidth}" height="${height}" fill="${colors.rust}"/>
			<rect x="${panelWidth + dividerWidth - 3}" y="0" width="3" height="${height}" fill="${colors.turquoise}"/>
			<line x1="${contentX}" y1="238" x2="${contentX + 198}" y2="238" stroke="${colors.turquoise}" stroke-width="5" stroke-linecap="round"/>
			<g font-family="Arial, Helvetica, 'DejaVu Sans', sans-serif">
				${renderTextLines(page.titleLines, contentX, titleY, textStyles.title, colors.ink)}
				${renderTextLines(page.subtitleLines, contentX, subtitleY, textStyles.subtitle, colors.rust, 0.92)}
			</g>
		</svg>
	`);
};

await mkdir(outputDir, { recursive: true });

for (const page of pages) {
	const input = path.join(root, page.source);
	const output = path.join(outputDir, page.output);
	const logoImage = await sharp(logoPath)
		.resize({ width: logo.width, withoutEnlargement: true })
		.png()
		.toBuffer();
	const photo = await sharp(input)
		.resize(photoWidth, height, { fit: 'cover', position: page.position })
		.jpeg({ quality: 94, mozjpeg: true })
		.toBuffer();
	const overlay = overlaySvg(page);

	await sharp({
		create: {
			width,
			height,
			channels: 4,
			background: colors.cream
		}
	})
		.composite([
			{ input: photo, top: 0, left: photoX },
			{ input: overlay, top: 0, left: 0 },
			{ input: logoImage, top: logo.y, left: logo.x }
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
