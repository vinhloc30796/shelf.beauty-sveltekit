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
async function tryAuth(): Promise<Auth.OAuth2Client | undefined> {
	// Try with OAuth2
	try {
		const oauth2Client = new google.auth.OAuth2(
			GCP_OAUTH_CLIENT_ID,
			GCP_OAUTH_CLIENT_SECRET,
			GCP_OAUTH_REDIRECT_URL
		);
		oauth2Client.setCredentials({ refresh_token: GCP_OAUTH_REFRESH_TOKEN });
		const token = await oauth2Client.getAccessToken();
		console.log(`oauth2Client result: success, `, token);
		google.options({ auth: oauth2Client });
		return oauth2Client;
	} catch (error) {
		console.error(`oauth2Client error: `, error);
	}

	// Return undefined if auth failed
	return undefined;
}

const auth = await tryAuth();

export const accountManagement = google.mybusinessaccountmanagement({
	version: 'v1',
	auth: auth
});
export const businessInformation = google.mybusinessbusinessinformation({
	version: 'v1',
	auth: auth
});

export async function testGmbApi() {
	// Get all accounts
	const locationReadMasks: string = 'name,title,openInfo,regularHours,specialHours,moreHours';
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
