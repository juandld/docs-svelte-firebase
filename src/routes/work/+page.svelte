<script>
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */

	const carta = new Carta({
        sanitizer: false,
    });

	let value = '';
</script>

<MarkdownEditor {carta} theme="github-dark" bind:value />

<style>

</style>