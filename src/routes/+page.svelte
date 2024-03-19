<script lang="ts">
	// Images: branding
	import shelf_dark from '$lib/images/branding/shelf-dark-landscape.png';
	import shelf_light from '$lib/images/branding/shelf-light-landscape.png';
	// Images: logo
	import image_1 from '$lib/images/operations/1.jpg';
	import image_2 from '$lib/images/operations/2.jpg';
	import image_3 from '$lib/images/operations/3.jpg';
	import image_4 from '$lib/images/operations/4.jpg';
	// Typography
	import H1 from '$lib/components/typography/h1.svelte';
	import H2 from '$lib/components/typography/h2.svelte';
	import P from '$lib/components/typography/p.svelte';
	// Components
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	let images = [image_1, image_2, image_3, image_4];
</script>

<svelte:head>
	<title>Shelf Beauty Studio - Trang Chủ</title>
	<meta name="description" content="Shelf Beauty Studio - Trang Chủ" />
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-12rem)]">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto" id="hero">
		<section class="flex flex-col mx-16 items-center justify-center col-span-1" id="hero-desc">
			<span class="w-full flex">
				<picture>
					<img src={shelf_dark} alt="Shelf Beauty Studio - Welcome" class="dark:hidden" />
					<img src={shelf_light} alt="Shelf Beauty Studio - Welcome" class="hidden dark:block" />
				</picture>
			</span>
			<H2 class="mt-4">Trải nghiệm làm đẹp tại Đà Lạt</H2>
			<P>
				Shelf Beauty Studio là một không gian làm đẹp chuyên nghiệp, nơi bạn có thể tìm thấy sự yên
				bình và thoải mái.
			</P>
		</section>
		<section class="flex flex-col w-5/6 mx-16 items-center justify-center col-span-2">
			<Carousel.Root opts={{loop: false}}>
				<Carousel.Content class="flex flex-row items-center justify-center">
					{#each images as image, i}
						<Carousel.Item>
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
		</section>
	</div>
</div>
