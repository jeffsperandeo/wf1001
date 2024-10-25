import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { updateProfileSchema } from '$lib/schema';
import { validateData } from '$lib/utils';
import { serialize } from 'object-to-formdata';

export const load: PageServerLoad = ({ locals }) => {
	// Redirect if the user is not authenticated
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		try {
			const body = await request.formData();

			// Remove the avatar if it's an empty file
			if (body.has('avatar') && body.get('avatar') instanceof File && (body.get('avatar') as File).size === 0) {
				body.delete('avatar');
			}

			// Validate data
			const { formData, errors } = await validateData(body, updateProfileSchema);

			// Handle validation errors
			if (errors) {
				return fail(400, { data: formData, errors: errors.fieldErrors });
			}

			// Update the profile in PocketBase
			const updatedUser = await locals.pb.collection('users').update(
				locals.user?.id,
				(formData)
			);

			// Update local user state, ensuring we only store serializable data
			if (locals.user) {
				locals.user.name = updatedUser.name;
				locals.user.job_title = updatedUser.job_title;
				// Store the avatar URL instead of the file object
				locals.user.avatar = updatedUser.avatar 
					? locals.pb.files.getUrl(updatedUser, updatedUser.avatar)
					: null;
			}

			return { success: true };
		} catch (err) {
			console.error('Error updating profile:', err);
			throw error(500, 'Failed to update profile.');
		}
	}
};
