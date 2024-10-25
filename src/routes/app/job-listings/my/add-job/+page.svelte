<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';

	let loading = false;
	let errors: Record<string, string[]> = {};
	let formData = {
		title: '',
		description: '',
		employment_type: '',
		remote: true,
		deadline: ''
	};

	const submitAddJob = () => {
		loading = true;
		return async ({ result }: any) => {
			switch (result.type) {
				case 'success':
					toast.success('Job added successfully.', {});
					await invalidateAll();
					break;
				case 'error':
					toast.error('Failed to add job.', {});
					errors = result.data.errors || {};
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="flex h-full w-full flex-col p-6">
	<form
		action="?/addJob"
		method="POST"
		class="flex w-full flex-col space-y-6"
		use:enhance={submitAddJob}
	>
		<!-- Add Job Section -->
		<div class="w-full space-y-4 rounded-lg shadow-md">
			<h2 class="mb-4 text-xl font-semibold">Add New Job</h2>

			<!-- Job Title Input -->
			<div>
				<Label for="title">Job Title</Label>
				<input
					id="title"
					name="title"
					type="text"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
					bind:value={formData.title}
					placeholder="Enter job title"
					disabled={loading}
				/>
				{#if errors.title}
					<p class="text-sm text-red-500">{errors.title[0]}</p>
				{/if}
			</div>

			<!-- Job Description Input -->
			<div>
				<Label for="description">Job Description</Label>
				<textarea
					id="description"
					name="description"
					rows="4"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
					bind:value={formData.description}
					placeholder="Describe the job"
					disabled={loading}
				></textarea>
				{#if errors.description}
					<p class="text-sm text-red-500">{errors.description[0]}</p>
				{/if}
			</div>

			<!-- Employment Type Select -->
			<div>
				<Label for="employment_type">Employment Type</Label>
				<select
					id="employment_type"
					name="employment_type"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
					bind:value={formData.employment_type}
					disabled={loading}
				>
					<option value="" disabled>Select Employment Type</option>
					<option value="full-time">Full-Time</option>
					<option value="part-time">Part-Time</option>
					<option value="contract">Contract</option>
				</select>
				{#if errors.employment_type}
					<p class="text-sm text-red-500">{errors.employment_type[0]}</p>
				{/if}
			</div>

			<!-- Remote Checkbox -->
			<!-- <div class="mt-4 flex items-center space-x-2">
				<input
					id="remote"
					name="remote"
					type="checkbox"
					class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					bind:checked={formData.remote}
					disabled={loading}
				/>
				<Label for="remote">Remote</Label>
			</div> -->

			<!-- Deadline Input -->
			<div class="mt-4">
				<Label for="deadline">Deadline</Label>
				<input
					id="deadline"
					name="deadline"
					type="datetime-local"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
					bind:value={formData.deadline}
					disabled={loading}
				/>
				{#if errors.deadline}
					<p class="text-sm text-red-500">{errors.deadline[0]}</p>
				{/if}
			</div>
		</div>

		<!-- Actions Section -->
		<div class="w-full max-w-lg pt-6">
			<div class="flex w-full justify-between gap-4">
				<Button type="submit" disabled={true}>
					{#if loading}
						<Icon icon="mdi:loading" />
					{/if}
					Not Available Yet
				</Button>
			</div>
		</div>
	</form>
</div>
