<script lang="ts">
	import lightModeLogo from '$lib/images/branding/shelf-dark-logo.png?w=96&format=png';
	import darkModeLogo from '$lib/images/branding/shelf-light-logo.png?w=96&format=png';
</script>

<span class="header-logo" data-testid="header-logo" aria-hidden="true"></span>
<svelte:element
	this="script"
	src="/header-logo-theme.js"
	data-header-logo-bootstrap=""
	data-light-logo={lightModeLogo}
	data-dark-logo={darkModeLogo}
></svelte:element>

<style>
	.header-logo {
		display: block;
		width: 3rem;
		height: 3rem;
		flex: 0 0 3rem;
		background-image: var(--header-logo-image);
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
	}
</style>
