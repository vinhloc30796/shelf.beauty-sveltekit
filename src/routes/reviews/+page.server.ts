import type { PageServerLoad } from './$types';
import { listGoogleReviews, type PublicGoogleReview } from '$lib/server/googleReviews';

const fallbackReviews: PublicGoogleReview[] = [
	{
		id: 'fallback-nguyen-ngoc-tu-tu',
		stars: 5,
		name: 'Nguyen Ngoc Tu Tu',
		quote:
			'Mình đi du lịch tiện ghé vào làm, mà tiệm nail rất xinh nha mụi ngừ, có 2 em cún cũng thân thiện lứm. Giá cả ok, dịch vụ ok lun. Highly recommended.',
		isRatingOnly: false
	},
	{
		id: 'fallback-thu-nguyen',
		stars: 5,
		name: 'Thư Nguyễn',
		quote:
			'Mấy bạn nhân viên rất dễ thương, nhiệt tình lắm ạ. Mình làm ở đây 2 lần rồi, lần sau sẽ ủng hộ lại nè. Mấy bạn làm rất kỹ luôn ạ.',
		isRatingOnly: false
	},
	{
		id: 'fallback-julia-larson',
		stars: 5,
		name: 'Julia Larson',
		quote:
			'Fabulous attention to detail and service from my nail tech. They made sure to ask questions and make sure you are getting exactly the nails you would like.',
		isRatingOnly: false
	},
	{
		id: 'fallback-bryan-tan',
		stars: 5,
		name: 'Bryan Tan',
		quote:
			'Shelf Beauty Studio was absolutely amazing. The staff were skilled, meticulous, accommodating, and patient even with elaborate designs.',
		isRatingOnly: false
	},
	{
		id: 'fallback-tam-mii',
		stars: 5,
		name: 'Tam Mii따미',
		quote:
			'Tiệm gội đầu nhỏ nhỏ xinh xinh, giá siêu bình dân, các bạn nhân viên rất nhiệt tình dễ thương. Nhất định sẽ quay lại mỗi dịp lên Đà Lạt chơi.',
		isRatingOnly: false
	}
];

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, s-maxage=21600, stale-while-revalidate=86400'
	});

	try {
		const googleReviews = await listGoogleReviews({ pageSize: 10 });
		return { ...googleReviews, error: null };
	} catch (error) {
		console.error('reviews page google reviews error:', error);
		return {
			reviews: fallbackReviews,
			averageRating: undefined,
			totalReviewCount: undefined,
			nextPageToken: undefined,
			fetchedAt: new Date().toISOString(),
			error: 'google-reviews-unavailable'
		};
	}
};
