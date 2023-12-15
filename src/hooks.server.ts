import { redirect } from '@sveltejs/kit'
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { PUBLIC_GRAPHQL_URL } from '$env/static/public';
import { ProfileStore } from '$houdini';

export const handleFetch: HandleFetch = ({ event, request, fetch }) => {
	const cookie = event.request.headers.get('cookie')
	if (
		request.url === PUBLIC_GRAPHQL_URL &&
		cookie !== null
	) {
		request.headers.set('cookie', cookie);
	}

	return fetch(request);
}


const unProtectedRoutes = ['/', '/login'];
export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('connect.sid');
	if (!sessionId && !unProtectedRoutes.includes(event.url.pathname)) {
		throw redirect(303, '/');
	}
	const profile = new ProfileStore()
	const { data } = await profile.fetch({event})
	if (data?.profile) {
		event.locals.profile = data?.profile
	} else {
		if (!unProtectedRoutes.includes(event.url.pathname)) {
			throw redirect(303, '/');
		}
	}
	return resolve(event);
};