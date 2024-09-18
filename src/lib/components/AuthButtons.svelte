<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	

	let loggedIn = false;
	let user = null;

	const drawerStore = getDrawerStore();

	const drawerSettings: DrawerSettings = {
		id: 'login-drawer',
		bgDrawer: 'variant-filled-surface text-white',
		bgBackdrop: 'bg-gradient-to-tr from-orange-500/50 via-yellow-500/50 to-orange-500/50',
		width: 'md:w-[500px] w-full',
		height: 'max-h-[100%] h-[700px]',
		padding: 'p-6',
		rounded: 'rounded-xl'
	};

	const toggleDrawer = async () => {
		drawerStore.open(drawerSettings);
	};
</script>

<div>
	{#if loggedIn}
		<div class="dropdown">
			<p>{user.email}</p>
		</div>
	{:else}
		<a href="register">
			<button class="btn btn-sm variant-ghost-surface"> Register </button>
		</a>

		<a href="#">
			<button class="btn btn-sm variant-filled" on:click={toggleDrawer}> Login </button>
		</a>
	{/if}
</div>
