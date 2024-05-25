// API methods to interact with the GET https://mybusinessaccountmanagement.googleapis.com/v1/
// Authentication flow is using OAuth 2.0

import {
	GCP_OAUTH_CLIENT_ID,
	GCP_OAUTH_CLIENT_SECRET,
	GCP_OAUTH_REDIRECT_URL,
	GCP_OAUTH_REFRESH_TOKEN,
	GMB_LOCATION_ID
} from '$env/static/private';
import { Auth, google } from 'googleapis';

// const SCOPES = ['https://www.googleapis.com/auth/business.manage'];
export async function tryAuth(): Promise<Auth.OAuth2Client | undefined> {
	// Try with OAuth2
	let startTime = Date.now();
	try {
		const promise = new Promise<Auth.OAuth2Client>((resolve, reject) => {
			// console.log('tryAuth: begins');
			const auth = new google.auth.OAuth2(
				GCP_OAUTH_CLIENT_ID,
				GCP_OAUTH_CLIENT_SECRET,
				GCP_OAUTH_REDIRECT_URL
			);
			// console.log('tryAuth: auth created, took ', Date.now() - startTime, 'ms');
			// startTime = Date.now();
			auth.setCredentials({ refresh_token: GCP_OAUTH_REFRESH_TOKEN });
			// console.log('tryAuth: setCredentials, took ', Date.now() - startTime, 'ms');
			// startTime = Date.now();
			resolve(auth);
			// console.log('tryAuth: resolve, took ', Date.now() - startTime, 'ms');
		});
		return promise;
	} catch (error) {
		console.error(`oauth2Client error: `, error);
	}

	// Return undefined if auth failed
	return undefined;
}

export async function testGmbApi() {
	// Get all accounts
	const locationReadMasks: string = 'name,title,openInfo,regularHours,specialHours,moreHours';
	const auth = await tryAuth();
	const accountManagement = google.mybusinessaccountmanagement({ version: 'v1', auth });
	const businessInformation = google.mybusinessbusinessinformation({ version: 'v1', auth });
	const allAccounts = await accountManagement.accounts.list({});
	console.log(`allAccounts: `, allAccounts.data.accounts);
	// Get all locations for each account
	allAccounts.data.accounts?.forEach(async (account: any) => {
		console.log(`working on account: `, account.name)
		const locations = await businessInformation.accounts.locations.list({
			parent: account.name,
			readMask: locationReadMasks
		});
		if (locations.data.locations) {
			console.log(`locations: `, locations.data.locations);
		} else {
			console.log(`locations: none`);
		}
	});
	// Finally, try getting the main location
	const specifiedLocation = await businessInformation.locations.get({
		name: GMB_LOCATION_ID,
		readMask: locationReadMasks
	});

	console.log(`specifiedLocation: `, specifiedLocation);
}
