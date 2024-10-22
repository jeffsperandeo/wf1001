<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { animateMainStagger } from '$lib/animations';
	import Icon from '@iconify/svelte';
	const navigation = [
		{
			title: 'Profile',
			href: '/my/settings/profile',
			icon: 'mdi:account'
		},
		{
			title: 'Account',
			href: '/my/settings/account',
			icon: 'mdi:settings'
		},

		{
			title: 'Billing',
			href: '/my/settings/subscription',
			icon: 'weui:done2-filled'
		},

		{
			title: 'Security',
			href: '/my/settings/security',
			icon: 'material-symbols:lock-outline'
		}
	];

	onMount(() => {
		animateMainStagger();
	});
</script>

<div
	class="animate-item mx-auto flex h-full w-full max-w-6xl gap-5 rounded-lg md:border md:p-5 md:shadow-lg"
>
	<slot />
</div>
