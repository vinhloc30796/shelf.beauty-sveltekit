import { beforeEach, describe, expect, test, vi } from 'vitest';

const listGoogleReviews = vi.fn();

vi.mock('$lib/server/googleReviews', () => ({
	GoogleReviewsUpstreamError: class GoogleReviewsUpstreamError extends Error {
		status: number;

		constructor(status: number, message = 'Google reviews upstream error') {
			super(message);
			this.status = status;
		}
	},
	listGoogleReviews
}));

describe('GET /api/google-reviews', () => {
	beforeEach(() => {
		listGoogleReviews.mockReset();
	});

	test('fetches next review page and sets shared cache headers', async () => {
		const { GET } = await import('./+server');
		const setHeaders = vi.fn();
		listGoogleReviews.mockResolvedValue({
			reviews: [],
			averageRating: 5,
			totalReviewCount: 1,
			nextPageToken: undefined,
			fetchedAt: '2026-01-01T00:00:00.000Z'
		});

		const response = await GET({
			url: new URL('https://shelf.beauty/api/google-reviews?pageToken=abc'),
			setHeaders
		} as never);

		expect(listGoogleReviews).toHaveBeenCalledWith({ pageSize: 10, pageToken: 'abc' });
		expect(setHeaders).toHaveBeenCalledWith({
			'cache-control': 'public, s-maxage=21600, stale-while-revalidate=86400'
		});
		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({
			reviews: [],
			averageRating: 5,
			totalReviewCount: 1
		});
	});

	test('maps Google quota errors to a controlled 503 response', async () => {
		const { GET } = await import('./+server');
		const { GoogleReviewsUpstreamError } = await import('$lib/server/googleReviews');
		const setHeaders = vi.fn();
		listGoogleReviews.mockRejectedValue(new GoogleReviewsUpstreamError(429));

		const response = await GET({
			url: new URL('https://shelf.beauty/api/google-reviews?pageToken=abc'),
			setHeaders
		} as never);

		expect(response.status).toBe(503);
		expect(await response.json()).toEqual({
			error: 'Google reviews temporarily unavailable'
		});
	});
});
