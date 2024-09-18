<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { auth } from '$lib/util/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { browser } from '$app/environment';
	
	onMount(() => {
		console.log("1");
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) {
				console.log("Congrats, logged in!");
			} else {
				console.log("Not logged in");
				authStore.update((curr) => ({
					...curr,
					isLoading: false,
					currentUser: null
				}));
			}
			
			if (
				browser &&
				!$authStore.currentUser &&
				window.location.pathname !== '/'
			) {
				console.log("2");
				//window.location.href = '/';
				
				console.log($authStore.currentUser);
			}
		});
		return unsubscribe;
	});


</script>

<main class="mainContainer flex justify-center flex-col">
	<h2 class="h2">This is the layout</h2>
	<slot />
</main>

<style>
	.mainContainer {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>

<main class="mainContainer">
	<slot />
</main>
