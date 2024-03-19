<script lang="ts">
	// Vercel Analytics
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	// Import the global styles
	import '../app.css';

	// Dark mode
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toggleMode } from 'mode-watcher';

	// Logo
	import dark_logo from '$lib/images/branding/shelf-dark-logo.png';
	import light_logo from '$lib/images/branding/shelf-light-logo.png';

	// Typography
	import H1 from '$lib/components/typography/h1.svelte';
</script>

<header class="flex items-center p-4">
	<nav class="flex items-center justify-between w-full">
		<div class="w-24 h-24">
			<a href="https://shelf.beauty" title="Shelf Beauty Studio">
				<!-- Choose between light & dark logo depending on html dark -->
				<img src={dark_logo} alt="Shelf Beauty Studio" class="dark:hidden block" />
				<img src={light_logo} alt="Shelf Beauty Studio" class="hidden dark:block" />
			</a>
		</div>
		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</nav>

	
</header>