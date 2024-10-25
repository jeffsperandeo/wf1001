import { pb } from '$lib/pocketbase';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		// Get the currently authenticated user
		const user = pb.authStore.model;

		if (!user) {
			return new Response(JSON.stringify({ error: 'User not authenticated' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Return the user's profile data
		return new Response(JSON.stringify(user), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Failed to fetch profile:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
