<script lang="ts">
	import Icon from '@iconify/svelte';
	import { writable, get } from 'svelte/store';
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/stores';
	// import { authStore, logoutUser } from '$lib/store/auth';
	// import { selectedProjectStore } from '$lib/store/project';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import ThemeToggle from './ThemeToggle.svelte';

	const collapsed = writable(false);

	export let projects: { label: string; value: string }[] = [];

	// Get user email from authStore
	let userEmail = 'user@example.com';

	// const unsubscribe = authStore.subscribe((auth) => {
	// 	if (auth.user && auth.user.email) {
	// 		userEmail = auth.user.email;
	// 	} else {
	// 		userEmail = 'user@example.com';
	// 	}
	// });

	onDestroy(() => {
		// unsubscribe();
	});

	// Initialize selectedProject to the first project if available
	let selectedProject: { label: string; value: string };

	function get_first_project(): { label: string; value: string } {
		selectedProject = projects.length > 0 ? projects[0] : { label: 'No project', value: '' };
		// set selected project in store
		console.log('Setting selected project in store');
		selectedProjectStore.set({ projectId: selectedProject.value });
		return selectedProject;
	}

	// $: projects && get_first_project();

	function toggleSidebar() {
		console.log('Toggling sidebar');
		collapsed.update((value) => !value);
	}

	async function handleLogout() {
		// await logoutUser();
		if (browser) {
			goto('/auth/login');
		}
	}

	const navGroups = [
		{
			label: null,
			items: [
				{ href: '/app/', icon: 'mdi:view-dashboard-outline', label: 'Dashboard' },
				{ href: '/app/my/settings/profile', icon: 'mdi:user-details', label: 'My Profile' },
				{ href: '/app/job-listings', icon: 'mdi:briefcase-search', label: 'Job Listings' },
				{ href: '/app/projects', icon: 'material-symbols:folder-managed-sharp', label: 'Projects' },
				{ href: '/app/Employees', icon: 'clarity:employee-group-solid', label: 'Employees' }
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
</script>

<div
	class="sidebar lato sticky left-0 top-0 flex h-screen flex-col border-r"
	class:collapsed={$collapsed}
>
	<!-- Navigation Menu -->
	<nav class="mt-4 flex-1">
		<!-- Project Selection Dropdown -->
		<div class="mb-4 flex gap-x-4 px-4 text-xs font-semibold text-gray-400">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" class="w-full justify-between">
						<!-- <span>{$collapsed ? selectedProject.label.charAt(0) : selectedProject.label}</span> -->
						{#if !$collapsed}
							<Icon icon="mdi:chevron-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
						{/if}
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<!-- User Email -->
					<DropdownMenu.Label class="px-4 py-2 text-sm font-medium">
						{userEmail}
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<!-- Projects List -->
					{#if projects.length > 0}
						<DropdownMenu.Group>
							{#each projects as project}
								<DropdownMenu.Item
									on:click={() => {
										selectedProject = project;
									}}
								>
									{#if selectedProject.value === project.value}
										<Icon icon="mdi:check" class="mr-2 h-4 w-4" />
									{:else}
										<span class="mr-2 h-4 w-4"></span>
									{/if}
									{project.label}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					{:else}
						<DropdownMenu.Item disabled>No projects found.</DropdownMenu.Item>
					{/if}

					<!-- Static Options -->
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item disabled>
							Add Project
							<span class="ml-auto rounded-full bg-yellow-200 px-2 py-1 text-xs text-yellow-800"
								>Coming Soon</span
							>
						</DropdownMenu.Item>
						<DropdownMenu.Item on:click={handleLogout} class="text-red-600">
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

	<!-- Sidebar Footer with Text Logo -->
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
			></Icon>
		</Button>
	</div>
</div>

<style>
	.sidebar {
		width: 250px;
		transition: width 0.3s;
	}
	.sidebar.collapsed {
		width: 80px;
	}
	.sidebar.collapsed .hidden-when-collapsed {
		display: none;
	}
</style>
