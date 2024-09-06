<script lang="ts">
	import { goto } from '$app/navigation';

	let email = '';
	let name = '';
	let password = '';
	let password2 = '';

	const submit = async () => {
		
		const passwordMatches = password === password2;
		if (passwordMatches) {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },

				body: JSON.stringify({ action: 'signup', email, password })
			});
		} else {
			alert('Passwords do not match');
		}
	};
</script>

<div class="card variant-ghost-surface w-full p-4 flex justify-center items-center flex-col">
	<form action="" class="grid grid-cols-1 gap-2">
		<label class="label">
			<span>Email</span>
			<input class="input text-white" type="email" id="email" bind:value={email} />
		</label>
		<label class="label">
			<span>Name</span>
			<input class="input text-white" type="text" id="name" bind:value={name} />
		</label>
		<label class="label"
			>Password
			<input class="input text-white" type="password" id="password" bind:value={password} />
		</label>
		<label class="label"
			>Confirm Password
			<input class="input text-white" type="password" id="password2" bind:value={password2} />
		</label>
	</form>
	<button class="btn variant-filled-surface m-2" on:click={submit}>Register </button>
</div>
