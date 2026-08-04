<script lang="ts">
	import { page } from '$app/stores';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { type Language } from '$lib/i18n';
	import menuImage from '$lib/images/operations/8.jpg?enhanced';
	import { formatMenuPrice, serviceMenu } from '$lib/menu/menu';
	import { buildServiceMenuJsonLd } from '$lib/menu/seo';
	import { buildJsonLdScript, socialImages } from '$lib/seo';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Sparkles from 'lucide-svelte/icons/sparkles';

	const bookingUrl = 'https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+với+ạ';
	const copy = {
		vi: {
			title: 'Dịch vụ và bảng giá',
			seoTitle: 'Bảng giá dịch vụ nail và làm đẹp tại Đà Lạt | Shelf',
			seoDescription:
				'Xem dịch vụ và bảng giá nail, nối mi, chăm sóc da, gội đầu tại Shelf Beauty Studio, Đà Lạt.',
			intro:
				'Từ chăm sóc móng tỉ mỉ đến nối mi, chăm sóc da và gội đầu thư giãn, chọn dịch vụ phù hợp cho lần ghé Shelf tiếp theo.',
			note: 'Giá cuối cùng có thể thay đổi theo độ dài, mẫu thiết kế và tình trạng thực tế. Tụi mình sẽ xác nhận trước khi làm.',
			categories: 'Xem nhanh theo dịch vụ',
			includes: 'Bao gồm',
			book: 'Đặt hẹn với Shelf',
			bookBody: 'Gửi mẫu hoặc dịch vụ bạn quan tâm để tụi mình tư vấn và giữ lịch.',
			heroAlt: 'Bảng mẫu nail và không gian xanh phía trước Shelf Beauty Studio'
		},
		en: {
			title: 'Services and prices',
			seoTitle: 'Nail and beauty service prices in Da Lat | Shelf',
			seoDescription:
				'Explore nail, eyelash, skin care, and shampoo services and prices at Shelf Beauty Studio in Da Lat.',
			intro:
				'From careful nail work to eyelashes, skin care, and relaxing shampoo services, find the right treatment for your next visit to Shelf.',
			note: 'Final prices may vary with length, design complexity, and current condition. We will confirm the price before starting.',
			categories: 'Browse by service',
			includes: 'Includes',
			book: 'Book with Shelf',
			bookBody:
				'Send us a reference or the service you want so we can advise you and reserve a time.',
			heroAlt: 'Nail sample display and greenery outside Shelf Beauty Studio'
		}
	} satisfies Record<Language, Record<string, string>>;

	$: currentLanguage = $page.params.lang as Language;
	$: text = copy[currentLanguage];
	$: serviceMenuJsonLd = buildServiceMenuJsonLd(serviceMenu, currentLanguage);
</script>

<SeoHead
	title={text.seoTitle}
	description={text.seoDescription}
	path={`/${currentLanguage}/services`}
	image={socialImages.home}
/>
<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD is escaped by buildJsonLdScript -->
	{@html buildJsonLdScript(serviceMenuJsonLd)}
</svelte:head>

<section
	class="container-shell grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16"
>
	<div>
		<div
			class="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground"
		>
			<Sparkles class="h-5 w-5" aria-hidden="true" />
		</div>
		<h1 class="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
			{text.title}
		</h1>
		<p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{text.intro}</p>
		<p class="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">{text.note}</p>
	</div>

	<div class="overflow-hidden rounded-2xl bg-secondary">
		<enhanced:img
			src={menuImage}
			alt={text.heroAlt}
			loading="eager"
			fetchpriority="high"
			decoding="async"
			sizes="(min-width: 1024px) 44vw, 100vw"
			class="aspect-[5/4] w-full object-cover"
		/>
	</div>
</section>

<nav
	class="sticky top-20 z-30 border-y border-border/80 bg-background/95 backdrop-blur"
	aria-label={text.categories}
>
	<div class="container-shell flex gap-2 overflow-x-auto py-3">
		{#each serviceMenu.categories as category}
			<a
				href={`#${category.id}`}
				class="shrink-0 rounded-full border border-primary/25 bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
			>
				{category.name[currentLanguage]}
			</a>
		{/each}
	</div>
</nav>

<div class="container-shell py-10 lg:py-16">
	<div class="mx-auto max-w-5xl space-y-14 lg:space-y-20">
		{#each serviceMenu.categories as category, categoryIndex}
			<section id={category.id} class="scroll-mt-40" aria-labelledby={`${category.id}-title`}>
				<div class="mb-5 flex items-end justify-between gap-5 border-b border-primary/30 pb-4">
					<h2
						id={`${category.id}-title`}
						class="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
					>
						{category.name[currentLanguage]}
					</h2>
					<span class="text-sm font-semibold tabular-nums text-primary" aria-hidden="true">
						{String(categoryIndex + 1).padStart(2, '0')}
					</span>
				</div>

				<ul class="divide-y divide-border/70">
					{#each category.services as service}
						<li class="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8">
							<div class="min-w-0">
								<h3 class="text-base font-semibold leading-6 text-foreground sm:text-lg">
									{service.name[currentLanguage]}
								</h3>
								{#if service.description}
									<p class="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
										{service.description[currentLanguage]}
									</p>
								{/if}
								{#if service.inclusions?.length}
									<p class="mt-2 text-xs font-semibold text-primary">{text.includes}</p>
									<ul
										class="mt-1 flex max-w-3xl flex-wrap gap-x-2 text-sm leading-6 text-muted-foreground"
									>
										{#each service.inclusions as inclusion, index}
											<li>
												{inclusion[currentLanguage]}{index < service.inclusions.length - 1
													? ','
													: ''}
											</li>
										{/each}
									</ul>
								{/if}
							</div>
							<p class="shrink-0 font-semibold tabular-nums text-primary sm:text-right">
								{formatMenuPrice(service.price, currentLanguage)}
							</p>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>

<section class="container-shell pb-14 lg:pb-20">
	<div
		class="mx-auto flex max-w-5xl flex-col gap-5 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8"
	>
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">{text.book}</h2>
			<p class="mt-2 max-w-2xl leading-7 text-primary-foreground/85">{text.bookBody}</p>
		</div>
		<a
			href={bookingUrl}
			target="_blank"
			referrerpolicy="origin"
			class="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
		>
			<Calendar class="mr-2 h-5 w-5" aria-hidden="true" />
			{text.book}
		</a>
	</div>
</section>
