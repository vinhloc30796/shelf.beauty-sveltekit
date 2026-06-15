<script lang="ts">
	import { defaultSocialImage, siteName, toAbsoluteUrl } from '$lib/seo';

	export let title: string;
	export let description: string;
	export let path: string;
	export let image = defaultSocialImage;
	export let type: 'website' | 'article' = 'website';

	$: canonicalUrl = toAbsoluteUrl(path);
	$: imageUrl = toAbsoluteUrl(image);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={imageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
