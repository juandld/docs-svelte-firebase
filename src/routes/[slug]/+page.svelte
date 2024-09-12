<script lang="ts">
    import { authStore } from '$lib/stores/authStore.js';
    import { onMount } from 'svelte';
    export let data

    console.log(data);
</script>


{#if data}
    <p>{data}</p>
{:else}
    <h1>Loading...</h1>
    <button on:click={submit}>Submit</button>
{/if}
