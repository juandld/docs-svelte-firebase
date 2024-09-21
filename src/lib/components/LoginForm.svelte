<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { authHandlers } from '$lib/util/authHandle';
	import { getUserByID } from '$lib/util/userQueryHandle';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	interface User {
		uid: string;
		email: string | null;
	}

	interface DbResponse {
		username: string;
		fullName: string;
		uid: string;
		email: string;
	}

	let message = '';
	let email = '';
	let password = '';
	let error = false;

	const submit = async () => {
		if (email === '' || password === '') {
			error = true;
			message = 'Please enter an email and password';
			return;
		}

		try {
			// Loging in with email and password
			const response = await authHandlers.login(email, password);
			//Updating authStore for state management
			authStore.set({ currentUser: { uid: response.user.uid, email: response.user.email } });
			// Get the user's username from the database
			const dbResponse = await getUserByID(response.user.uid);
			// Redirect to user profile
			if (!dbResponse) {
				const redirect = dbResponse
				console.log(redirect)
				goto(`/${redirect}`);
			}
		} catch (error) {
			// Handle Firebase Auth errors
			if (error instanceof Error) {
				// Type guard to ensure error is an Error object
				message = error.message;
			}
		}
	};
</script>

<div class="card variant-ghost-surface p-4 flex justify-center items-center flex-col h-full">
	<h2 class="h2">Login</h2>

	<div class="m-2">
		<button class="btn variant-filled-secondary">Google</button>
		<button class="btn variant-filled-secondary">GitHub</button>
	</div>
	<h3>or</h3>
	<form class="grid grid-cols-1 gap-2">
		<label class="label">
			<span>Email</span>
			<input class="input" type="email" id="email" bind:value={email} />
		</label>
		<label class="label">
			<span>Password</span>
			<input class="input" type="password" id="password" bind:value={password} />
		</label>
		<button
			class="btn variant-filled-primary"
			use:popup={popupClick}
			on:click|preventDefault={submit}>Submit</button
		>
		{#if !error}
			<div class="card p-4 variant-filled-error" data-popup="popupClick">
				<p>{message}</p>
				<div class="arrow variant-filled-error" />
			</div>
		{/if}
	</form>
</div>
