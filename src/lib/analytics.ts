export type ConversionAction = 'booking' | 'directions' | 'reviews';

const conversionLabels: Record<ConversionAction, string> = {
	booking: 'mpO0CJ_Jg54ZEJue89oq',
	directions: 'XeK7CPaZ2YUZEJue89oq',
	reviews: 'Ww1qCPSC5bMZEJue89oq'
};

export const trackConversion = (tagId: string | undefined, action: ConversionAction): void => {
	if (!tagId || typeof window === 'undefined') return;

	const gtag: unknown = Reflect.get(window, 'gtag');
	if (typeof gtag !== 'function') return;

	try {
		gtag('event', 'conversion', {
			send_to: `${tagId}/${conversionLabels[action]}`
		});
	} catch {
		// Analytics must never interfere with the user's navigation.
	}
};
