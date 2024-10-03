<script>
	import { onMount } from 'svelte';
	import { authHandlers } from '$lib/util/authHandle';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/authStore';

	onMount(() => {
		if (browser) {
			const unsubscribe = authHandlers.authstatus((user) => {
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

<main class="w-11/12 mx-auto my-3">
    <!-- placeholder if laoding -->
	{#if $authStore.isLoading}
    <section class="card w-full">
        <div class="p-4 space-y-4">
            <div class="placeholder animate-pulse" />
            <div class="grid grid-cols-3 gap-8">
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
            </div>
            <div class="grid grid-cols-4 gap-4">
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
            </div>
        </div>
        <br>
        <br>
        <br>
        <div class="p-4 space-y-4">
            <div class="placeholder animate-pulse" />
            <br>
            <div class="grid grid-cols-3 gap-8">
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
            </div>
            <br>
            <div class="grid grid-cols-4 gap-4">
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
                <div class="placeholder animate-pulse" />
            </div>
        </div>
    </section>
	{:else}
		<slot />
	{/if}
</main>
