<script lang="ts">
	// Vercel Analytics
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	// Import the global styles
	import '../app.css';

	// UI components
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Menu from 'lucide-svelte/icons/menu';

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

	// Logic
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let currentPage = '';
	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			currentPage = $page.url.pathname;
			console.log(`currentPage:`, currentPage);
		});

		return () => {
			unsubscribe();
		};
	});


	$: isActive = (page: string) => {
		return $page.url.pathname === page;
	};
</script>

<header class="flex items-center p-4 h-24">
	<nav class="flex items-center justify-between w-full">
		<!-- Logo -->
		<div class="w-20">
			<a href="/" title="Shelf Beauty Studio">
				<picture>
					<!-- Choose between light & dark logo depending on html dark -->
					<img src={dark_logo} alt="Shelf Beauty Studio" class="dark:hidden block" />
					<img src={light_logo} alt="Shelf Beauty Studio" class="hidden dark:block" />
				</picture>
			</a>
		</div>
		<!-- Menu -->
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a href="##" class="flex items-center gap-2 text-lg font-semibold md:text-base">
				<span class="sr-only">🏡 Trang Chủ</span>
			</a>
			<a
				href="/"
				class="{isActive('/') ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground"
			>
				🏡 Trang Chủ
			</a>
			<a
				href="/reviews"
				class="{isActive('/reviews')
					? 'text-foreground'
					: 'text-muted-foreground'} hover:text-foreground"
			>
				✍️ Reviews
			</a>
		</nav>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
					<Menu class="h-5 w-5" />
					<span class="sr-only">Toggle navigation menu</span>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<nav class="grid gap-6 text-lg font-medium">
					<a href="##" class="flex items-center gap-2 text-lg font-semibold">
						<span class="sr-only">Acme Inc</span>
					</a>
					<a
						href="/"
						class="{isActive('/')
							? 'text-foreground'
							: 'text-muted-foreground'} hover:text-foreground"
					>
						🏡 Trang Chủ
					</a>
					<a
						href="/reviews"
						class="{isActive('/reviews')
							? 'text-foreground'
							: 'text-muted-foreground'} hover:text-foreground"
					>
						✍️ Reviews
					</a>
				</nav>
			</Sheet.Content>
		</Sheet.Root>
		<!-- Light-Dark Display -->
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
