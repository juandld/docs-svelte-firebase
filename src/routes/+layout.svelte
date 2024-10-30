<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';

	//My components
	import AuthButtons from '$lib/components/AuthButtons.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import VersionList from '$lib/components/VersionList.svelte';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	
	initializeStores();
	
	const drawerStore = getDrawerStore();
</script>

<!-- App Shell -->
<AppShell>
	{#snippet header()}
	
			<!-- App Bar -->
			<AppBar>
				{#snippet lead()}
					
						<a href="/">
							<strong class="text-xl uppercase">Skeleton</strong>
						</a>
					
					{/snippet}
				{#snippet children()}
					
						<a
							class="btn btn-sm variant-ghost-surface"
							href="https://github.com/juandld"
							target="_blank"
							rel="noreferrer"
						>
							GitHub
						</a>
					
					{/snippet}

				{#snippet trail()}
					
						<AuthButtons />
					
					{/snippet}
			</AppBar>
		
	{/snippet}

	<Drawer position="right">
		{#if $drawerStore.id === 'login'}
			<LoginForm />
		{:else if $drawerStore.id === 'version'}
			<VersionList />
		{:else}
			<p>You acheived quite the error</p>
		{/if}
	</Drawer>
	<!-- Page Route Content -->
	{@render children?.()}
</AppShell>
