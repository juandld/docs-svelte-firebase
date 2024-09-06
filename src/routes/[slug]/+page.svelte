<script lang="ts">    
  export let data;

</script>

<!-- Display user data or error message -->
{#if data.user}
    <div>User found:</div>
    <pre>{JSON.stringify(data.user, null, 2)}</pre>
{:else if error}
    <div>Error: {error}</div>
{/if}

<!-- Display docs -->
 {#if data.docs.length > 0}
    {#each data.docs as doc}
        <div>{doc.title}</div>
        <div>{doc.contents}</div>
    {/each}
{:else}
    <div>No docs found for this user, are you sure you have the right username?</div>
{/if}
