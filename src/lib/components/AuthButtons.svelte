<script lang="ts">
	import { run } from 'svelte/legacy';

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import { authStore } from '$lib/stores/authStore';
	import { authHandlers } from '$lib/util/auth/authHandle';

	let loggedIn = $state(false);
	let isDrawerOpen = $state(false);

	const drawerStore = getDrawerStore();

	const drawerSettings: DrawerSettings = {
		id: 'login',
		bgDrawer: 'variant-filled-surface text-white',
		bgBackdrop: 'bg-gradient-to-tr from-orange-500/50 via-yellow-500/50 to-orange-500/50',
		width: 'md:w-[500px] w-full',
		height: 'min-h-[400px] max-h-[70%]',
		padding: 'p-6',
		rounded: 'rounded-xl'
	};

	// Subscribe to the store to track drawer state
	drawerStore.subscribe((state) => {
		isDrawerOpen = state.open || false;
	});

	// Toggle the drawer
	const openDrawer = () => {
		drawerStore.open(drawerSettings); // Open the drawer if it's closed
		isDrawerOpen = true;
	};
	// Change button text based on login state
	run(() => {
		if ($authStore.currentUser) {
			loggedIn = true;
			if (isDrawerOpen && $drawerStore.id === 'login') {
				drawerStore.close(); // Close the drawer if it's open
				isDrawerOpen = false;
			}
		} else {
			loggedIn = false;
		}
	});
</script>

<div>
	{#if $authStore.currentUser}
		<button onclick={authHandlers.logout}>Logout</button>
	{:else}
		<a href="register">
			<button class="btn btn-sm variant-ghost-surface"> Register </button>
		</a>

		<a href="#">
			<button class="btn btn-sm variant-filled" onclick={openDrawer}> Login </button>
		</a>
	{/if}
</div>
