<script lang="ts">
	// Environment variables
	// https://kit.svelte.dev/docs/modules#$env-dynamic-private
	import { env } from '$env/dynamic/public';
	// Images: branding
	import shelf_dark from '$lib/images/branding/shelf-dark-landscape.png';
	import shelf_light from '$lib/images/branding/shelf-light-landscape.png';
	// Images: logo
	import image_1 from '$lib/images/operations/1.jpg';
	import image_2 from '$lib/images/operations/2.jpg';
	import image_3 from '$lib/images/operations/3.jpg';
	import image_4 from '$lib/images/operations/4.jpg';
	import image_5 from '$lib/images/operations/5.jpg';
	import image_6 from '$lib/images/operations/6.jpg';
	import image_7 from '$lib/images/operations/7.jpg';
	import image_8 from '$lib/images/operations/8.jpg';
	import image_9 from '$lib/images/operations/9.jpg';
	// Icons
	import { Calendar, ThickArrowRight } from 'svelte-radix';
	// Typography
	import H1 from '$lib/components/typography/h1.svelte';
	import H2 from '$lib/components/typography/h2.svelte';
	import H4 from '$lib/components/typography/h4.svelte';
	import Muted from '$lib/components/typography/muted.svelte';
	import P from '$lib/components/typography/p.svelte';
	// Components
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Card from '$lib/components/ui/card/index.js';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	// Data
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	export let data: PageData;

	// isOpen
	export let isOpen: boolean | null = null;
	$: (async () => {
		if (data.isOpenPromise) {
			try {
				isOpen = await data.isOpenPromise;
				console.log('Store is open?:', isOpen);
			} catch (error) {
				console.error('Error loading store status:', error);
			}
		}
	})();

	// regularHourPeriodsVN
	let periodCarouselApi: CarouselAPI;
	type RegularHourPeriod = {
		openDay: string;
		openTime: any;
		closeTime: any;
	};

	export let regularHourPeriodsVN: RegularHourPeriod[] = [];
	let periodCount = 0;
	let periodCurrent = 0;

	$: (async () => {
		if (data.regularHourPeriodsPromise) {
			try {
				const periods = await data.regularHourPeriodsPromise;
				regularHourPeriodsVN = periods || [];
			} catch (error) {
				console.error('Error loading regular hours:', error);
			}
		}
	})();

	$: if (periodCarouselApi) {
		periodCount = periodCarouselApi.scrollSnapList().length;
		periodCurrent = periodCarouselApi.selectedScrollSnap() + 1;
		periodCarouselApi.on('select', () => {
			periodCurrent = periodCarouselApi.selectedScrollSnap() + 1;
		});
	}

	// Images
	let images = [image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8, image_9];
	let imageCarouselApi: CarouselAPI;
	let imageCount = 0;
	let imageCurrent = 0;

	$: if (imageCarouselApi) {
		imageCount = imageCarouselApi.scrollSnapList().length;
		imageCurrent = imageCarouselApi.selectedScrollSnap() + 1;
		imageCarouselApi.on('select', () => {
			imageCurrent = imageCarouselApi.selectedScrollSnap() + 1;
		});
	}

	// Event snippet for Get directions conversion page
	// In your html page, add the snippet and call gtag_report_conversion
	// - when someone clicks on the chosen link or button.
	$: gtag_report_conversion_direction = (url: string) => {
		// @ts-ignore
		window.gtag('event', 'conversion', {
			send_to: env.PUBLIC_GTAG_ID + '/XeK7CPaZ2YUZEJue89oq',
			event_callback: () => {
				if (url) {
					window.location;
				}
			}
		});
		return false;
	};

	$: gtag_report_conversion_fbmessage = (url: string) => {
		// @ts-ignore
		window.gtag('event', 'conversion', {
			send_to: env.PUBLIC_GTAG_ID + '/mpO0CJ_Jg54ZEJue89oq',
			event_callback: () => {
				if (url) {
					window.location;
				}
			}
		});
		return false;
	};
</script>

