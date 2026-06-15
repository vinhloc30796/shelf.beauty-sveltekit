<script lang="ts">
	import { cn } from '$lib/utils.js';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h1
	class={cn('scroll-m-20 text-4xl font-bold tracking-tight lg:text-6xl mb-6', className)}
	{...$$restProps}
>
	<slot />
</h1>
