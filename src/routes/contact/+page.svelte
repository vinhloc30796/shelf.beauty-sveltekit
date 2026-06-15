<script lang="ts">
	import { env } from '$env/dynamic/public';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { language, type Language } from '$lib/i18n';
	import { socialImages } from '$lib/seo';
	import shelfLogo from '$lib/images/branding/shelf-dark-landscape.png';
	import studioImage from '$lib/images/operations/10.jpg?enhanced';
	import Clock from 'lucide-svelte/icons/clock';
	import Facebook from 'lucide-svelte/icons/facebook';
	import Instagram from 'lucide-svelte/icons/instagram';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import MessageCircle from 'lucide-svelte/icons/message-circle';

	const mapUrl =
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.4751651773076!2d108.4492590764347!3d11.941568188287144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317113791162271f%3A0x6921c643e2be5906!2sshelf%20beauty%20studio!5e0!3m2!1sen!2s!4v1716794660375!5m2!1sen!2s';
	const directionsUrl =
		'https://www.google.com/maps/dir/?api=1&destination=shelf+beauty+studio,+Yersin,+Ph%C6%B0%E1%BB%9Dng+10,+Dalat,+Lam+Dong&destination_place_id=ChIJHydiEXkTcTERBlm-4kPGIWk';
	const bookingUrl = 'https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+làm+nail+với+ạ';
	const copy = {
		vi: {
			title: 'Ghé Shelf Beauty Studio tại Đà Lạt',
			description:
				'Tìm Shelf Beauty Studio tại 35 Yersin, phường 10, Đà Lạt. Tìm đường, nhắn tin đặt lịch, và theo dõi Shelf trên mạng xã hội.',
			eyebrow: 'Đến Shelf như thế nào',
			heading: 'Ghé Shelf, cách Quảng trường Lâm Viên vài phút đi bộ.',
			body: 'Studio nằm tại 35 Yersin, phường 10, Đà Lạt. Nhắn tin trước khi ghé để tụi mình giữ lịch phù hợp và chuẩn bị dịch vụ cho bạn.',
			directions: 'Tìm đường',
			directionsTitle: 'Tìm đường đến Shelf Beauty Studio trên Google Maps',
			book: 'Nhắn tin đặt lịch',
			bookTitle: 'Đặt hẹn với Shelf Beauty Studio trên Facebook Messenger',
			address: 'Địa chỉ',
			beforeVisit: 'Trước khi ghé',
			beforeVisitBody: 'Nhắn tin để tụi mình xác nhận khung giờ phù hợp, nhất là cuối tuần.',
			imageAlt: 'Chi tiết một bộ móng tại Shelf Beauty Studio',
			mapTitle: 'Bản đồ vị trí Shelf Beauty Studio'
		},
		en: {
			title: 'Visit Shelf Beauty Studio in Da Lat',
			description:
				'Find Shelf Beauty Studio at 35 Yersin, phường 10, Da Lat. Get directions, message to book, and follow Shelf on social media.',
			eyebrow: 'How to visit Shelf',
			heading: 'Visit Shelf, five quiet minutes from Lam Vien Square.',
			body: 'The studio is at 35 Yersin, phường 10, Da Lat. Message before visiting so we can hold the right appointment time and prepare your service.',
			directions: 'Get directions',
			directionsTitle: 'Get directions to Shelf Beauty Studio on Google Maps',
			book: 'Message to book',
			bookTitle: 'Book Shelf Beauty Studio on Facebook Messenger',
			address: 'Address',
			beforeVisit: 'Before you visit',
			beforeVisitBody: 'Message us to confirm the best appointment time, especially on weekends.',
			imageAlt: 'A manicure detail at Shelf Beauty Studio',
			mapTitle: 'Shelf Beauty Studio location map'
		}
	} satisfies Record<Language, Record<string, string>>;
	const reportConversion = (sendTo: string, url: string) => {
		if (typeof window !== 'undefined' && 'gtag' in window) {
			(window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'conversion', {
				send_to: sendTo,
				event_callback: () => {
					if (url) {
						window.location.href = url;
					}
				}
			});
		}
		return false;
	};

	$: text = copy[$language];

	$: gtag_report_conversion_direction = (url: string) => {
		return reportConversion(env.PUBLIC_GTAG_ID + '/XeK7CPaZ2YUZEJue89oq', url);
	};
