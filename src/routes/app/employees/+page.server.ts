import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
	// Get data from the layout load function using parent()
	const { userRole } = await parent();

	const currentUser = locals.pb.authStore.model;

	const roles = await locals.pb.collection('roles').getFullList({
		batchSize: 200
	});

	const roleMap = new Map();
	roles.forEach((role: any) => {
		roleMap.set(role.id, role.name);
	});

	const roleHierarchy = ['admin', 'manager', 'technician'];
	const currentUserRoleIndex = roleHierarchy.indexOf(userRole);

	const users = await locals.pb.collection('users').getFullList({
		sort: '-created',
		batchSize: 200
	});

	const usersWithRoles = users
		.map((user: any) => {
			const roleName = roleMap.get(user.role) || 'Unknown Role';
			return {
				...user,
				role: roleName
			};
		})
		.filter((user: any) => {
			const userRoleIndex = roleHierarchy.indexOf(user.role);
			return userRoleIndex > currentUserRoleIndex && user.verified;
		});

	return { employees: usersWithRoles };
};
