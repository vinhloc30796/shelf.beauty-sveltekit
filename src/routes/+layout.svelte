<script lang="ts">
	// Vercel Analytics
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	inject({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	// Dark mode
	import { ModeWatcher } from 'mode-watcher';
	import { language } from '$lib/i18n';

	// Typography
	import P from '$lib/components/typography/p.svelte';
	// Header component
	import Header from './Header.svelte';

	// Import the global styles
	import '../app.css';
</script>

<div class="app flex min-h-screen flex-col">
	<Header />

	<main class="flex-1">
		<ModeWatcher />
		<slot />
	</main>
	<footer class="border-t border-border/70 bg-secondary/45 py-6" id="footer">
		<P class="container-shell text-center text-sm">
			{$language === 'vi' ? 'Ghé ' : 'Visit '}
			<a
				class="font-medium text-primary underline-offset-4 hover:underline"
				href="/fbmessage"
				title="Shelf Beauty Studio trên Facebook"
				referrerpolicy="origin"
				target="_blank">Shelf Beauty Studio Facebook Messenger</a
			>
			{$language === 'vi' ? ' để đặt lịch hẹn' : ' to book an appointment'}
		</P>
	</footer>
</div>
