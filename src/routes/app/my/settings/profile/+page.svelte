<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { getImageURL } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { currentUser } from '$lib/stores/user';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	$: currentUser.set(data.user);

	export let data;
	export let form;
	let loading: any;

	$: loading = false;
	const showPreview = (event: any) => {
		const target = event.target;
		const files = target.files;

		if (files.length > 0) {
			const src = URL.createObjectURL(files[0]);
			const preview = document.getElementById('avatar-preview') as HTMLImageElement;
			if (preview) {
				preview.src = src;
			}
		}
	};

	const submitUpdateProfile = () => {
		loading = true;
		return async ({ result }: any) => {
			switch (result.type) {
				case 'success':
					toast.success(`Profile updated successfully.`, {});
					await invalidateAll();
					break;
				case 'error':
					toast.error('Failed to update profile.', {});
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="flex h-full w-full flex-col">
	<form
		action="?/updateProfile"
		method="POST"
		class="flex w-full flex-col space-y-6"
		enctype="multipart/form-data"
		use:enhance={submitUpdateProfile}
	>
		<!-- Profile Header Section -->
		<Card class="w-full">
			<CardHeader>
				<div class="flex items-center space-x-6">
					<!-- Avatar -->
					<div class="relative h-32 w-32">
						{#if data.user?.avatar}
							<img
								class="h-32 w-32 rounded-full border shadow"
								src={data.user?.avatar
									? getImageURL(data.user?.collectionId, data.user?.id, data.user?.avatar)
									: `https://ui-avatars.com/api/?name=${data.user?.email}`}
								alt="User avatar"
								id="avatar-preview"
							/>
						{:else}
							<Icon
								icon="mdi-account-circle"
								class="text-base-100 h-full w-full scale-110 rounded-full bg-primary"
							/>
						{/if}

						<label for="avatar" class="absolute -bottom-0.5 -right-0.5 z-20 hover:cursor-pointer">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border bg-secondary transition-transform duration-300 hover:scale-105"
							>
								<Icon icon="mdi:pencil" class="h-5 w-5" />
							</div>
						</label>
					</div>

					<!-- Name and Job Title -->
					<div>
						<div class="text-3xl font-bold text-primary">
							Ali Muhammad {form?.data?.name ?? data?.user?.name}
						</div>
						<div class="text-xl text-gray-500">
							Administrator {form?.data?.job_title ?? data?.user?.job_title}
						</div>
					</div>
				</div>
			</CardHeader>
		</Card>

		<!-- Personal Information Section -->
		<Card class="w-full">
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<!-- Avatar Upload -->
				<div>
					<Label for="avatar">Profile Picture</Label>
					<input
						type="file"
						name="avatar"
						id="avatar"
						accept="image/*"
						hidden
						on:change={showPreview}
						disabled={loading}
					/>
					{#if form?.errors?.avatar}
						{#each form?.errors?.avatar as error}
							<span class="text-error text-sm">{error}</span>
						{/each}
					{/if}
				</div>

				<!-- Name Input -->
				<div>
					<Label for="name">Name</Label>
					<Input
						id="name"
						name="name"
						value={form?.data?.name ?? data?.user?.name}
						disabled={loading}
					/>
					{#if form?.errors?.name}
						<span class="text-error text-sm">{form.errors.name[0]}</span>
					{/if}
				</div>

				<!-- Job Title Input -->
				<div>
					<Label for="job_title">Job Title</Label>
					<Input
						id="job_title"
						name="job_title"
						value={form?.data?.job_title ?? data?.user?.job_title}
						disabled={loading}
					/>
					{#if form?.errors?.job_title}
						<span class="text-error text-sm">{form.errors.job_title[0]}</span>
					{/if}
				</div>

				<!-- Website Input -->
				<div>
					<Label for="website">Website</Label>
					<Input
						id="website"
						name="website"
						value={form?.data?.website ?? data?.user?.website}
						disabled={loading}
					/>
					{#if form?.errors?.website}
						<span class="text-error text-sm">{form.errors.website[0]}</span>
					{/if}
				</div>
			</CardContent>
		</Card>

		<!-- Actions Section -->
		<div class="w-full max-w-lg pt-6">
			<div class="flex w-full justify-between gap-4">
				<Button type="submit" disabled={loading}>
					<Icon icon="material-symbols:sync" class={`${loading ? 'animate-spin' : ''} h-5 w-5`} />
					Update
				</Button>

				<a href={`/users/${$currentUser.id}`} class="w-full">
					<Button variant="outline">
						Profile
						<Icon icon="mdi:arrow-right" class="h-5 w-5" />
					</Button>
				</a>
			</div>
		</div>
	</form>
</div>
