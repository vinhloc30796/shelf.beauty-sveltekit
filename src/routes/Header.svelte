<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { language, type Language } from '$lib/i18n';
	import darkLogo from '$lib/images/branding/shelf-dark-logo.png';
	import lightLogo from '$lib/images/branding/shelf-light-logo.png';
	import Menu from 'lucide-svelte/icons/menu';
	import Moon from 'svelte-radix/Moon.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import { toggleMode } from 'mode-watcher';

	const navItems = [
		{ href: '/', label: { vi: 'Trang chủ', en: 'Home' } },
		{ href: '/reviews', label: { vi: 'Đánh giá', en: 'Reviews' } },
		{ href: '/contact', label: { vi: 'Liên hệ', en: 'Contact' } }
	];
	const languages: Array<{ value: Language; label: string }> = [
		{ value: 'vi', label: 'Tiếng Việt' },
		{ value: 'en', label: 'English' }
	];

	$: currentPath = $page.url.pathname;
</script>

<header class="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
	<nav class="container-shell flex min-h-20 items-center justify-between gap-4">
		<a href="/" class="flex items-center gap-3 rounded-md" aria-label="Shelf Beauty Studio home">
			<picture>
				<img src={darkLogo} alt="" class="h-12 w-12 dark:hidden" />
				<img src={lightLogo} alt="" class="hidden h-12 w-12 dark:block" />
			</picture>
			<span class="hidden text-sm font-semibold tracking-wide text-primary sm:inline">
				Shelf Beauty Studio
			</span>
		</a>

		<div class="hidden items-center gap-2 md:flex">
			{#each navItems as item}
				<a
					href={item.href}
					class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
						currentPath === item.href
							? 'bg-secondary text-secondary-foreground'
							: 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
					}`}
					aria-current={currentPath === item.href ? 'page' : undefined}
				>
					{item.label[$language]}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<div
				class="hidden rounded-md border border-primary/25 bg-background p-1 sm:flex"
				aria-label="Language"
			>
				{#each languages as option}
					<button
						type="button"
						class={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
							$language === option.value
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
						}`}
						aria-pressed={$language === option.value}
						on:click={() => language.set(option.value)}
					>
						{option.label}
					</button>
				{/each}
			</div>

			<Button on:click={toggleMode} variant="outline" size="icon" aria-label="Toggle theme">
				<Sun
					class="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
			</Button>

			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button
						variant="outline"
						size="icon"
						class="md:hidden"
						builders={[builder]}
						aria-label="Open navigation menu"
					>
						<Menu class="h-5 w-5" />
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="w-80">
					<div class="mb-8 flex items-center gap-3">
						<img src={darkLogo} alt="" class="h-12 w-12 dark:hidden" />
						<img src={lightLogo} alt="" class="hidden h-12 w-12 dark:block" />
						<div>
							<p class="font-semibold text-foreground">Shelf Beauty Studio</p>
							<p class="text-sm text-muted-foreground">
								{$language === 'vi' ? 'Studio làm đẹp Đà Lạt' : 'Da Lat beauty studio'}
							</p>
						</div>
					</div>
					<div class="mb-6 flex rounded-md border border-primary/25 bg-background p-1">
						{#each languages as option}
							<button
								type="button"
								class={`flex-1 rounded px-3 py-2 text-sm font-semibold transition-colors ${
									$language === option.value
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
								}`}
								aria-pressed={$language === option.value}
								on:click={() => language.set(option.value)}
							>
								{option.label}
							</button>
						{/each}
					</div>
					<nav class="grid gap-2">
						{#each navItems as item}
							<a
								href={item.href}
								class={`rounded-md px-3 py-3 text-base font-medium transition-colors ${
									currentPath === item.href
										? 'bg-secondary text-secondary-foreground'
										: 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
								}`}
								aria-current={currentPath === item.href ? 'page' : undefined}
							>
								{item.label[$language]}
							</a>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</nav>
</header>
