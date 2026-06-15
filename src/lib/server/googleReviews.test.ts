import { describe, expect, test } from 'vitest';
import { normalizeGoogleReviewsResponse } from './googleReviews';

describe('normalizeGoogleReviewsResponse', () => {
	test('maps Google review fields into public review data', () => {
		const result = normalizeGoogleReviewsResponse({
			reviews: [
				{
					reviewId: 'review-1',
					reviewer: { displayName: 'Mai Tran', isAnonymous: false },
					starRating: 'FIVE',
					comment: 'Careful service.',
					createTime: '2026-01-01T00:00:00Z',
					updateTime: '2026-01-02T00:00:00Z'
				}
			],
			averageRating: 4.9,
			totalReviewCount: 42,
			nextPageToken: 'next-token'
		});

		expect(result).toEqual({
			reviews: [
				{
					id: 'review-1',
					name: 'Mai Tran',
					stars: 5,
					quote: 'Careful service.',
					createTime: '2026-01-01T00:00:00Z',
					updateTime: '2026-01-02T00:00:00Z',
					isRatingOnly: false
				}
			],
			averageRating: 4.9,
			totalReviewCount: 42,
			nextPageToken: 'next-token',
			fetchedAt: expect.any(String)
		});
	});

	test('uses fallback author for anonymous reviews and supports rating-only reviews', () => {
		const result = normalizeGoogleReviewsResponse({
			reviews: [
				{
					name: 'accounts/1/locations/2/reviews/3',
					reviewer: { isAnonymous: true },
					starRating: 'FOUR'
				}
			]
		});

		expect(result.reviews).toEqual([
			{
				id: 'accounts/1/locations/2/reviews/3',
				name: 'Google guest',
				stars: 4,
				quote: '',
				createTime: undefined,
				updateTime: undefined,
				isRatingOnly: true
			}
		]);
		expect(result.nextPageToken).toBeUndefined();
	});
});