<svelte:head>
	<title>Shelf Beauty Studio - 🏡 Trang Chủ</title>
	<meta name="description" content="Shelf Beauty Studio - 🏡 Trang Chủ" />
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-12rem)] max-w-1/2">
	<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 h-auto" id="hero">
		<section class="flex flex-col mx-16 justify-center items-center col-span-1" id="hero-desc">
			<!-- Logo -->
			<span class="flex w-full my-4">
				<picture>
					<img src={shelf_dark} alt="Shelf Beauty Studio - Welcome" class="dark:hidden" />
					<img src={shelf_light} alt="Shelf Beauty Studio - Welcome" class="hidden dark:block" />
				</picture>
			</span>
			<!-- Description -->
			<div class="my-4">
				<H1 class="mt-4">Trải nghiệm làm đẹp tại Đà Lạt</H1>
				<P>
					Shelf Beauty Studio là một không gian làm đẹp chuyên nghiệp, nơi bạn có thể tìm thấy sự
					yên bình và thoải mái.
				</P>
				<P>
					Tụi mình
					<span class="text-amber-600 dark:text-yellow-500"> giảm giá 10% ⭐ </span>
					vào Thứ Tư & Thứ Năm hàng tuần.
					{#await data.isOpenPromise}
						Hãy cảm nhận sự khác biệt!
					{:then}
						<!-- Show the status of the store -->
						{#if isOpen}
							<!-- Check if isOpen is true, add green, open -->
							Tụi mình <span class=" text-green-500">đang mở cửa!</span>
							Hãy đến và cảm nhận sự khác biệt!
						{:else if isOpen === false}
							<!-- Else if false, then red, closed -->
							Tụi mình <span class="text-red-500">chưa mở cửa!</span>
							Hãy đặt hẹn để trải nghiệm dịch vụ của chúng mình!
							<!-- Else if None then show nothing -->
						{:else}
							<!-- Do nothing -->
							Hãy đến và cảm nhận sự khác biệt!
						{/if}
					{/await}
				</P>
			</div>
			<!-- Details -->
			<Carousel.Root
				bind:api={periodCarouselApi}
				orientation="horizontal"
				opts={{
					align: 'start',
					dragFree: true,
					skipSnaps: false
				}}
				class="w-3/4 sm:w-full"
			>
				<Carousel.Content>
					{#await data.regularHourPeriodsPromise}
						<!-- Show a single loading card while data is being fetched -->
						<Carousel.Item>
							<div class="p-1">
								<Card.Root>
									<Card.Header class="items-center justify-center">
										<Card.Title><H4>Loading...</H4></Card.Title>
									</Card.Header>
									<Card.Content class="flex items-center justify-center">
										<Muted>Data is being fetched</Muted>
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{:then periods}
						<!-- Display fetched periods -->
						{#each regularHourPeriodsVN as period (period.openDay)}
							<Carousel.Item>
								<div class="p-1">
									<Card.Root>
										<Card.Header class="items-center justify-center">
											<Card.Title><H4>{period.openDay}</H4></Card.Title>
										</Card.Header>
										<Card.Content class="flex items-center justify-center">
											<Muted>
												mở cửa:
												{period.openTime?.hours}:{period.openTime?.minutes || '00'} - {period
													.closeTime?.hours}:{period.closeTime?.minutes || '00'}
											</Muted>
											<!-- If Wednesday & Thursday, then add a StarFilled -->
											{#if period.openDay === 'Thứ Tư (Wed)' || period.openDay === 'Thứ Năm (Thu)'}
												<Tooltip.Root>
													<Tooltip.Trigger class="ml-2">⭐</Tooltip.Trigger>
													<Tooltip.Content>
														<p>Giảm giá 10%</p>
													</Tooltip.Content>
												</Tooltip.Root>
											{/if}
										</Card.Content>
									</Card.Root>
								</div>
							</Carousel.Item>
						{/each}
					{:catch error}
						<p>Error loading regular hours: {error.message}</p>
					{/await}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
			<!-- Buttons -->
			<div class="flex flex-col sm:flex-row w-full justify-items-center items-center my-4 mx-4">
				<div class="flex w-full mx-1 my-4 justify-self-center justify-center items-center">
					<Button
						variant="default"
						class="h-12 w-3/4 sm:w-36"
						href="https://www.google.com/maps/dir/?api=1&destination=shelf+beauty+studio,+Yersin,+Ph%C6%B0%E1%BB%9Dng+10,+Dalat,+Lam+Dong&destination_place_id=ChIJHydiEXkTcTERBlm-4kPGIWk"
						title="Shelf Beauty Studio trên Google Maps"
						referrerpolicy="origin"
						target="_blank"
						on:click={() => gtag_report_conversion_direction('https://shelf.beauty/directions')}
					>
						<ThickArrowRight class="mr-2" />
						Tìm đường
					</Button>
				</div>
				<div class="flex w-full mx-1 my-4 justify-self-center justify-center items-center">
					<Button
						variant="secondary"
						class="h-12 w-3/4 sm:w-36"
						href="https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+làm+nail+với+ạ"
						title="Shelf Beauty Studio trên Facebook"
						referrerpolicy="origin"
						target="_blank"
						on:click={() =>
							gtag_report_conversion_fbmessage(
								'https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+làm+nail+với+ạ'
							)}
					>
						<Calendar class="mr-2" />
						Đặt hẹn
					</Button>
				</div>
			</div>
		</section>
		<section class="flex flex-col mx-16 items-center justify-center col-span-1 xl:col-span-2">
			<Carousel.Root
				bind:api={imageCarouselApi}
				orientation="horizontal"
				opts={{
					align: 'start',
					dragFree: true,
					skipSnaps: false
				}}
				class="w-3/4 sm:w-full"
			>
				<Carousel.Content class="flex flex-row items-center justify-center">
					{#each images as image, i (image)}
						<Carousel.Item class="">
							<div class="p-1">
								<Card.Root>
									<Card.Content class="flex items-center justify-center p-6">
										<AspectRatio ratio={4 / 3}>
											<img src={image} alt="Shelf Beauty Studio - Operations {i}" />
										</AspectRatio>
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
			<div class="py-2 text-center text-sm text-muted-foreground">
				Ảnh {imageCurrent} trên {imageCount}
			</div>
		</section>
	</div>
</div>