</script>

<SeoHead
	title={text.title}
	description={text.description}
	path="/contact"
	image={socialImages.contact}
/>

<section class="container-shell grid gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
	<div>
		<img
			src={shelfLogo}
			alt="Shelf Beauty Studio"
			class="mb-8 w-56 max-w-full dark:brightness-150"
		/>
		<p class="mb-4 font-semibold text-primary">{text.eyebrow}</p>
		<h1 class="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
			{text.heading}
		</h1>
		<p class="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{text.body}</p>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row">
			<a
				href={directionsUrl}
				class="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
				title={text.directionsTitle}
				referrerpolicy="origin"
				target="_blank"
				on:click={() => gtag_report_conversion_direction('https://shelf.beauty/directions')}
			>
				<MapPin class="mr-2 h-5 w-5" aria-hidden="true" />
				{text.directions}
			</a>
			<a
				href={bookingUrl}
				class="inline-flex min-h-12 items-center justify-center rounded-md border border-primary/35 bg-background px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
				title={text.bookTitle}
				referrerpolicy="origin"
				target="_blank"
			>
				<MessageCircle class="mr-2 h-5 w-5" aria-hidden="true" />
				{text.book}
			</a>
		</div>

		<div class="mt-8 grid gap-4 sm:grid-cols-2">
			<div class="surface-panel p-5">
				<MapPin class="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
				<h2 class="text-base font-semibold text-foreground">{text.address}</h2>
				<p class="mt-2 text-sm leading-6 text-muted-foreground">
					35 Yersin, phường 10, Đà Lạt, Lâm Đồng
				</p>
			</div>
			<div class="surface-panel p-5">
				<Clock class="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
				<h2 class="text-base font-semibold text-foreground">{text.beforeVisit}</h2>
				<p class="mt-2 text-sm leading-6 text-muted-foreground">{text.beforeVisitBody}</p>
			</div>
		</div>
	</div>

	<div class="grid gap-5">
		<div class="overflow-hidden rounded-2xl bg-secondary">
			<enhanced:img
				src={studioImage}
				alt={text.imageAlt}
				loading="eager"
				decoding="async"
				sizes="(min-width: 1024px) 48vw, 100vw"
				class="aspect-[4/3] w-full object-cover"
			/>
		</div>
		<div class="surface-panel overflow-hidden">
			<iframe
				title={text.mapTitle}
				src={mapUrl}
				class="aspect-[4/3] w-full"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	</div>
</section>

<section class="container-shell pb-16">
	<div class="surface-panel grid gap-5 p-6 sm:grid-cols-3 sm:p-8">
		<a
			href="https://facebook.com/shelfbeautystudio"
			class="group rounded-xl border border-border/70 bg-background/60 p-5 transition-colors hover:bg-secondary/70"
			target="_blank"
			rel="noreferrer"
			aria-label="Facebook, shelfbeautystudio"
		>
			<Facebook class="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
			<p class="font-semibold text-foreground">Facebook</p>
			<p class="mt-1 text-sm text-muted-foreground">@shelfbeautystudio</p>
		</a>
		<a
			href="https://instagram.com/shelfbeautystudio"
			class="group rounded-xl border border-border/70 bg-background/60 p-5 transition-colors hover:bg-secondary/70"
			target="_blank"
			rel="noreferrer"
			aria-label="Instagram, shelfbeautystudio"
		>
			<Instagram class="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
			<p class="font-semibold text-foreground">Instagram</p>
			<p class="mt-1 text-sm text-muted-foreground">@shelfbeautystudio</p>
		</a>
		<a
			href="https://tiktok.com/@shelfbeautystudio"
			class="group rounded-xl border border-border/70 bg-background/60 p-5 transition-colors hover:bg-secondary/70"
			target="_blank"
			rel="noreferrer"
			aria-label="TikTok, shelfbeautystudio"
		>
			<MessageCircle class="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
			<p class="font-semibold text-foreground">TikTok</p>
			<p class="mt-1 text-sm text-muted-foreground">@shelfbeautystudio</p>
		</a>
	</div>
</section>
