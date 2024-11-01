<script lang="ts">
	import { onMount } from 'svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { db } from '$lib/util/firebase';

	import { ChamofileEditor } from '$lib/util/chamofiles/editPageHandle'; // Import the OOP ChamofileEditor

	// Initialize ChamofileEditor
	const chamofileEditor = new ChamofileEditor(db); // You might need to pass the Firestore instance if required

	// Set initial data
	let docID: string = $page.params.slug;
	let title: string = $state('Untitled masterpiece');
	let topics = ['topic1', 'topic2', 'topic3'];
	let value: string = $state('');

	// Load from local storage and sync to/from firebase
	onMount(async () => {
		const response = await chamofileEditor.loadEditor(docID, title, topics);
		if (response) {
			value = response.value;
		}
	});

	// Reactive sync to local and Firebase
	$effect(() => {
		console.log("Value changed: " + value);
		
		chamofileEditor.saveToLocalStorage(value);
		chamofileEditor.debouncedSaveToFirebase(value, docID, title, topics);
	});

	// Drawer settings for versions
	const drawerStore = getDrawerStore();
	

	const drawerSettingsV: DrawerSettings = {
		id: 'version',
		bgDrawer: 'variant-filled-surface text-white',
		bgBackdrop: 'bg-transparent',
		width: 'w-[50%]',
		height: '100%',
		padding: 'p-1',
		rounded: 'rounded-xl'
	};

	const drawerSettingsA: DrawerSettings = {
		id: 'call',
		bgDrawer: 'variant-filled-surface text-white',
		bgBackdrop: 'bg-transparent',
		width: 'w-[80%]',
		height: '100%',
		padding: 'p-1',
		rounded: 'rounded-xl'
	};

	const openDrawerVersions = () => {
		drawerStore.open(drawerSettingsV);
	};
	const openDrawerAiCall = () => {
		drawerStore.open(drawerSettingsA);
	};
</script>

<div class="">
	<div class="flex gap-2">
		<label class="w-1/2">
			<input class="input" type="text" bind:value={title} />
		</label>
		<select name="topic" id="">
			{#each topics as topic}
				<option value={topic}>{topic}</option>
			{/each}
		</select>
		<button class="btn variant-ghost" onclick={openDrawerVersions}>Versions</button>
		<button class="btn variant-ghost" onclick={openDrawerAiCall}>AI-call</button>
	</div>
	<br />
	<div class="">
		<input type="text" />
	</div>
</div>
