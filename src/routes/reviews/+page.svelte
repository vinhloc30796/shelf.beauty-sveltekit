<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { language, type Language } from '$lib/i18n';
	import shelfLogo from '$lib/images/branding/shelf-dark-landscape.png';
	import reviewImage from '$lib/images/operations/7.jpg?enhanced';
	import { formatReviewTimestamp } from '$lib/reviewDates';
	import type { PublicGoogleReview, PublicGoogleReviewsPage } from '$lib/server/googleReviews';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Star from 'lucide-svelte/icons/star';
	import type { PageData } from './$types';

	export let data: PageData;

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
			googleLinkTitle: 'Xem tất cả đánh giá Shelf Beauty Studio trên Google Maps',
			loadMore: 'Tải thêm đánh giá',
			loading: 'Đang tải...',
			reviewsUnavailable: 'Chưa tải được thêm đánh giá Google. Vui lòng thử lại sau.',
			ratingOnly: 'Khách để lại đánh giá sao trên Google.',
			ratingSummary: 'Điểm Google {rating} từ {count} đánh giá'
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
			googleLinkTitle: 'View all Shelf Beauty Studio reviews on Google Maps',
			loadMore: 'Load more reviews',
			loading: 'Loading...',
			reviewsUnavailable: 'More Google reviews are unavailable right now. Please try again later.',
			ratingOnly: 'Guest left a star rating on Google.',
			ratingSummary: 'Google rating {rating} from {count} reviews'
		}
	} satisfies Record<Language, Record<string, string>>;
	let reviews: PublicGoogleReview[] = data.reviews;
	let averageRating = data.averageRating;
	let totalReviewCount = data.totalReviewCount;
	let nextPageToken = data.nextPageToken;
	let isLoadingMore = false;
	let loadMoreError = false;

	const formatRating = (rating?: number) => (rating ? rating.toFixed(1) : '');
	const formatRatingSummary = (template: string) =>
		template
			.replace('{rating}', formatRating(averageRating))
			.replace('{count}', String(totalReviewCount ?? reviews.length));
	const isFeaturedReview = (index: number) => index % 7 === 0;
	const reviewTimestamp = (review: PublicGoogleReview, lang: Language) =>
		formatReviewTimestamp(review.updateTime ?? review.createTime, lang);
	const reviewCardClass = (index: number) =>
		isFeaturedReview(index)
			? 'mb-5 inline-block w-full break-inside-avoid rounded-xl bg-primary p-6 text-primary-foreground'
			: 'mb-5 inline-block w-full break-inside-avoid rounded-xl border border-border/80 bg-card p-5 text-card-foreground transition-colors hover:border-primary/40';

	const appendReviews = (page: PublicGoogleReviewsPage) => {
		const existingIds = new Set(reviews.map((review) => review.id));
		reviews = [...reviews, ...page.reviews.filter((review) => !existingIds.has(review.id))];
		averageRating = page.averageRating ?? averageRating;
		totalReviewCount = page.totalReviewCount ?? totalReviewCount;
		nextPageToken = page.nextPageToken;
	};

	const loadMoreReviews = async () => {
		if (!nextPageToken || isLoadingMore) return;

		isLoadingMore = true;
		loadMoreError = false;
		try {
			const response = await fetch(
				`/api/google-reviews?pageToken=${encodeURIComponent(nextPageToken)}`
			);
			if (!response.ok) {
				throw new Error('Failed to load more Google reviews');
			}
			appendReviews((await response.json()) as PublicGoogleReviewsPage);
		} catch (error) {
			console.error(error);
			loadMoreError = true;
		} finally {
			isLoadingMore = false;
		}
	};
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
	{#if averageRating && totalReviewCount}
		<p class="mb-5 text-sm font-semibold text-primary">
			{formatRatingSummary(text.ratingSummary)}
		</p>
	{/if}
	<div class="columns-1 gap-5 md:columns-2 xl:columns-3">
		{#each reviews as review, i (review.id)}
			<article class={reviewCardClass(i)}>
				<div
					class={`mb-5 flex gap-1 ${isFeaturedReview(i) ? 'text-primary-foreground/90' : 'text-primary'}`}
					aria-label="{review.stars} star review"
				>
					{#each fiveStars.slice(0, review.stars) as star (star)}
						<Star class="h-4 w-4 fill-current" aria-hidden="true" />
					{/each}
				</div>
				<blockquote
					class={`${isFeaturedReview(i) ? 'text-xl leading-8' : 'text-base leading-7'} text-pretty`}
				>
					“{review.quote || text.ratingOnly}”
				</blockquote>
				<div
					class={`mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm ${
						isFeaturedReview(i) ? 'text-primary-foreground/80' : 'text-muted-foreground'
					}`}
				>
					<p
						class={`font-semibold ${isFeaturedReview(i) ? 'text-primary-foreground' : 'text-primary'}`}
					>
						{review.name}
					</p>
					{#if reviewTimestamp(review, $language)}
						<time datetime={review.updateTime ?? review.createTime}>
							{reviewTimestamp(review, $language)}
						</time>
					{/if}
				</div>
			</article>
		{/each}
	</div>
	{#if nextPageToken}
		<div class="mt-8 flex justify-center">
			<button
				type="button"
				class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-70"
				disabled={isLoadingMore}
				on:click={loadMoreReviews}
			>
				{#if isLoadingMore}
					<LoaderCircle class="h-4 w-4 animate-spin" aria-hidden="true" />
					{text.loading}
				{:else}
					{text.loadMore}
				{/if}
			</button>
		</div>
	{/if}
	{#if loadMoreError}
		<p class="mt-4 text-center text-sm text-destructive">{text.reviewsUnavailable}</p>
	{/if}
	<div class="mt-8 grid">
		<div class="rounded-xl bg-primary p-6 text-primary-foreground md:mx-auto md:max-w-2xl">
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
