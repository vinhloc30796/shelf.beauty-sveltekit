import { afterEach, describe, expect, test, vi } from 'vitest';

import { trackConversion, type ConversionAction } from './analytics';

const conversionDestinations: Record<ConversionAction, string> = {
	booking: 'AW-123/mpO0CJ_Jg54ZEJue89oq',
	directions: 'AW-123/XeK7CPaZ2YUZEJue89oq',
	reviews: 'AW-123/Ww1qCPSC5bMZEJue89oq'
};

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('trackConversion', () => {
	test.each(Object.entries(conversionDestinations) as [ConversionAction, string][])(
		'reports the %s action with only its send_to destination',
		(action, sendTo) => {
			const gtag = vi.fn();
			vi.stubGlobal('window', { gtag });

			trackConversion('AW-123', action);

			expect(gtag).toHaveBeenCalledOnce();
			expect(gtag).toHaveBeenCalledWith('event', 'conversion', { send_to: sendTo });
			expect(gtag.mock.calls[0][2]).not.toHaveProperty('event_callback');
		}
	);

	test('does nothing when the tag ID is missing', () => {
		const gtag = vi.fn();
		vi.stubGlobal('window', { gtag });

		trackConversion(undefined, 'booking');

		expect(gtag).not.toHaveBeenCalled();
	});

	test('does nothing when gtag is absent or not callable', () => {
		vi.stubGlobal('window', {});
		expect(() => trackConversion('AW-123', 'booking')).not.toThrow();

		vi.stubGlobal('window', { gtag: 'not-a-function' });
		expect(() => trackConversion('AW-123', 'booking')).not.toThrow();
	});

	test('contains errors thrown by gtag', () => {
		vi.stubGlobal('window', {
			gtag: () => {
				throw new Error('analytics unavailable');
			}
		});

		expect(() => trackConversion('AW-123', 'booking')).not.toThrow();
	});
});
