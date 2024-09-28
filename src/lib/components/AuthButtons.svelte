<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import { authStore } from '$lib/stores/authStore';
	import { authHandlers } from '$lib/util/authHandle';

	let loggedIn = false;
	let isDrawerOpen = false;
	// Change button text based on login state
	$: {
		if ($authStore.uid) {
			loggedIn = true;
			toggleDrawer();
		} else {
			loggedIn = false;
		}
	}

	const drawerStore = getDrawerStore();

	const drawerSettings: DrawerSettings = {
		id: 'login-drawer',
		bgDrawer: 'variant-filled-surface text-white',
		bgBackdrop: 'bg-gradient-to-tr from-orange-500/50 via-yellow-500/50 to-orange-500/50',
		width: 'md:w-[500px] w-full',
		height: 'max-h-[70%] h-[600px]',
		padding: 'p-6',
		rounded: 'rounded-xl'
	};

	// Subscribe to the store to track drawer state
	drawerStore.subscribe((state) => {
		isDrawerOpen = state.open || false;
	});

	// Toggle the drawer
	const toggleDrawer = () => {
		if (isDrawerOpen) {
			drawerStore.close(); // Close the drawer if it's open
		} else {
			drawerStore.open(drawerSettings); // Open the drawer if it's closed
		}
	};
</script>

<div>
	{#if loggedIn}
		<button on:click={authHandlers.logout}>Logout</button>
	{:else}
		<a href="register">
			<button class="btn btn-sm variant-ghost-surface"> Register </button>
		</a>

		<a href="#">
			<button class="btn btn-sm variant-filled" on:click={toggleDrawer}> Login </button>
		</a>
	{/if}
</div>
