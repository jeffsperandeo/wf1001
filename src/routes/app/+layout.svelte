<script lang="ts">
	import Footer from '$lib/components/ui/Footer.svelte';
	import Command from '$lib/components/ui/Command.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { currentUser } from '$lib/stores/user';
	import { toast } from '$lib/stores/toast';

	export let data: PageData;
	const userRole: string = data.userRole;
	$: currentUser.set(data.user);

	// START VIEW TRANSITIONS API
	import { onNavigate } from '$app/navigation';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import type { PageData } from '../$types';

	onNavigate((navigation) => {
		// @ts-ignore
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-ignore 
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
	// END VIEW TRANSITIONS API
</script>

<ModeWatcher defaultMode={'dark'} />
<Toaster position="bottom-right" richColors={false} />
<Toast icon={$toast.icon} type={$toast.type} message={$toast.message} show={$toast.show} />

{#if $currentUser}
	<Command />
{/if}

<div class="flex min-h-[calc(100svh)] flex-row md:min-h-screen">
	<Sidebar {userRole} />

	<main class="custom-scrollbar mx-auto my-2 w-full flex-grow overflow-x-clip px-10 md:my-5">
		<slot />
	</main>
</div>
<Footer />

<style>
	html,
	body {
		height: 100%;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}
</style>
