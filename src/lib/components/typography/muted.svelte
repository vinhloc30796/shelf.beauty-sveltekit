<script lang="ts">
	import { cn } from "$lib/utils.js";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn("text-sm text-muted-foreground [&:not(:first-child)]:mt-6", className)} {...$$restProps}>
	<slot />
</p>