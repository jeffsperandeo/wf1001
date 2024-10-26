<script lang="ts">
	import type { PageData } from './$types.js';
	import SpatzLanding from '$lib/components/ui/SpatzLanding.svelte';
	export let data: PageData;
	import { siteInfo } from '$lib/data.js';
	import { currentUser } from '$lib/stores/user.js';
	import SpatzMarketing from '$lib/components/ui/SpatzMarketing.svelte';
	import WorxflowDashboard from '$lib/components/ui/WorxflowDashboard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Home : {siteInfo.name}</title>
	<meta
		name="description"
		content={`${siteInfo.name} is dedicated to providing top-notch services to our clients.`}
	/>
</svelte:head>

<div class="flex h-screen flex-col items-center justify-center gap-4">
	<h1 class="text-4xl font-bold">Welcome to Worxflow</h1>
	<Button
		size="lg"
		on:click={() => {
			goto('/app/dashboard');
		}}>Go to Dashboard</Button
	>
</div>
