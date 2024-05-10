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
async function tryAuth(): Promise<Auth.GoogleAuth | Auth.OAuth2Client | undefined> {
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

	// Return undefined if both methods fail
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

export function testGmbApi() {
	const locationReadMasks: string = 'name,title,openInfo,regularHours,specialHours,moreHours';
	accountManagement.accounts.list({}).then((res) => {
		// Get all accounts
		const allAccounts = res.data.accounts;
		console.log(`allAccounts: ${allAccounts}`);
		// Get all locations for each account
		(allAccounts as any[]).forEach((account) => {
			const currentAccountName = account.name;
			console.log(`currentAccountName: ${currentAccountName}`);
			//
			businessInformation.accounts.locations
				.list({ parent: currentAccountName, readMask: locationReadMasks })
				.then((res) => {
					const locations = res.data.locations;
					console.log(`locations: ${locations}`);
				});
		});
		// Finally, try getting the main location
		businessInformation.locations
			.get({ name: GMB_LOCATION_ID, readMask: locationReadMasks })
			.then((res) => {
				const location = res.data;
				console.log(location);
			});
	});
}
