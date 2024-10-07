<script lang="ts">
	import { authHandlers } from '$lib/util/auth/authHandle';
	import { getUserByID } from '$lib/util/auth/userQueryHandle';
	import { goto } from '$app/navigation';
	import AuthPopup from '$lib/components/mini/AuthPopup.svelte';


	let popupMessage = '';
	let email = '';
	let password = '';
	let error = false;

	const submit = async () => {
		if (email === '' || password === '') {
			error = true;
			popupMessage = 'Please enter an email and password';
			return;
		}

		try {
			// Loging in with email and password
			const response = await authHandlers.login(email, password);
			// Get the user's username from the database
			const dbResponse = await getUserByID(response.user.uid);
			// Redirect to user profile
			if (dbResponse) {
				const promise = await dbResponse;
				const data = promise.data();
				if (data) {
					const redirect = data.username; // Get the username from the data
					goto(`/${redirect}`);
				}
			}
		} catch (error) {
			// Handle Firebase Auth errors
			if (error instanceof Error) {
				// Type guard to ensure error is an Error object
				switch (error.message) {
					case 'Firebase: Error (auth/invalid-email).':
						popupMessage = 'Invalid email address';
						break;
					case 'Firebase: Error (auth/user-not-found).':
						popupMessage = 'User not found';
						break;
					case 'Firebase: Error (auth/wrong-password).':
						popupMessage = 'Check your password';
						break;
					default:
						popupMessage = error.message;
				}
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
			on:click|preventDefault={submit}>Submit</button
		>
		{#if !error}
			<div class="card p-4 variant-filled-error" data-popup="popupClick">
				<p>{popupMessage}</p>
				<div class="arrow variant-filled-error" />
			</div>
		{/if}
	</form>
	{#if popupMessage}
		<AuthPopup {popupMessage} />
	{/if}
</div>
