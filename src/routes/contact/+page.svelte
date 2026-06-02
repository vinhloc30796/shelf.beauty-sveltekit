<script lang="ts">
	// Environment variables
	import { env } from '$env/dynamic/public';
	// Images: branding
	import shelf_dark from '$lib/images/branding/shelf-dark-landscape.png';
	import shelf_light from '$lib/images/branding/shelf-light-landscape.png';
	// import { FacebookBrand, InstagramBrand, TiktokBrand } from 'svelte-awesome-icons';
	import FacebookBrand from 'svelte-awesome-icons/FacebookBrand.svelte';
	import InstagramBrand from 'svelte-awesome-icons/InstagramBrand.svelte';
	import TiktokBrand from 'svelte-awesome-icons/TiktokBrand.svelte';
	// Typography
	import H1 from '$lib/components/typography/h1.svelte';
	import H4 from '$lib/components/typography/h4.svelte';
	import P from '$lib/components/typography/p.svelte';
	// Logic
	let mapUrl =
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.4751651773076!2d108.4492590764347!3d11.941568188287144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317113791162271f%3A0x6921c643e2be5906!2sshelf%20beauty%20studio!5e0!3m2!1sen!2s!4v1716794660375!5m2!1sen!2s';
	// Reactive variables for iframe dimensions
	let iframeWidth = 250;
	let iframeHeight = 400;

	// Function to update iframe dimensions based on window width
	const updateIframeSize = () => {
		const width = window.innerWidth;
		const margin = 64 * 2; // 64px padding on each side
		const padding = 0 * 2; // 16px padding on each side
		const breakpoint = 1024; // 640px

		// If window is wider than 640px, set iframe width to 50% of window width
		width >= breakpoint ? (iframeWidth = width / 2) : (iframeWidth = width - margin - padding);
		iframeHeight = iframeWidth * 0.75; // Aspect ratio: 4:3
		return;
	};

	// Update iframe size on mount and on window resize
	if (typeof window !== 'undefined') {
		updateIframeSize();
		window.addEventListener('resize', updateIframeSize);
	}

	/// Event snippet for Get directions conversion page
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
</script>

<svelte:head>
	<title>Shelf Beauty Studio - 📌 Liên hệ</title>
	<meta name="description" content="Shelf Beauty Studio - 📌 Liên hệ" />
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-12rem)] max-w-1/2 mx-16">
	<!-- Description -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto" id="location-cols">
		<section class="mx-auto my-4 col-span-1" id="location-desc">
			<!-- Logo -->
			<picture class="my-auto mx-auto">
				<img src={shelf_dark} alt="Shelf Beauty Studio - Welcome" class="dark:hidden" />
				<img src={shelf_light} alt="Shelf Beauty Studio - Welcome" class="hidden dark:block" />
			</picture>
			<!-- Text -->
			<div class="md:flex md:items-end md:justify-between my-4">
				<div class="max-w-xl">
					<H1>Tìm Shelf ở đâu?</H1>
					<P>
						Shelf luôn tin rằng vị trí là một yếu tố quan trọng trong việc tạo ra trải nghiệm tốt
						nhất cho khách hàng. Cách Quảng trường Lâm Viên 5 phút đi bộ, sẽ chẳng mất nhiều thời
						gian để bạn có một buổi thư giãn tuyệt vời tại Shelf.
					</P>
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="col-span-1">
					<H4>Địa chỉ</H4>
					<P>35 Yersin, phường 10, Đà Lạt,<br />Lâm Đồng</P>
				</div>
				<div class="col-span-1">
					<H4>Social media</H4>
					<div class="flex items-center my-4">
						<a href="https://facebook.com/shelfbeautystudio" class="underline underline-offset-4">
							<FacebookBrand class="flex mr-4" />
						</a>
						<P class="!mt-0">
							Facebook: <a
								href="https://facebook.com/shelfbeautystudio"
								class="underline underline-offset-4"
							>
								@shelfbeautystudio
							</a>
						</P>
					</div>
					<div class="flex items-center my-4">
						<a href="https://instagram.com/shelfbeautystudio" class="underline underline-offset-4">
							<InstagramBrand class="mr-4" />
						</a>
						<P class="!mt-0">
							Instagram: <a
								href="https://instagram.com/shelfbeautystudio"
								class="underline underline-offset-4"
							>
								@shelfbeautystudio
							</a>
						</P>
					</div>
					<div class="flex items-center my-4">
						<a href="https://tiktok.com/@shelfbeautystudio" class="underline underline-offset-4">
							<TiktokBrand class="mr-4" />
						</a>
						<P class="!mt-0">
							Tiktok: <a
								href="https://tiktok.com/@shelfbeautystudio"
								class="underline underline-offset-4"
							>
								@shelfbeautystudio
							</a>
						</P>
					</div>
				</div>
			</div>
		</section>
		<!-- Media -->
		<section class="mx-auto my-4 col-span-2" id="location-media">
			<!-- Map -->
			<span class="flex w-full lg:my-4 col-span-1 iframe-container">
				<!-- Iframe should have 4:3 aspect ratio; and should w = 100% its container -->
				<iframe
					title="Shelf Beauty Studio - Location"
					id="shelf-map-iframe"
					src={mapUrl}
					width={iframeWidth}
					height={iframeHeight}
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</span>
		</section>
	</div>
</div>
