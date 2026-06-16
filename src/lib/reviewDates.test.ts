import { describe, expect, test } from 'vitest';
import { formatReviewTimestamp } from './reviewDates';

const now = new Date('2026-06-16T12:00:00+07:00');

describe('formatReviewTimestamp', () => {
	test('formats recent English review times as relative days', () => {
		expect(formatReviewTimestamp('2026-06-14T05:00:00Z', 'en', now)).toBe('2 days ago');
		expect(formatReviewTimestamp('2026-06-15T05:00:00Z', 'en', now)).toBe('1 day ago');
	});

	test('formats recent Vietnamese review times as relative days', () => {
		expect(formatReviewTimestamp('2026-06-14T05:00:00Z', 'vi', now)).toBe('2 ngày trước');
		expect(formatReviewTimestamp('2026-06-15T05:00:00Z', 'vi', now)).toBe('1 ngày trước');
	});

	test('formats older review times as short localized dates', () => {
		expect(formatReviewTimestamp('2026-01-12T03:00:00Z', 'en', now)).toBe('Jan 12, 2026');
		expect(formatReviewTimestamp('2026-01-12T03:00:00Z', 'vi', now)).toBe('12 thg 1, 2026');
	});

	test('returns an empty label for missing or invalid times', () => {
		expect(formatReviewTimestamp(undefined, 'en', now)).toBe('');
		expect(formatReviewTimestamp('not-a-date', 'vi', now)).toBe('');
	});
});
