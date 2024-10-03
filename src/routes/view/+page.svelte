<script lang="ts">
	import { onMount } from 'svelte';
	import { chamofileCRUD } from '$lib/util/chamofileHandle';
	import { Carta } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { code } from '@cartamd/plugin-code';

	let html: string = '';

	const carta = new Carta({
		sanitizer: false,
		extensions: [emoji(), code()],
	});

    onMount(async () => {
        const markdown = '# Hello, World!';	
        html = await carta.render(markdown);
    })
</script>

<div class="prose prose-invert p-4">
	{@html html}
</div>


