<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			gtag_report_conversion_fbmessage("https://m.me/shelfbeautystudio?text=Cho+mình+xin+đặt+hẹn+làm+nail+với+ạ");
			// The redirect occurs within the callback in `gtag_report_conversion_fbmessage`
		}
	});

	function gtag_report_conversion_fbmessage(url: string) {
		// Assuming `gtag` is already defined and available globally
		window.gtag('event', 'conversion', {
			send_to: 'AW-1007373003/6z5fCJ6FmOwBEKzY7d4D',
			event_callback: () => {
				if (url) {
					window.location.href = url;
				}
			}
		});

		// Optional: For debugging
		console.log('gtag_report_conversion_fbmessage: sent to Google Analytics');
		return false;
	}
</script>
