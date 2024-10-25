import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	const users = await locals.pb.collection('users').getFullList({
		sort: '-created',
		batchSize: 200
	});

	const roles = await locals.pb.collection('roles').getFullList({
		batchSize: 200
	});

	const roleMap = new Map();
	roles.forEach((role: any) => {
		roleMap.set(role.id, role.name); 
	});

	const usersWithRoles = users.map((user: any) => {
		const roleName = roleMap.get(user.role); 
		return {
			...user,
			role: roleName || 'Unknown Role'
		};
	});

	return { users: usersWithRoles };
};
