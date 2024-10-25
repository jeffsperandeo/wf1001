import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}
};

export const actions: Actions = {
	addJob: async ({ request, locals }) => {
		const body = await request.formData();

		// Handle 'remote' checkbox manually
		const remote = body.get('remote') === 'on';
		body.set('remote', remote ? 'true' : 'false');

		// Extract form data manually
		const title = body.get('title') as string;
		const description = body.get('description') as string;
		const employment_type = body.get('employment_type') as string;
		const deadline = body.get('deadline') as string;

		// Check if required fields are provided (you can extend these checks as needed)
		if (!title || !description || !employment_type || !deadline) {
			return fail(400, { message: 'All fields are required' });
		}

		const data = {
			title,
			description,
			employment_type: employment_type.split(',').map((t) => t.trim()),
			deadline,
			remote: remote,
			added_by: locals.user.id
		};
		try {
			const job = await locals.pb.collection('job_listings').create(data);

			return { success: true, job };
		} catch (err) {
			return fail(500, { message: 'Failed to add job' });
		}
	}
};
