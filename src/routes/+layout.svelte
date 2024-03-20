<script lang="ts">
	// Vercel Analytics
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	inject({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights()

	// Dark mode
	import { ModeWatcher } from 'mode-watcher';

	// Typography
	import P from '$lib/components/typography/p.svelte';
	// Header component
	import Header from './Header.svelte';

	// Import the global styles
	import '../app.css';
</script>

<div class="app flex flex-col min-h-screen">
	<Header />

	<main class="flex items-center justify-center">
		<ModeWatcher />
		<slot />
	</main>
	<!-- stick to the bottom -->
	<footer
		class="flex w-full min-h-16 items-center justify-center bg-gray-100 dark:bg-gray-900 mt-8"
		id="footer"
	>
		<P class="text-center text-sm">
			Ghé <a
				class="text-blue-500 hover:underline"
				href="https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+làm+nail+với+ạ"
				title="Shelf Beauty Studio trên Facebook"
				referrerpolicy="origin"
				target="_blank">Shelf Beauty Studio trên Facebook Messenger</a
			> để đặt lịch hẹn
		</P>
	</footer>
</div>
