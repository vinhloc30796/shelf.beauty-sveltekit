import { getMessengerBookingUrl } from '$lib/messenger';

export const GET = () =>
	new Response(null, {
		status: 308,
		headers: { location: getMessengerBookingUrl('vi') }
	});
