<script>
	import {db} from '$lib/firebase/config'
	import { collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';

	onMount(async () => {
		console.log("mounted");
		
		const querySnapshot = await getDocs(collection(db, "posts"));
		querySnapshot.forEach((doc) => {
			console.log(`${doc.id} => ${doc.data()}`);
		});
	})

	let featured = [1, 2, 3, 4]
</script>

<div class="container mx-auto flex flex-col justify-center items-center space-y-10 p-4">
	<div class=" text-center flex flex-col items-center space-y-4">
		<h2 class="h2">Welcome to TalkingDocs.</h2>
		<p>Bitches love this website</p>
	</div>
	
	<div class="container">
		<h3>Featured</h3>
		{#each featured as card }
			<div class="card">{card}</div>
		{/each}
	</div>
</div>



