<script lang="ts">
	// Images: branding
	import shelf_dark from '$lib/images/branding/shelf-dark-landscape.png';
	import shelf_light from '$lib/images/branding/shelf-light-landscape.png';
	// Images: logo
	import image_1 from '$lib/images/operations/1.jpg';
	import image_2 from '$lib/images/operations/2.jpg';
	import image_3 from '$lib/images/operations/3.jpg';
	import image_4 from '$lib/images/operations/4.jpg';
	import image_5 from '$lib/images/operations/5.jpg';
	// Icons
	import { Calendar, ThickArrowRight } from 'svelte-radix';
	// Typography
	import H1 from '$lib/components/typography/h1.svelte';
	import H2 from '$lib/components/typography/h2.svelte';
	import P from '$lib/components/typography/p.svelte';
	// Components
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Autoplay from 'embla-carousel-autoplay';

	let images = [image_1, image_2, image_3, image_4, image_5];
	let api: CarouselAPI;
	let count = 0;
	let current = 0;

	$: if (api) {
		count = api.scrollSnapList().length;
		current = api.selectedScrollSnap() + 1;
		api.on('select', () => {
			current = api.selectedScrollSnap() + 1;
		});
	}

	// Event snippet for Get directions conversion page
	// In your html page, add the snippet and call gtag_report_conversion
	// - when someone clicks on the chosen link or button.
	$: gtag_report_conversion = (url: string) => {
		// @ts-ignore
		window.gtag('event', 'conversion', {
			send_to: 'AW-11464920859/XeK7CPaZ2YUZEJue89oq',
			event_callback: () => {
				if (url) {
					window.location;
				}
			}
		});
		// console.log('gtag_report_conversion: sent to Google Analytics');
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
			<!-- Buttons -->
			<div class="flex flex-col sm:flex-row w-full justify-items-center items-center my-4">
				<div class="flex w-full mx-1 my-4 justify-self-center justify-center items-center">
					<Button
						variant="default"
						class="h-12 w-36"
						href="https://www.google.com/maps/dir/?api=1&destination=shelf+beauty+studio,+Yersin,+Ph%C6%B0%E1%BB%9Dng+10,+Dalat,+Lam+Dong&destination_place_id=ChIJHydiEXkTcTERBlm-4kPGIWk"
						title="Shelf Beauty Studio trên Google Maps"
						referrerpolicy="origin"
						target="_blank"
						on:click={() => gtag_report_conversion('https://shelf.beauty/directions')}
					>
						<ThickArrowRight class="mr-2" />
						Tìm đường
					</Button>
				</div>
				<div class="flex w-full mx-1 my-4 justify-self-center justify-center items-center">
					<Button
						variant="secondary"
						class="h-12 w-36"
						href="https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+làm+nail+với+ạ"
						title="Shelf Beauty Studio trên Facebook"
						referrerpolicy="origin"
						target="_blank"
					>
						<Calendar class="mr-2" />
						Đặt hẹn
					</Button>
				</div>
			</div>
		</section>
		<section class="flex flex-col mx-16 items-center justify-center col-span-1 xl:col-span-2">
			<Carousel.Root
				bind:api
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
									<Card.Content class="flex aspect-[4/3] items-center justify-center p-6">
										<img src={image} alt="Shelf Beauty Studio - Operations {i}" />
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
