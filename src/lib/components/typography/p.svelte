<script lang="ts">
	import { cn } from '$lib/utils.js';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p
	class={cn('max-w-[70ch] leading-7 text-muted-foreground [&:not(:first-child)]:mt-5', className)}
	{...$$restProps}
>
	<slot />
</p>
