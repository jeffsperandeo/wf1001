<script lang="ts">
	import Icon from '@iconify/svelte';
	import { writable } from 'svelte/store';
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import ThemeToggle from './ThemeToggle.svelte';
	import { currentUser } from '$lib/stores/user';

	const collapsed = writable(false);
	export let userRole: string = 'technician';

	let userEmail = 'user@example.com';

	const unsubscribe = currentUser.subscribe((user) => {
		if (user && user.email) {
			userEmail = user.email;
		} else {
			userEmail = 'user@example.com';
		}
	});

	onDestroy(() => {
		unsubscribe();
	});

	function toggleSidebar() {
		collapsed.update((value) => !value);
	}

	async function handleLogout() {
		if (browser) {
			goto('/auth/logout');
		}
	}

	// Navigation groups
	const navGroups = [
		{
			label: null,
			items: [
				{ href: '/', icon: 'mdi:view-dashboard-outline', label: 'Dashboard' },
				{ href: '/app/my/settings/profile', icon: 'mdi:user-details', label: 'My Profile' },
				{ href: '/app/job-listings', icon: 'mdi:briefcase-search', label: 'Job Listings' },
				...(userRole === 'manager' || userRole === 'admin'
					? [
							{
								href: '/app/job-listings/my',
								icon: 'mdi:briefcase-account',
								label: 'My Job Listings'
							}
						]
					: []),
				{ href: '/app/projects', icon: 'material-symbols:folder-managed-sharp', label: 'Projects' },
				...(userRole !== 'technician'
					? [{ href: '/app/employees', icon: 'clarity:employee-group-solid', label: 'Employees' }]
					: []),
				...(userRole !== 'technician' && userRole !== 'manager'
					? [{ href: '/app/users', icon: 'mdi:user-group', label: 'Users' }]
					: [])
			]
		},
		{
			label: 'CONFIGURATION',
			items: [
				{ href: '/app/my/settings/account', icon: 'mdi:cog-outline', label: 'Account Settings' }
			]
		},
		{
			label: 'GET HELP',
			items: [
				{ href: '/docs', icon: 'mdi:book-outline', label: 'Docs' },
				{ href: '/support', icon: 'material-symbols-light:headset-mic', label: 'Contact Support' }
			]
		}
	];

	// Redirection if technician or manager is on restricted routes
	if (
		browser &&
		($page.url.pathname === '/app/users' || // Restricted for both technician and manager
			(userRole === 'technician' && $page.url.pathname === '/app/employees')) // Restricted for technician
	) {
		goto('/');
	}
</script>

<div
	class="sidebar lato sticky left-0 top-0 flex h-screen flex-col border-r"
	class:collapsed={$collapsed}
>
	<nav class="mt-4 flex-1">
		<div class="mb-4 flex gap-x-4 px-4 text-xs font-semibold text-gray-400">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" class="w-full justify-between">
						<span>{$collapsed ? $currentUser?.name : $currentUser?.name}</span>
						{#if !$collapsed}
							<Icon icon="mdi:chevron-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
						{/if}
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Label class="px-4 py-2 text-sm font-medium">{userEmail}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item on:click={handleLogout} class="cursor-pointer text-red-600">
							<Icon icon="mdi:logout" class="mr-2 h-4 w-4" />
							Logout
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<ThemeToggle />
		</div>

		{#each navGroups as group}
			{#if group.label}
				<div class={cn('mt-8 px-4 text-xs font-semibold text-gray-400', $collapsed && 'hidden')}>
					{group.label}
				</div>
			{/if}
			<ul class="my-2 space-y-3 px-4">
				{#each group.items as item}
					<li>
						<a
							href={item.href}
							class={cn(
								'flex items-center space-x-2 rounded p-2',
								$page.url.pathname === item.href
									? 'bg-secondary text-primary dark:bg-white/80 dark:text-secondary'
									: 'text-primary hover:bg-secondary dark:hover:bg-white/70 dark:hover:text-secondary',
								$collapsed && 'justify-center'
							)}
						>
							<Icon icon={item.icon} class="h-5 w-5" />
							<span class="hidden-when-collapsed">{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/each}
	</nav>

	<div
		class="mt-auto flex items-center p-4"
		class:justify-center={$collapsed}
		class:justify-between={!$collapsed}
	>
		<h3 class="hidden-when-collapsed text-center">
			<span class="text-lg font-bold">Worxflow</span>
		</h3>
		<Button on:click={toggleSidebar}>
			<Icon
				icon={$collapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'}
				class="h-5 w-5 cursor-pointer"
			/>
		</Button>
	</div>
</div>
