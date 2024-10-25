import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}
	// GET ALL THE JOBS
	const jobs = await locals.pb.collection('job_listings').getFullList({
		sort: '-created',
		batchSize: 200
	});

	console.log('Users ------ > ', jobs);
	return { jobs };
};
