<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import { onMount, tick, onDestroy } from 'svelte';
	import { lazyLoad } from '$lib/lazyLoad';
	import { Input } from '$lib/components/ui/input/index.js';
	import { page } from '$app/stores';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import Icon from '@iconify/svelte';
	import { animateMainStagger } from '$lib/animations';
	import { Button } from '$lib/components/ui/button/index.js';
	import { currentUser } from '$lib/stores/user.js';
	import { gsap } from 'gsap';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	export let data: any;
	console.log(data);
	let hidden = true;

	let filter = '';
	let showScrollToTop = false;
	let currentPage = 1;
	const usersPerPage = 10; // Number of employees per page

	$: $currentUser = data.user;

	// Sorting and filtering options
	let sortOption = 'all';
	let roleFilter = 'all'; // New role filter option

	// Reactive block to handle filtering employees based on filter text, sort option, and role filter
	$: filteredUsers = (() => {
		let result = data.employees.filter((user: any) =>
			user.username.toLowerCase().includes(filter.toLowerCase())
		);

		// Apply role filter
		if (roleFilter !== 'all') {
			result = result.filter((user: any) => user.role === roleFilter);
		}


		return result;
	})();

	// Calculate total pages
	$: totalPages = Math.ceil(filteredUsers.length / usersPerPage);

	// Get the current slice of employees based on the page
	$: paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * usersPerPage,
		currentPage * usersPerPage
	);

	const handleScroll = () => {
		const shouldShow = window.scrollY > 100;
		if (shouldShow !== showScrollToTop) {
			showScrollToTop = shouldShow;
			if (showScrollToTop) {
				gsap.to('.scroll-to-top-btn', {
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				});
			} else {
				gsap.to('.scroll-to-top-btn', {
					opacity: 0,
					y: 20,
					duration: 1,
					ease: 'power4.out'
				});
			}
		}
	};

	const nextPage = () => {
		if (currentPage < totalPages) {
			currentPage++;
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			currentPage--;
		}
	};

	onMount(async () => {
		await tick();
		animateMainStagger();
		window.addEventListener('scroll', handleScroll);

		if (typeof window !== 'undefined') {
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);
			hidden = false;

			gsap.fromTo(
				'.animate-user',
				{ opacity: 0, y: -10 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);
			gsap.fromTo(
				'.animate-db',
				{ opacity: 0, x: -50 },
				{
					opacity: 1,
					x: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);
			gsap.fromTo(
				'.animate-input',
				{ opacity: 0, scale: 0.95 },
				{
					opacity: 1,
					scale: 1,
					duration: 1,
					ease: 'power4.out'
				}
			);
			gsap.fromTo(
				'.animate-grid',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					delay: 0.25,
					y: 0,
					duration: 3,
					ease: 'power4.out'
				}
			);

			document.querySelectorAll('.user-wrapper').forEach((el) => {
				lazyLoad(el as HTMLElement);
			});
			ScrollTrigger.refresh();

			const unsubscribe = page.subscribe(() => {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
				ScrollTrigger.refresh();
			});

			onDestroy(() => {
				unsubscribe();
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
				window.removeEventListener('scroll', handleScroll);
			});
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
				window.removeEventListener('scroll', handleScroll);
			});
		}
	});
</script>

<div class={`${hidden ? 'opacity-0' : ''} mx-auto `}>
	<div class="animate-item min-h-screen">
		<div class="bg-base-100 mx-auto h-full w-full">
			<h1 class="flex items-center gap-2 text-7xl font-bold text-primary">
				<span class="animate-user">Employees'</span>
				<span class="animate-db font-thin leading-[6rem] text-primary/50">Database</span>
			</h1>
		</div>

		<!-- Add an input field to filter by username -->
		<div class="sticky top-[57px] z-50 mb-5 bg-background pt-5">
			<div
				class="animate-input mb-5 flex items-center rounded-lg border bg-background bg-background px-2 focus-within:ring-1 focus-within:ring-foreground focus-within:ring-offset-1"
			>
				<Icon icon={`material-symbols:search`} class="h-7 w-7" />
				<Input
					type="text"
					class="border-none p-2 outline-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder="Search employees by username..."
					bind:value={filter}
				/>
			</div>

			<div class="flex items-center justify-between border-b pb-2 text-xl font-thin">
				<!-- Display the total count of filtered employees -->
				<div>{filter ? 'query matches' : 'total employees'}: {filteredUsers.length}</div>

				<!-- Role filter buttons -->
				<div class="flex items-center gap-2">
					<Button
						size="sm"
						variant={roleFilter === 'all' ? 'default' : 'ghost'}
						on:click={() => (roleFilter = 'all')}
						class="flex items-center gap-2 text-xs transition-all duration-300"
					>
						<div>All</div>
					</Button>
					<Button
						size="sm"
						variant={roleFilter === 'admin' ? 'default' : 'ghost'}
						on:click={() => (roleFilter = 'admin')}
						class="flex items-center gap-2 text-xs transition-all duration-300"
					>
						<div>Admin</div>
					</Button>
					<Button
						size="sm"
						variant={roleFilter === 'manager' ? 'default' : 'ghost'}
						on:click={() => (roleFilter = 'manager')}
						class="flex items-center gap-2 text-xs transition-all duration-300"
					>
						<div>Manager</div>
					</Button>
					<Button
						size="sm"
						variant={roleFilter === 'technician' ? 'default' : 'ghost'}
						on:click={() => (roleFilter = 'technician')}
						class="flex items-center gap-2 text-xs transition-all duration-300"
					>
						<div>Technician</div>
					</Button>
				</div>
			</div>
		</div>

		<!-- Display filtered and paginated employees -->
		<div class="animate-grid grid grid-cols-1 gap-2 px-1 pb-40 sm:grid-cols-2 md:grid-cols-3">
			{#each paginatedUsers as user}
				<a href={`/app/employees/${user.id}`} class="user-wrapper group/userCard">
					<div
						class={`rounded-lg border p-3 shadow transition-all duration-300 md:hover:border-muted-foreground`}
					>
						<div class="flex flex-row items-center gap-2">
							<div>
								<div class="h-10 w-10">
									<img
										class="transition-translate h-full w-full rounded-full border object-cover shadow duration-200 md:group-hover/userCard:scale-[102%]"
										alt={user.username}
										src={user?.avatar
											? getImageURL(user?.collectionId, user?.id, user?.avatar)
											: `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
									/>
								</div>
							</div>
							<div class="flex flex-col">
								<div class="flex space-x-2">
									<h1 class="truncate whitespace-nowrap text-sm">{user.username}</h1>
									<Badge variant={user.role}>{user.role}</Badge>
								</div>

								<h1 class="truncate whitespace-nowrap text-sm">{user.job_title}</h1>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Pagination Controls -->
		<div class="flex items-center justify-center space-x-4">
			<Button variant="ghost" size="sm" on:click={prevPage} disabled={currentPage === 1}
				>Previous</Button
			>
			<span>Page {currentPage} of {totalPages}</span>
			<Button variant="ghost" size="sm" on:click={nextPage} disabled={currentPage === totalPages}
				>Next</Button
			>
		</div>
	</div>
</div>

{#if showScrollToTop === true}
	<div class="flex justify-center">
		<ScrollToTopButton />
	</div>
{/if}
