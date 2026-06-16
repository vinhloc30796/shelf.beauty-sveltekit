import { GMB_ACCOUNT_ID, GMB_LOCATION_ID } from '$env/static/private';
import { tryAuth } from './ggMyBusinessApi';

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const STALE_TTL_MS = 24 * 60 * 60 * 1000;
const REVIEWS_URL = 'https://mybusiness.googleapis.com/v4';

type GoogleStarRating = 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' | 'STAR_RATING_UNSPECIFIED';

type GoogleReview = {
	name?: string;
	reviewId?: string;
	reviewer?: {
		displayName?: string;
		isAnonymous?: boolean;
	};
	starRating?: GoogleStarRating;
	comment?: string;
	createTime?: string;
	updateTime?: string;
};

type GoogleReviewsResponse = {
	reviews?: GoogleReview[];
	averageRating?: number;
	totalReviewCount?: number;
	nextPageToken?: string;
};

export type PublicGoogleReview = {
	id: string;
	name: string;
	stars: number;
	quote: string;
	createTime?: string;
	updateTime?: string;
	isRatingOnly: boolean;
};

export type PublicGoogleReviewsPage = {
	reviews: PublicGoogleReview[];
	averageRating?: number;
	totalReviewCount?: number;
	nextPageToken?: string;
	fetchedAt: string;
};

type ReviewsCacheEntry = {
	storedAt: number;
	data: PublicGoogleReviewsPage;
};

export class GoogleReviewsUpstreamError extends Error {
	status: number;

	constructor(status: number, message = 'Google reviews upstream error') {
		super(message);
		this.status = status;
	}
}

const starRatingMap: Record<GoogleStarRating, number> = {
	STAR_RATING_UNSPECIFIED: 0,
	ONE: 1,
	TWO: 2,
	THREE: 3,
	FOUR: 4,
	FIVE: 5
};

const reviewsCache = new Map<string, ReviewsCacheEntry>();

export const normalizeGoogleReviewsResponse = (
	response: GoogleReviewsResponse
): PublicGoogleReviewsPage => ({
	reviews: (response.reviews ?? []).map((review, index) => {
		const quote = review.comment?.trim() ?? '';
		return {
			id: review.reviewId ?? review.name ?? `google-review-${index}`,
			name:
				review.reviewer?.isAnonymous || !review.reviewer?.displayName
					? 'Google guest'
					: review.reviewer.displayName,
			stars: review.starRating ? starRatingMap[review.starRating] : 0,
			quote,
			createTime: review.createTime,
			updateTime: review.updateTime,
			isRatingOnly: quote.length === 0
		};
	}),
	averageRating: response.averageRating,
	totalReviewCount: response.totalReviewCount,
	nextPageToken: response.nextPageToken,
	fetchedAt: new Date().toISOString()
});

const cacheKeyFor = (pageToken?: string) => pageToken ?? 'first-page';

const getFreshCache = (key: string) => {
	const cached = reviewsCache.get(key);
	if (!cached) return null;
	return Date.now() - cached.storedAt <= CACHE_TTL_MS ? cached.data : null;
};

const getStaleCache = (key: string) => {
	const cached = reviewsCache.get(key);
	if (!cached) return null;
	return Date.now() - cached.storedAt <= STALE_TTL_MS ? cached.data : null;
};

const buildReviewsUrl = (pageSize: number, pageToken?: string) => {
	const parent = `${GMB_ACCOUNT_ID}/${GMB_LOCATION_ID}`;
	const url = new URL(`${REVIEWS_URL}/${parent}/reviews`);
	url.searchParams.set('pageSize', String(Math.min(Math.max(pageSize, 1), 50)));
	url.searchParams.set('orderBy', 'updateTime desc');
	if (pageToken) {
		url.searchParams.set('pageToken', pageToken);
	}
	return url;
};

export async function listGoogleReviews({
	pageToken,
	pageSize = 10
}: {
	pageToken?: string;
	pageSize?: number;
} = {}): Promise<PublicGoogleReviewsPage> {
	const cacheKey = cacheKeyFor(pageToken);
	const freshCache = getFreshCache(cacheKey);
	if (freshCache) return freshCache;

	try {
		const auth = await tryAuth();
		if (!auth) {
			throw new GoogleReviewsUpstreamError(500, 'Google auth unavailable');
		}

		const url = buildReviewsUrl(pageSize, pageToken);
		const authHeaders = await auth.getRequestHeaders(url.toString());
		const response = await fetch(url, { headers: authHeaders as HeadersInit });

		if (!response.ok) {
			throw new GoogleReviewsUpstreamError(response.status, await response.text());
		}

		const data = normalizeGoogleReviewsResponse((await response.json()) as GoogleReviewsResponse);
		reviewsCache.set(cacheKey, { storedAt: Date.now(), data });
		return data;
	} catch (error) {
		const staleCache = getStaleCache(cacheKey);
		if (staleCache) return staleCache;
		throw error;
	}
}
