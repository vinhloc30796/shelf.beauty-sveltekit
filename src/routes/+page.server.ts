// +page.server.ts
import { GMB_LOCATION_ID } from '$env/static/private';
import { businessInformation } from '$lib/server/ggMyBusinessApi';
import type { PageServerLoad } from './$types';

// Make type regularHoursPeriod
type regularHoursPeriod = {
	openDay: string;
	closeDay: string;
	openTime: {
		hours: number;
		minutes: number;
	};
	closeTime: {
		hours: number;
		minutes: number;
	};
};

// Make type specialHoursPeriod
type specialHoursPeriod = {
	startDate: {
		year: number;
		month: number;
		day: number;
	};
	endDate: {
		year: number;
		month: number;
		day: number;
	};
	isClosed: boolean;
	openTime: {
		hours: number;
		minutes: number;
	};
	closeTime: {
		hours: number;
		minutes: number;
	};
};

const checkOpenHours = (gmbLocationData: any) => {
	let isOpen = false;
	// Get current date and time
	const now = new Date();
	const currentDay = now.getDay();
	const currentWeekday = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
	const currentHour = now.getHours();
	const currentHourUtcPlus7 = now.getUTCHours() + 7;
	console.log(
		`currentDay: ${currentDay}; currentWeekday: ${currentWeekday}; currentHour: ${currentHour}`
	);
	// Look through the regularHours
	const regularHourPeriods: regularHoursPeriod[] = gmbLocationData.regularHours.periods;
	regularHourPeriods.forEach((period) => {
		const openDay = period.openDay;
		const closeDay = period.closeDay;
		const openTime = period.openTime;
		const closeTime = period.closeTime;
		if (
			currentWeekday == openDay &&
			currentWeekday == closeDay &&
			currentHourUtcPlus7 >= openTime.hours &&
			currentHourUtcPlus7 <= closeTime.hours
		) {
			isOpen = true;
		}
	});
	// Look through the specialHours to see if it's closed
	const specialHourPeriods: specialHoursPeriod[] = gmbLocationData.specialHours.specialHourPeriods;
	specialHourPeriods.forEach((period) => {
		const startDate = period.startDate;
		const endDate = period.endDate;
		const isClosed = period.isClosed;
		const openTime = period.openTime;
		const closeTime = period.closeTime;
		// Check if the current date is within the special hours
		if (
			now >= new Date(startDate.year, startDate.month, startDate.day) &&
			now <= new Date(endDate.year, endDate.month, endDate.day)
		) {
			if (isClosed) {
				isOpen = false;
			} else {
				if (currentHourUtcPlus7 >= openTime.hours && currentHourUtcPlus7 <= closeTime.hours) {
					isOpen = true;
				}
			}
		}
	});
	return isOpen;
};

// Convert days to Vietnamese
const convertDaysToVietnamese = (openDayEN: string) => {
	let openDayVN = '';
	switch (openDayEN) {
		case 'MONDAY':
			openDayVN = 'Thứ Hai (Mon)';
			break;
		case 'TUESDAY':
			openDayVN = 'Thứ Ba (Tue)';
			break;
		case 'WEDNESDAY':
			openDayVN = 'Thứ Tư (Wed)';
			break;
		case 'THURSDAY':
			openDayVN = 'Thứ Năm (Thu)';
			break;
		case 'FRIDAY':
			openDayVN = 'Thứ Sáu (Fri)';
			break;
		case 'SATURDAY':
			openDayVN = 'Thứ Bảy (Sat)';
			break;
		case 'SUNDAY':
			openDayVN = 'Chủ Nhật (Sun)';
			break;
		default:
			openDayVN = 'Không xác định';
			break;
	}
	return openDayVN;
};


// TODO: Move the GMB API call to a server API
// that can only be called from the client
// to ensure (a) security of the API key (b) less time to first paint
export const load: PageServerLoad = async () => {
	// Pull data
	const locationId: string = GMB_LOCATION_ID; // 'locations/1234567890'
	const locationReadMasks: string = 'name,title,openInfo,regularHours,specialHours,moreHours';
	const locationPromise = businessInformation.locations.get({
		name: locationId,
		readMask: locationReadMasks
	}).then((res) => res.data).catch((error) => {
		console.error(`businessInformation.locations error: ${error}`);
		return null;
	});
	// Downstream promises
	const isOpenPromise = locationPromise.then((location) => location ? checkOpenHours(location) : null);
	const regularHourPeriodsPromise = locationPromise.then((location) => {
		if (!location) return [];
		return location.regularHours?.periods?.map((period) => {
			const openDayVN = convertDaysToVietnamese(period.openDay?.toUpperCase());
			const openTime = period.openTime;
			const closeTime = period.closeTime;
			return { openDay: openDayVN, openTime: openTime, closeTime: closeTime };
		});
	});

	// Return promises for streaming
	return {
		isOpenPromise: isOpenPromise,
		regularHourPeriodsPromise: regularHourPeriodsPromise,
	};
};
