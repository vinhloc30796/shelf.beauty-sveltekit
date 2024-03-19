<script lang="ts">
	// Vercel Analytics
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	// Dark mode
	import { ModeWatcher } from 'mode-watcher';

	// Header component
	import Header from './Header.svelte';

	// Import the global styles
	import '../app.css';
</script>

<div class="app">
	<Header />

	<main>
		<ModeWatcher />
		<slot />
	</main>

	<!-- stick to the bottom -->
	<footer class="flex items-center justify-center absolute bottom-0 w-full h-12">
		<p>
			Ghé <a
				href="https://m.me/shelfbeautystudio"
				title="Shelf Beauty Studio trên Facebook"
				referrerpolicy="origin"
				target="_blank">Shelf Beauty Studio trên Facebook Messenger</a
			> để đặt lịch hẹn
		</p>
	</footer>
</div>
