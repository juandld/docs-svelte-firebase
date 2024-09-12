<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { authHandlers } from '$lib/util/authHandlers';
	import { createUser } from '$lib/util/registerHandle';

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	let email = '';
	let username = '';
	let fullName = '';
	let password = '';
	let password2 = '';
	let popupMessage = '';

	const submit = async () => {
		if (password !== password2) {
			popupMessage = 'Passwords do not match';
			return;
		}

		if (email === '' || username === '' || fullName === '' || password === '') {
			popupMessage = 'Please fill in all the required fields';
			return;
		}

		try {
			// Sign up with email and password auth service
			const responseAuth = await authHandlers.signup(email, password);
			const uID = responseAuth;
			// Create a new user in the database
			await createUser(uID, email, username, fullName);
			// Update authStore for state management
			authStore.update(() => ({
				currentUser: {
					email: email,
					uid: uID
				}
			}));
			// Redirect to user profile
			goto(`/${username}`);
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
				switch (error.message) {
					case 'Firebase: Error (auth/email-already-in-use).':
						popupMessage = 'Email is already in use';
						break;
					case 'Firebase: Error (auth/invalid-email).':
						popupMessage = 'Invalid email address';
						break;
					case 'Firebase: Error (auth/weak-password).':
						popupMessage = 'Password is too weak';
						break;
					default:
						popupMessage = 'An error occurred during signup: ' + error.message;
				}
			} else {
				popupMessage = 'An unknown error occurred';
			}
		}
	};
</script>

<div class="card variant-ghost-surface w-full p-4 flex justify-center items-center flex-col">
	<form class="grid grid-cols-1 gap-2">
		<label class="label">
			<span>Email</span>
			<input class="input text-white" type="email" bind:value={email} />
		</label>
		<label class="label">
			<span>Username</span>
			<input class="input text-white" type="text" bind:value={username} />
		</label>
		<label class="label">
			<span>Name</span>
			<input class="input text-white" type="text" bind:value={fullName} />
		</label>
		<label class="label">
			<span>Password</span>
			<input class="input text-white" type="password" bind:value={password} />
		</label>
		<label class="label">
			<span>Confirm Password</span>
			<input class="input text-white" type="password" bind:value={password2} />
		</label>
	</form>
	<button class="btn variant-filled-surface m-2" on:click={submit} use:popup={popupClick}>
		Register
	</button>
</div>

<div class="card p-4 variant-filled-error" data-popup="popupClick">
	<p>{popupMessage}</p>
	<div class="arrow variant-filled-error" />
</div>
