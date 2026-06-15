import { GoogleReviewsUpstreamError, listGoogleReviews } from '$lib/server/googleReviews';
import { json, type RequestHandler } from '@sveltejs/kit';

const CACHE_CONTROL = 'public, s-maxage=21600, stale-while-revalidate=86400';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	setHeaders({
		'cache-control': CACHE_CONTROL
	});

	try {
		const pageToken = url.searchParams.get('pageToken') ?? undefined;
		const reviewsPage = await listGoogleReviews({ pageSize: 10, pageToken });
		return json(reviewsPage);
	} catch (error) {
		if (
			error instanceof GoogleReviewsUpstreamError &&
			[429, 500, 502, 503, 504].includes(error.status)
		) {
			return json({ error: 'Google reviews temporarily unavailable' }, { status: 503 });
		}

		console.error('google reviews endpoint error:', error);
		return json({ error: 'Google reviews temporarily unavailable' }, { status: 503 });
	}
};
