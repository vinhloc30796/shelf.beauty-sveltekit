// API methods to interact with the GET https://mybusinessaccountmanagement.googleapis.com/v1/
// Authentication flow is using OAuth 2.0

import {
	GCP_OAUTH_CLIENT_ID,
	GCP_OAUTH_CLIENT_SECRET,
	GCP_OAUTH_REDIRECT_URL,
	GCP_OAUTH_REFRESH_TOKEN,
	GMB_LOCATION_ID
} from '$env/static/private';
import { google } from 'googleapis';

// const SCOPES = ['https://www.googleapis.com/auth/business.manage'];
const oauth2Client = new google.auth.OAuth2(
	GCP_OAUTH_CLIENT_ID,
	GCP_OAUTH_CLIENT_SECRET,
	GCP_OAUTH_REDIRECT_URL
);
oauth2Client.setCredentials({ refresh_token: GCP_OAUTH_REFRESH_TOKEN });

export const accountManagement = google.mybusinessaccountmanagement({
	version: 'v1',
	auth: oauth2Client
});
export const businessInformation = google.mybusinessbusinessinformation({
	version: 'v1',
	auth: oauth2Client
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
