import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/schema';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {
			user: null,
			userRole: null,
			form: await superValidate(zod(formSchema))
		};
	}

	const roleId = locals.user.role;
	let userRole = null;

	try {
		const role = await locals.pb.collection('roles').getOne(roleId);
		userRole = role?.name || 'Unknown Role';
	} catch {
		userRole = 'Unknown Role';
	}

	locals.user.role = userRole;

	return {
		user: locals.user,
		userRole,
		form: await superValidate(zod(formSchema))
	};
};
