<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte';
	import { lazyLoad } from '$lib/lazyLoad';
	import { Input } from '$lib/components/ui/input/index.js';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import Icon from '@iconify/svelte';
	import { animateMainStagger } from '$lib/animations';
	import { Button } from '$lib/components/ui/button/index.js';

	import { gsap } from 'gsap';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';

	export let data: any;
	let hidden = true;

	let filter = '';
	let showScrollToTop = false;

	// Pagination
	let currentPage = 1;
	const jobsPerPage = 10;
	let totalPages = Math.ceil(data.jobs.length / jobsPerPage);

	// Sorting options
	let sortOption = 'all';

	// Reactive block to filter jobs based on the filter input
	$: filteredJobs = (() => {
		let result = data.jobs.filter(
			(job: any) =>
				job.title.toLowerCase().includes(filter.toLowerCase()) ||
				job.description.toLowerCase().includes(filter.toLowerCase())
		);
		return result;
	})();

	// Reactive block for paginated jobs
	$: paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

	// Pagination handlers
	const nextPage = () => {
		if (currentPage < totalPages) {
			currentPage += 1;
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			currentPage -= 1;
		}
	};

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

	onMount(async () => {
		await tick();
		animateMainStagger();
		window.addEventListener('scroll', handleScroll);

		if (typeof window !== 'undefined') {
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);
			hidden = false;

			// Animation
			gsap.fromTo(
				'.animate-job',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);

			// Lazy load images
			document.querySelectorAll('.job-wrapper').forEach((el) => {
				lazyLoad(el as HTMLElement);
			});
			ScrollTrigger.refresh();

			onDestroy(() => {
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

<div class={`${hidden ? 'opacity-0' : ''} mx-auto`}>
	<div class="animate-item">
		<div class="bg-base-100 flex items-center justify-between mx-auto h-full w-full">
			<h1 class="flex items-center gap-2 text-7xl font-bold text-primary">
				<span class="animate-job">My Jobs</span>
				<span class="animate-db font-thin leading-[6rem] text-primary/50">Listings</span>
			</h1>

			<Button variant="default" size="lg" on:click={()=>{
                goto('/app/job-listings/my/add-job')
            }}>Add Job</Button>
		</div>

		<!-- Add an input field to filter jobs by title or description -->
		<div class="sticky top-[57px] z-50 mb-5 bg-background pt-5">
			<div
				class="animate-input mb-5 flex items-center rounded-lg border bg-background bg-background px-2 focus-within:ring-1 focus-within:ring-foreground focus-within:ring-offset-1"
			>
				<Icon icon={`material-symbols:search`} class="h-7 w-7" />
				<Input
					type="text"
					class="border-none p-2 outline-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder="Search jobs by title or description..."
					bind:value={filter}
				/>
			</div>

			<div class="flex items-center justify-between border-b pb-2 text-xl font-thin">
				<!-- Display the total count of filtered jobs -->
				<div>{filter ? 'query matches' : 'total jobs'}: {filteredJobs.length}</div>

				<!-- Sorting options can be added here -->
				<div class="flex items-center gap-2">
					<Button
						size="sm"
						variant={sortOption === 'all' ? 'default' : 'ghost'}
						on:click={() => (sortOption = 'all')}
						class="flex items-center gap-2 text-xs transition-all duration-300"
					>
						<div>all</div>
						<Icon icon="material-symbols:background-grid-small" class="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>

		<!-- Display paginated jobs -->
		<div class="animate-grid space-y-4 pb-40">
			{#each paginatedJobs as job}
				<div
					class="job-wrapper group/jobCard cursor-pointer rounded-lg border p-4 shadow transition-all duration-300 hover:border-muted-foreground"
				>
					<div class="flex flex-col">
						<h2 class="text-lg font-bold">{job.title}</h2>
						<p class="text-sm">{job.description}</p>
						<p class="text-gray text-xs">
							Remote: <Badge variant="secondary">
								{job.remote ? 'Yes' : 'No'}
							</Badge>
						</p>
						<p class="text-gray text-xs">
							Employment Type:

							<Badge variant="secondary">
								{job.employment_type.join(', ')}
							</Badge>
						</p>
						<p class="text-gray text-xs">
							Deadline:
							<Badge variant="destructive" class="text-white">
								{new Date(job.deadline).toLocaleDateString()}
							</Badge>
						</p>
					</div>
				</div>
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
