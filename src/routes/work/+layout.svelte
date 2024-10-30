<script lang="ts">
	import { onMount } from 'svelte';
	import { authHandlers } from '$lib/util/auth/authHandle';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/authStore';
	import type { User } from '$lib/types/user';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();



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


<main class="w-11/12 mx-auto my-3">
    <!-- placeholder if laoding -->
	{#if $authStore.isLoading}
    <section class="card w-full">
        <div class="p-4 space-y-4">
            <div class="placeholder animate-pulse"></div>
            <div class="grid grid-cols-3 gap-8">
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
            </div>
            <div class="grid grid-cols-4 gap-4">
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
            </div>
        </div>
        <br>
        <br>
        <br>
        <div class="p-4 space-y-4">
            <div class="placeholder animate-pulse"></div>
            <br>
            <div class="grid grid-cols-3 gap-8">
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
            </div>
            <br>
            <div class="grid grid-cols-4 gap-4">
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
                <div class="placeholder animate-pulse"></div>
            </div>
        </div>
    </section>
	{:else}
		{@render children?.()}
	{/if}
</main>
