<script lang="ts">
	import { onMount } from 'svelte';
	import { authHandlers } from '$lib/util/authHandle';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/authStore';
	import type { User } from '$lib/types/user';

	
	onMount(() => {
		if (browser) {
			const unsubscribe = authHandlers.authstatus((user: User) => {
				authStore.update((curr) => ({
					...curr,
					isLoading: false,
					currentUser: user
				}));

				if (!user && window.location.pathname !== '/') {
					goto('/');
				}
			});

			return unsubscribe; // Ensure the unsubscribe function is returned synchronously for cleanup
		}
	});
	
</script>

<main class="p-10">
	<slot />
</main>
