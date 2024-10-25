import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if the user is not authenticated
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	// Get the current user's ID
	const currentUser = locals.pb.authStore.model;

	// Fetch jobs where the `added_by` field matches the current user's ID
	const jobs = await locals.pb.collection('job_listings').getFullList({
		sort: '-created',
		batchSize: 200,
		filter: `added_by = "${currentUser?.id}"`
	});

	return { jobs };
};
