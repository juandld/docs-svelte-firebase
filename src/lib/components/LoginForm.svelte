<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { authHandlers } from '$lib/util/authHandlers';

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	let message = 'hello world';
	let email = '';
	let password = '';
	let error = false;

	const submit = async () => {
		const response = await authHandlers.login(email, password);
		console.log(response);
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
		<button class="btn variant-filled-primary" use:popup={popupClick} on:click|preventDefault={submit}
			>Submit</button
		>
		{#if !error}
			<div class="card p-4 variant-filled-error" data-popup="popupClick">
				<p>{message}</p>
				<div class="arrow variant-filled-error" />
			</div>
		{/if}
	</form>
</div>
