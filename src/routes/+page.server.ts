// import businessInformation from libs/server/ggMyBusinessApi.ts
import { GMB_LOCATION_ID } from '$env/static/private';
import { businessInformation } from '$lib/server/ggMyBusinessApi';
import type { PageServerLoad } from './$types';

// Make type regularHoursPeriod
type regularHoursPeriod = {
	openDay: number;
	closeDay: number;
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
	const currentHour = now.getHours();
	// Look through the regularHours
	const regularHourPeriods: regularHoursPeriod[] = gmbLocationData.regularHours.periods;
	regularHourPeriods.forEach((period) => {
		const openDay = period.openDay;
		const closeDay = period.closeDay;
		const openTime = period.openTime;
		const closeTime = period.closeTime;
		if (currentDay >= openDay && currentDay <= closeDay) {
			if (currentHour >= openTime.hours && currentHour <= closeTime.hours) {
				isOpen = true;
			}
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
				if (currentHour >= openTime.hours && currentHour <= closeTime.hours) {
					isOpen = true;
				}
			}
		}
	});
	return isOpen;
}

export const load: PageServerLoad = async () => {
	// Extract the open hours
	const locationId: string = GMB_LOCATION_ID; // 'locations/1234567890'
	const locationReadMasks: string = 'name,title,openInfo,regularHours,specialHours,moreHours';
	const location = await businessInformation.locations.get({
		name: locationId,
		readMask: locationReadMasks
	});

	return {
		gmbLocationData: location.data,
		isOpen: checkOpenHours(location.data),
		serverMessage: 'hello from server load function'
	};
};
