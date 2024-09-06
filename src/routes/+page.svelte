<script>


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



