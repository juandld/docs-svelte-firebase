<script lang="ts">
	import { onMount } from 'svelte';
	import  chamoFileService  from '$lib/util/chamofiles/chamofileHandle';


	let html: string = $state('');


    onMount(async () => {
        const markdown = '# Hello, World!';	
    })
</script>

<div class="prose prose-invert p-4">
	{@html html}
</div>


