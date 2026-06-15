<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { language, type Language } from '$lib/i18n';
	import heroImage from '$lib/images/operations/4.jpg?enhanced';
	import detailImage from '$lib/images/operations/1.jpg?enhanced';
	import shelfLogo from '$lib/images/branding/shelf-dark-landscape.png';
	import Calendar from 'lucide-svelte/icons/calendar';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import type { PageData } from './$types';

	export let data: PageData;

	type RegularHourPeriod = {
		openDay: string;
		openTime: { hours?: number | null; minutes?: number | null } | null;
		closeTime: { hours?: number | null; minutes?: number | null } | null;
	};

	const directionsUrl =
		'https://www.google.com/maps/dir/?api=1&destination=shelf+beauty+studio,+Yersin,+Ph%C6%B0%E1%BB%9Dng+10,+Dalat,+Lam+Dong&destination_place_id=ChIJHydiEXkTcTERBlm-4kPGIWk';
	const bookingUrl = 'https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+làm+nail+với+ạ';
	const copy = {
		vi: {
			title: 'Shelf Beauty Studio, chăm sóc sắc đẹp tại Đà Lạt',
			description:
				'Shelf Beauty Studio tại Đà Lạt. Đặt lịch làm nail, xem giờ mở cửa, đọc đánh giá, và tìm đường đến studio.',
			eyebrow: 'Chăm sóc nail và làm đẹp tại Đà Lạt',
			heading: 'Chăm sóc sắc đẹp tại Đà Lạt, ấm áp và tỉ mỉ.',
			body: 'Shelf là một studio nhỏ gần Quảng trường Lâm Viên, nơi tụi mình chăm từng chi tiết nail, gội đầu và trải nghiệm thư giãn cho khách địa phương lẫn khách ghé Đà Lạt.',
			book: 'Đặt hẹn',
			bookTitle: 'Đặt hẹn với Shelf Beauty Studio trên Facebook Messenger',
			directions: 'Tìm đường',
			directionsTitle: 'Tìm đường đến Shelf Beauty Studio trên Google Maps',
			statusLabel: 'Trạng thái',
			checking: 'Đang kiểm tra giờ mở cửa hôm nay',
			open: 'Đang mở cửa',
			closed: 'Đang đóng cửa',
			confirm: 'Nhắn tin để tụi mình xác nhận',
			offerLabel: 'Ưu đãi hằng tuần',
			offer: 'Thứ Tư và Thứ Năm, giảm 10% cho một số dịch vụ.',
			locationLabel: 'Địa điểm',
			heroAlt: 'Hoa ly hồng phía trước khu làm dịch vụ của Shelf Beauty Studio',
			detailAlt: 'Khu chờ Shelf Beauty Studio với mẫu nail, hoa và ghế sofa ấm cúng',
			hours: 'Giờ mở cửa',
			hoursSub: 'Cập nhật từ Google Business Profile',
			loadingHours: 'Đang tải giờ mở cửa...',
			timeSeparator: 'đến',
			weeklyOffer: 'Ưu đãi 10%',
			noHours: 'Nhắn tin trước khi ghé để tụi mình xác nhận khung giờ phù hợp nhất.',
			hoursError: 'Tạm thời chưa tải được giờ mở cửa. Nhắn tin để tụi mình xác nhận lịch ghé.'
		},
		en: {
			title: 'Shelf Beauty Studio, Da Lat beauty care',
			description:
				'Shelf Beauty Studio in Da Lat. Book nail and beauty care, check opening hours, read guest notes, and get directions.',
			eyebrow: 'Nail and beauty care in Da Lat',
			heading: 'Beauty care in Da Lat, made warm and careful.',
			body: 'Shelf is a small studio near Lam Vien Square for detailed nail care, hair washing, and calm beauty appointments for local clients and Da Lat visitors.',
			book: 'Book appointment',
			bookTitle: 'Book Shelf Beauty Studio on Facebook Messenger',
			directions: 'Get directions',
			directionsTitle: 'Get directions to Shelf Beauty Studio on Google Maps',
			statusLabel: 'Status',
			checking: 'Checking today’s hours',
			open: 'Open now',
			closed: 'Closed right now',
			confirm: 'Message us to confirm',
			offerLabel: 'Weekly offer',
			offer: 'Wednesday and Thursday, enjoy 10% off selected services.',
			locationLabel: 'Location',
			heroAlt: 'Pink lilies in the foreground with Shelf Beauty Studio service chairs behind them',
			detailAlt: 'Shelf Beauty Studio waiting area with nail samples, flowers, and a warm sofa',
			hours: 'Opening hours',
			hoursSub: 'Updated from Google Business Profile',
			loadingHours: 'Loading opening hours...',
			timeSeparator: 'to',
			weeklyOffer: '10% weekly offer',
			noHours: 'Message us before visiting so we can confirm the best appointment time.',
			hoursError: 'Opening hours are temporarily unavailable. Message us to confirm your visit.'
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

	const formatTime = (time: RegularHourPeriod['openTime'] | undefined) => {
		if (!time?.hours) return $language === 'vi' ? 'Đang cập nhật' : 'Updating';
		const minutes = String(time.minutes ?? 0).padStart(2, '0');
		return `${time.hours}:${minutes}`;
	};

	$: text = copy[$language];

	$: gtag_report_conversion_direction = (url: string) => {
		return reportConversion(env.PUBLIC_GTAG_ID + '/XeK7CPaZ2YUZEJue89oq', url);
	};

	$: gtag_report_conversion_fbmessage = (url: string) => {
		return reportConversion(env.PUBLIC_GTAG_ID + '/mpO0CJ_Jg54ZEJue89oq', url);
	};
</script>

<svelte:head>
	<title>{text.title}</title>
	<meta name="description" content={text.description} />
</svelte:head>

<section
	class="container-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16"
>
	<div class="order-2 lg:order-1">
		<img
			src={shelfLogo}
			alt="Shelf Beauty Studio"
			class="mb-8 w-64 max-w-full dark:brightness-150"
		/>
		<p class="mb-4 max-w-xl text-base font-semibold text-primary">{text.eyebrow}</p>
		<h1 class="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
			{text.heading}
		</h1>
		<p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{text.body}</p>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row">
			<a
				href={bookingUrl}
				class="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
				title={text.bookTitle}
				referrerpolicy="origin"
				target="_blank"
				on:click={() => gtag_report_conversion_fbmessage(bookingUrl)}
			>
				<Calendar class="mr-2 h-5 w-5" aria-hidden="true" />
				{text.book}
			</a>
			<a
				href={directionsUrl}
				class="inline-flex min-h-12 items-center justify-center rounded-md border border-primary/35 bg-background px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
				title={text.directionsTitle}
				referrerpolicy="origin"
				target="_blank"
				on:click={() => gtag_report_conversion_direction('https://shelf.beauty/directions')}
			>
				<MapPin class="mr-2 h-5 w-5" aria-hidden="true" />
				{text.directions}
			</a>
		</div>

		<div class="mt-8 grid gap-3 sm:grid-cols-3">
			<div class="surface-panel p-4">
				<p class="text-sm font-semibold text-foreground">{text.statusLabel}</p>
				{#await data.isOpenPromise}
					<p class="mt-2 text-sm text-muted-foreground">{text.checking}</p>
				{:then isOpen}
					{#if isOpen}
						<p class="mt-2 text-sm font-medium text-shelf_success-700 dark:text-shelf_success-300">
							{text.open}
						</p>
					{:else if isOpen === false}
						<p class="mt-2 text-sm font-medium text-shelf_error-700 dark:text-shelf_error-300">
							{text.closed}
						</p>
					{:else}
						<p class="mt-2 text-sm text-muted-foreground">{text.confirm}</p>
					{/if}
				{/await}
			</div>
			<div class="surface-panel p-4">
				<p class="text-sm font-semibold text-foreground">{text.offerLabel}</p>
				<p class="mt-2 text-sm text-muted-foreground">{text.offer}</p>
			</div>
			<div class="surface-panel p-4">
				<p class="text-sm font-semibold text-foreground">{text.locationLabel}</p>
				<p class="mt-2 text-sm text-muted-foreground">35 Yersin, phường 10, Đà Lạt</p>
			</div>
		</div>
	</div>

	<div class="order-1 lg:order-2">
		<div class="relative overflow-hidden rounded-2xl bg-secondary">
			<enhanced:img
				src={heroImage}
				alt={text.heroAlt}
				loading="eager"
				fetchpriority="high"
				decoding="async"
				sizes="(min-width: 1024px) 48vw, 100vw"
				class="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
			/>
		</div>
	</div>
</section>

<section class="container-shell pb-14 lg:pb-20">
	<div class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
		<div class="surface-panel overflow-hidden">
			<enhanced:img
				src={detailImage}
				alt={text.detailAlt}
				loading="lazy"
				decoding="async"
				sizes="(min-width: 1024px) 36vw, 100vw"
				class="h-full min-h-80 w-full object-cover"
			/>
		</div>

		<div class="surface-panel p-6 sm:p-8">
			<div class="mb-6 flex items-center gap-3">
				<span
					class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground"
				>
					<Sparkles class="h-5 w-5" aria-hidden="true" />
				</span>
				<div>
					<h2 class="text-2xl font-semibold tracking-tight text-foreground">{text.hours}</h2>
					<p class="text-sm text-muted-foreground">{text.hoursSub}</p>
				</div>
			</div>

			{#await data.regularHourPeriodsPromise}
				<p class="text-muted-foreground">{text.loadingHours}</p>
			{:then periods}
				{#if periods?.length}
					<div class="overflow-hidden rounded-xl border border-border/80 bg-background/60">
						{#each periods as period (period.openDay)}
							<div
								class="flex min-h-16 flex-col justify-center gap-2 border-b border-border/70 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
							>
								<div class="flex min-w-0 items-center gap-2">
									<p class="font-medium text-foreground">{period.openDay}</p>
									{#if period.openDay === 'Thứ Tư (Wed)' || period.openDay === 'Thứ Năm (Thu)'}
										<span
											class="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
										>
											{text.weeklyOffer}
										</span>
									{/if}
								</div>
								<p class="text-sm text-muted-foreground sm:text-right">
									{formatTime(period.openTime)}
									{text.timeSeparator}
									{formatTime(period.closeTime)}
								</p>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-muted-foreground">{text.noHours}</p>
				{/if}
			{:catch}
				<p class="text-muted-foreground">{text.hoursError}</p>
			{/await}
		</div>
	</div>
</section>
