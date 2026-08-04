import { redirect, type RequestHandler } from '@sveltejs/kit';

const directionsUrl =
	'https://www.google.com/maps/dir/?api=1&destination=shelf+beauty+studio,+Yersin,+Ph%C6%B0%E1%BB%9Dng+10,+Dalat,+Lam+Dong&destination_place_id=ChIJHydiEXkTcTERBlm-4kPGIWk';

export const GET: RequestHandler = () => {
	redirect(302, directionsUrl);
};
