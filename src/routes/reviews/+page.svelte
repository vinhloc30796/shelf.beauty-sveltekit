<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { language, type Language } from '$lib/i18n';
	import shelfLogo from '$lib/images/branding/shelf-dark-landscape.png';
	import reviewImage from '$lib/images/operations/7.jpg?enhanced';
	import Star from 'lucide-svelte/icons/star';

	const fiveStars = [0, 1, 2, 3, 4];
	const copy = {
		vi: {
			title: 'Đánh giá, Shelf Beauty Studio',
			description: 'Đọc cảm nhận của khách và đánh giá Google của Shelf Beauty Studio tại Đà Lạt.',
			eyebrow: 'Khách nói gì về Shelf',
			heading: 'Lời nhắn từ khách của Shelf sau những buổi hẹn tỉ mỉ.',
			body: 'Đánh giá giúp khách mới biết điều khách quen đã nhận ra: sự chào đón ấm áp, cách làm kiên nhẫn, và một studio nhỏ có cảm giác rất riêng.',
			imageAlt: 'Một bộ móng hoàn thiện tại Shelf Beauty Studio',
			googleTitle: 'Còn nhiều đánh giá khác trên Google Maps.',
			googleBody:
				'Xem thêm đánh giá mới nhất, hình ảnh thực tế, và cảm nhận từ khách đã ghé Shelf.',
			googleCta: 'Xem tất cả đánh giá Google',
			googleLinkTitle: 'Xem tất cả đánh giá Shelf Beauty Studio trên Google Maps'
		},
		en: {
			title: 'Guest notes, Shelf Beauty Studio reviews',
			description: 'Read guest notes and Google reviews for Shelf Beauty Studio in Da Lat.',
			eyebrow: 'What guests say about Shelf',
			heading: 'Guest notes from careful, cozy appointments.',
			body: 'Reviews help visitors know what locals already recognize: warm welcome, patient detail, and meticulous service in a studio that feels personal.',
			imageAlt: 'A finished manicure at Shelf Beauty Studio',
			googleTitle: 'More guest notes live on Google Maps.',
			googleBody: 'See newer reviews, real photos, and notes from guests who have visited Shelf.',
			googleCta: 'View all Google reviews',
			googleLinkTitle: 'View all Shelf Beauty Studio reviews on Google Maps'
		}
	} satisfies Record<Language, Record<string, string>>;
	const reviews = [
		{
			stars: 5,
			name: 'Nguyen Ngoc Tu Tu',
			quote:
				'Mình đi du lịch tiện ghé vào làm, mà tiệm nail rất xinh nha mụi ngừ, có 2 em cún cũng thân thiện lứm. Giá cả ok, dịch vụ ok lun. Highly recommended.'
		},
		{
			stars: 5,
			name: 'Thư Nguyễn',
			quote:
				'Mấy bạn nhân viên rất dễ thương, nhiệt tình lắm ạ. Mình làm ở đây 2 lần rồi, lần sau sẽ ủng hộ lại nè. Mấy bạn làm rất kỹ luôn ạ.'
		},
		{
			stars: 5,
			name: 'Julia Larson',
			quote:
				'Fabulous attention to detail and service from my nail tech. They made sure to ask questions and make sure you are getting exactly the nails you would like.'
		},
		{
			stars: 5,
			name: 'Bryan Tan',
			quote:
				'Shelf Beauty Studio was absolutely amazing. The staff were skilled, meticulous, accommodating, and patient even with elaborate designs.'
		},
		{
			stars: 5,
			name: 'Tam Mii따미',
			quote:
				'Tiệm gội đầu nhỏ nhỏ xinh xinh, giá siêu bình dân, các bạn nhân viên rất nhiệt tình dễ thương. Nhất định sẽ quay lại mỗi dịp lên Đà Lạt chơi.'
		}
	];
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

	$: gtag_report_conversion_reviews = (url: string) => {
		return reportConversion(env.PUBLIC_GTAG_ID + '/Ww1qCPSC5bMZEJue89oq', url);
	};
</script>

<svelte:head>
	<title>{text.title}</title>
	<meta name="description" content={text.description} />
</svelte:head>

<section class="container-shell grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:py-16">
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
	</div>
	<div class="overflow-hidden rounded-2xl bg-secondary">
		<enhanced:img
			src={reviewImage}
			alt={text.imageAlt}
			loading="eager"
			decoding="async"
			sizes="(min-width: 1024px) 48vw, 100vw"
			class="aspect-[4/3] w-full object-cover"
		/>
	</div>
</section>

<section class="container-shell pb-16">
	<div class="grid gap-5 md:grid-cols-2 lg:gap-6">
		{#each reviews as review, i (review.name)}
			<article
				class={`rounded-2xl border border-border/80 bg-card p-6 ${
					i === 2 ? 'md:row-span-2 md:flex md:flex-col md:justify-center' : ''
				}`}
			>
				<div class="mb-5 flex gap-1 text-primary" aria-label="{review.stars} star review">
					{#each fiveStars.slice(0, review.stars) as star (star)}
						<Star class="h-4 w-4 fill-current" aria-hidden="true" />
					{/each}
				</div>
				<blockquote class="text-base leading-7 text-foreground">“{review.quote}”</blockquote>
				<p class="mt-5 text-sm font-semibold text-primary">{review.name}</p>
			</article>
		{/each}
		<div
			class="rounded-2xl bg-primary p-6 text-primary-foreground md:col-span-2 lg:mx-auto lg:max-w-2xl"
		>
			<p class="text-2xl font-semibold tracking-tight">{text.googleTitle}</p>
			<p class="mt-4 text-sm leading-6 text-primary-foreground/85">{text.googleBody}</p>
			<a
				href="https://www.google.com/maps/place/shelf+beauty+studio/@11.9415682,108.4492591,17z/data=!4m18!1m9!3m8!1s0x317113791162271f:0x6921c643e2be5906!2sshelf+beauty+studio!8m2!3d11.9415682!4d108.451834!9m1!1b1!16s%2Fg%2F11s8wb0ng4!3m7!1s0x317113791162271f:0x6921c643e2be5906!8m2!3d11.9415682!4d108.451834!9m1!1b1!16s%2Fg%2F11s8wb0ng4?entry=ttu"
				class="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
				title={text.googleLinkTitle}
				referrerpolicy="no-referrer"
				target="_blank"
				on:click={() => gtag_report_conversion_reviews('https://shelf.beauty/reviews')}
			>
				{text.googleCta}
			</a>
		</div>
	</div>
</section>
