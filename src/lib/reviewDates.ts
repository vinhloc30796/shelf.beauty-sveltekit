type ReviewLanguage = 'vi' | 'en';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatReviewTimestamp = (
	timestamp: string | undefined,
	language: ReviewLanguage,
	now = new Date()
) => {
	if (!timestamp) return '';

	const reviewDate = new Date(timestamp);
	if (Number.isNaN(reviewDate.getTime())) return '';

	const diffDays = Math.max(
		0,
		Math.floor((startOfDay(now).getTime() - startOfDay(reviewDate).getTime()) / DAY_MS)
	);

	if (diffDays === 0) {
		return language === 'vi' ? 'Hôm nay' : 'Today';
	}

	if (diffDays < 7) {
		if (language === 'vi') return `${diffDays} ngày trước`;
		return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
	}

	return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(reviewDate);
};
