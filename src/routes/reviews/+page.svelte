<script lang="ts">
	// Environment variables
	import { env } from '$env/dynamic/public';
	import { PUBLIC_GTAG_ID } from '$env/static/public';
	// Images: branding
	import shelf_dark from '$lib/images/branding/shelf-dark-landscape.png';
	import shelf_light from '$lib/images/branding/shelf-light-landscape.png';
	// Icons
	import { CardStack } from 'svelte-radix';
	// Typography
	import H1 from '$lib/components/typography/h1.svelte';
	import H2 from '$lib/components/typography/h2.svelte';
	import P from '$lib/components/typography/p.svelte';
	// Components
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	// Data
	let reviews = [
		{
			stars: 5,
			name: 'Nguyen Ngoc Tu Tu',
			quote:
				'Mình đi du lịch tiện ghé vào làm, mà tiệm nail rất xinh nha mụi ngừ, có 2 em cún cũng thân thiện lứm 😂cộng 1đ đáng iu. Giá cả ok, dịch vụ ok lun. Highly recommended 👍 …'
		},
		{
			stars: 5,
			name: 'Thư Nguyễn',
			quote:
				'Mấy bạn nhân viên rất dễ thương, nhiệt tình lắm ạ. Mình làm ở đây 2 lần rồi, lần sau sẽ ủng hộ lại nè. Mấy bạn làm rất kỹ luôn ạ🥰🥰'
		},
		{
			stars: 5,
			name: 'Julia Larson',
			quote:
				'Fabulous attention to detail and service from my nail tech. They made sure to ask a lot of questions and made sure you are getting exactly the nails you would like. They have a wide variety of nail charms and services. Bonus points for the cute shop dog and welcoming ambiance! 🫶🏻💅🏻'
		},
		{
			stars: 5,
			name: 'Bryan Tan',
			quote:
				'Shelf Beauty Studio was absolutely amazing, never been more impressed with the nails done. My girlfriend and her friend did gel nails, manicure and pedicure and they were very pleased with the end results. The staff there are very skilled, meticulous and did the designs so well even though it was so elaborate. Also very accommodating as our booking was late and so they worked past their working hours and were still so patient. Affordable as well! Highly recommended 🥰'
		},
		{
			stars: 5,
			name: 'Tam Mii따미',
			quote:
				'Tiệm gội đầu nhỏ nhỏ xinh xinh~ Giá siêu bình dân (50-80k) thuiiii, các bạn nhân viên rất nhiệt tình đáng iu thân thiện nha ^^ gội xong còn đc cho trà nóng uống, thoa dầu nóng lên gáy để giữ ấm nữa 🫶🫶 10 đỉmmm nhất định sẽ quay lại mỗi dịp lên ĐL chơi!'
		}
	];
	// Logic

	// Event snippet for View all Reviews on Google Map conversion page
	// In your html page, add the snippet and call gtag_report_conversion_reviews
	// - when someone clicks on the chosen link or button.
	$: gtag_report_conversion_reviews = (url: string) => {
		// @ts-ignore
		window.gtag('event', 'conversion', {
			send_to: env.PUBLIC_GTAG_ID + '/Ww1qCPSC5bMZEJue89oq',
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
	<title>Shelf Beauty Studio - ✍️ Reviews</title>
	<meta name="description" content="Shelf Beauty Studio - ✍️ Reviews" />
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-12rem)] max-w-1/2">
	<!-- Description -->
	<section class="flex flex-col mx-16 justify-center items-center col-span-1" id="reviews-desc">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto">
			<!-- Logo -->
			<span class="flex w-full my-4 col-span-1">
				<picture class="my-auto">
					<img src={shelf_dark} alt="Shelf Beauty Studio - Welcome" class="dark:hidden" />
					<img src={shelf_light} alt="Shelf Beauty Studio - Welcome" class="hidden dark:block" />
				</picture>
			</span>
			<!-- Text -->
			<div class="mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16 col-span-2">
				<div class="md:flex md:items-end md:justify-between my-4">
					<div class="max-w-xl">
						<H1>Mọi người nói gì về Shelf?</H1>
						<P>
							Shelf luôn cố gắng hết sức để chau chuốt & chăm sóc cho trải nghiệm & vẻ đẹp của bạn.
							Nhờ đó, nhà Shelf rất tự hào khi nhận được những phản hồi tích cực từ phía khách hàng.
						</P>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- Reviews -->
	<section class="flex flex-col mx-16 justify-center items-center col-span-1" id="reviews">
		<div class="mt-4 [column-fill:_balance] sm:columns-2 sm:gap-6 lg:columns-2 lg:gap-8">
			{#each reviews as review, i (review)}
				<div class="p-1 sm:break-inside-avoid">
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
			{/each}
			<!-- Button: view all reviews -->
			<div class="flex justify-center items-center p-1">
				<Button
					href="https://www.google.com/maps/place/shelf+beauty+studio/@11.9415682,108.4492591,17z/data=!4m18!1m9!3m8!1s0x317113791162271f:0x6921c643e2be5906!2sshelf+beauty+studio!8m2!3d11.9415682!4d108.451834!9m1!1b1!16s%2Fg%2F11s8wb0ng4!3m7!1s0x317113791162271f:0x6921c643e2be5906!8m2!3d11.9415682!4d108.451834!9m1!1b1!16s%2Fg%2F11s8wb0ng4?entry=ttu"
					class="w-full"
					title="Xem tất cả đánh giá của Shelf Beauty Studio"
					referrerpolicy="no-referrer"
					target="_blank"
					on:click={() => gtag_report_conversion_reviews('https://shelf.beauty/reviews')}
				>
					<CardStack class="mr-2" />
					Xem tất cả đánh giá
				</Button>
			</div>
		</div>
	</section>
</div>
