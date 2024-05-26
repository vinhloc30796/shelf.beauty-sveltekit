<script lang="ts">
	// Environment variables
	import { PUBLIC_GTAG_ID } from '$env/static/public';
	// Typography
	import H1 from '$lib/components/typography/h1.svelte';
	import H2 from '$lib/components/typography/h2.svelte';
	import P from '$lib/components/typography/p.svelte';
	// Components
	import * as Card from '$lib/components/ui/card/index.js';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	// Data
	let reviews = [
		{
			stars: 5,
			name: 'Nguyễn Văn A',
			quote:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		},
		{
			stars: 5,
			name: 'Trần B',
			quote:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		},
		{
			stars: 3,
			name: 'Lê C',
			quote:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		},
		{
			stars: 4,
			name: 'Phạm D',
			quote:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		}
	];
	// Logic
	let reviewCarouselApi: CarouselAPI;
	let reviewCount = 0;
	let reviewCurrent = 0;
	$: if (reviewCarouselApi) {
		reviewCount = reviewCarouselApi.scrollSnapList().length;
		reviewCurrent = reviewCarouselApi.selectedScrollSnap() + 1;
		reviewCarouselApi.on('select', () => {
			reviewCurrent = reviewCarouselApi.selectedScrollSnap() + 1;
		});
	}
</script>

<svelte:head>
	<title>Shelf Beauty Studio - ✍️ Reviews</title>
	<meta name="description" content="Shelf Beauty Studio - ✍️ Reviews" />
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-12rem)] max-w-1/2">
	<section>
		<div class="mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
			<div class="md:flex md:items-end md:justify-between">
				<div class="max-w-xl">
					<H1>Mọi người nói gì về Shelf?</H1>
					<P>
						Shelf luôn cố gắng hết sức để chau chuốt & chăm sóc cho trải nghiệm & vẻ đẹp của bạn.
						Nhờ đó, nhà Shelf rất tự hào khi nhận được những phản hồi tích cực từ phía khách hàng.
					</P>
				</div>
			</div>
		</div>
		<div class="mx-auto w-5/6">
			<Carousel.Root orientation="horizontal">
				<Carousel.Content>
					{#each reviews as review, i (review)}
						<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
							<div class="p-1">
								<Card.Root>
									<Card.Header>
										<!-- Name using H2 -->
										<Card.Title>
											<H2>{review.name}</H2>
										</Card.Title>
									</Card.Header>
									<Card.Content class="">
										<!-- Stars using ⭐ -->
										<div class="">
											{#each Array(review.stars) as _}
												⭐
											{/each}
										</div>
										<!-- Quote using P -->
										<P>{review.quote}</P>
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</div>
	</section>
</div>
