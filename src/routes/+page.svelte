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
	import P from '$lib/components/typography/p.svelte';
	// Components
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge, badgeVariants } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Autoplay from 'embla-carousel-autoplay';
	// Data
	import type { PageData } from './$types';
	export let data: PageData;
	export const isOpen = data.isOpen;
	console.log('Page data:', data);
	console.log('Store is open?:', isOpen);

	let regularHourPeriodsEN = data.gmbLocationData?.regularHours?.periods || [];
	let regularHourPeriodsVN = regularHourPeriodsEN.map((period) => {
		let openDayEN = period.openDay?.toUpperCase();
		let openDayVN = '';
		switch (openDayEN) {
			case 'MONDAY':
				openDayVN = 'Thứ Hai (Mon)';
				break;
			case 'TUESDAY':
				openDayVN = 'Thứ Ba (Tue)';
				break;
			case 'WEDNESDAY':
				openDayVN = 'Thứ Tư (Wed)';
				break;
			case 'THURSDAY':
				openDayVN = 'Thứ Năm (Thu)';
				break;
			case 'FRIDAY':
				openDayVN = 'Thứ Sáu (Fri)';
				break;
			case 'SATURDAY':
				openDayVN = 'Thứ Bảy (Sat)';
				break;
			case 'SUNDAY':
				openDayVN = 'Chủ Nhật (Sun)';
				break;
			default:
				openDayVN = 'Không xác định';
				break;
		}
		let openTime = period.openTime;
		let closeTime = period.closeTime;
		return { openDay: openDayVN, openTime: openTime, closeTime: closeTime };
	});
	let periodCarouselApi: CarouselAPI;
	console.log(`Regular hour periods: `, regularHourPeriodsVN);
	let images = [image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8, image_9];
	let imageCarouselApi: CarouselAPI;
	let count = 0;
	let current = 0;

	$: if (periodCarouselApi) {
		count = periodCarouselApi.scrollSnapList().length;
		current = periodCarouselApi.selectedScrollSnap() + 1;
		periodCarouselApi.on('select', () => {
			current = periodCarouselApi.selectedScrollSnap() + 1;
		});
	}

	$: if (imageCarouselApi) {
		count = imageCarouselApi.scrollSnapList().length;
		current = imageCarouselApi.selectedScrollSnap() + 1;
		imageCarouselApi.on('select', () => {
			current = imageCarouselApi.selectedScrollSnap() + 1;
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
		// console.log('gtag_report_conversion_direction: sent to Google Analytics');
		return false;
	};

	$: gtag_report_conversion_fbmessage = (url: string) => {
		// @ts-ignore
		window.gtag('event', 'conversion', {
			send_to: env.PUBLIC_GTAG_ID + '/XeK7CPaZ2YUZEJue89oq',
			event_callback: () => {
				if (url) {
					window.location;
				}
			}
		});
		// console.log('gtag_report_conversion_fbmessage: sent to Google Analytics');
		return false;
	};
</script>

<svelte:head>
	<title>Shelf Beauty Studio - Trang Chủ</title>
	<meta name="description" content="Shelf Beauty Studio - Trang Chủ" />
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
				<H2 class="mt-4">Trải nghiệm làm đẹp tại Đà Lạt</H2>
				<P>
					Shelf Beauty Studio là một không gian làm đẹp chuyên nghiệp, nơi bạn có thể tìm thấy sự
					yên bình và thoải mái.
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
				plugins={[
					Autoplay({
						delay: 5000,
						stopOnHover: true,
						waitForTransition: true
					})
				]}
				class="w-full"
			>
				<Carousel.Content class="flex flex-row items-center justify-center">
					{#each Array(regularHourPeriodsVN.length - 1) as _}
						<Carousel.Item />
					{/each}
					{#each regularHourPeriodsVN as period, i (period)}
						<Carousel.Item class="">
							<div class="p-1">
								<Card.Root>
									<Card.Header class="items-center justify-center">
										<Card.Title class="text-lg">
											{period.openDay}
										</Card.Title>
									</Card.Header>
									<Card.Content class="flex items-center justify-center">
										<!-- Map from period.openDay to string type, then use it as key to get the value from dayMappingENToVN -->
										<p class="text-muted-foreground text-sm">
											mở cửa:
											{period.openTime?.hours}:{period.openTime?.minutes || '00'} - {period
												.closeTime?.hours}:{period.closeTime?.minutes || '00'}
										</p>
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
			<!-- Buttons -->
			<div class="flex flex-col sm:flex-row w-full justify-items-center items-center my-4 mx-4">
				<div class="flex w-full mx-1 my-4 justify-self-center justify-center items-center">
					<Button
						variant="default"
						class="h-12 w-36"
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
						class="h-12 min-w-36"
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
						<!-- Check if isOpen is true, add green open -->
						{#if isOpen}
							<Badge class="ml-2 bg-green-500">Mở cửa</Badge>
							<!-- Else if false, then red badget -->
						{:else if isOpen === false}
							<Badge variant="destructive" class="ml-2">Chưa mở</Badge>
							<!-- Else if None then show nothing -->
						{:else}
							<!-- Do nothing -->
						{/if}
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
				plugins={[
					Autoplay({
						delay: 5000,
						stopOnHover: true,
						waitForTransition: true
					})
				]}
				class="w-full"
			>
				<Carousel.Content class="flex flex-row items-center justify-center">
					{#each Array(images.length - 1) as _}
						<Carousel.Item />
					{/each}
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
				Ảnh {current} trên {count}
			</div>
		</section>
	</div>
</div>
