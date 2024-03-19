<script lang="ts">
	// Images: branding
	import shelf_dark from '$lib/images/branding/shelf-dark-landscape.png';
	import shelf_light from '$lib/images/branding/shelf-light-landscape.png';
	// Images: logo
	import image_1 from '$lib/images/operations/1.jpg';
	import image_2 from '$lib/images/operations/2.jpg';
	// Typography
	import H1 from '$lib/components/typography/h1.svelte';
	import H2 from '$lib/components/typography/h2.svelte';
	import P from '$lib/components/typography/p.svelte';
	// Components
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	// Make list of images
	const images = [image_1, image_2];
</script>

<svelte:head>
	<title>Shelf Beauty Studio - Trang Chủ</title>
	<meta name="description" content="Shelf Beauty Studio - Trang Chủ" />
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
	<section class="flex flex-col mx-16 items-center justify-center col-span-1" id="hero-left">
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
	<section
		class="flex flex-col mx-16 items-center justify-center col-span-2 h-full"
		id="hero-right"
	>
		<Carousel.Root
			class="w-full h-full"
			opts={{
				align: 'start',
				loop: true
			}}
		>
			<Carousel.Content>
				{#each Array(5) as _, i (i)}
					<Carousel.Item>
						<div class="p-1">
							<Card.Root>
								<Card.Content class="flex aspect-[4/3] items-center justify-center p-6">
									<img src={images[i % images.length]} alt="Shelf Beauty Studio - Operations" />
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
