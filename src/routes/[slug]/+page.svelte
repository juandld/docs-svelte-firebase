<script lang="ts">
	export let data: {
		email: string;
		username: string;
		fullName: string;
		posts: { title: string }[];
	};
</script>

{#if data}
	<div class="card">
		<p>{data.email}</p>
		<p>{data.username}</p>
		<p>{data.fullName}</p>
	</div>

	{#if data.posts}
		<h2>{data.username}'s Posts</h2>
		<div>
			<h2>Posts</h2>
			{#each data.posts as post}
				<p>{post.title}</p>
			{/each}
		</div>
	{:else}
        <div class="flex flex-col">

            <h2 class="h2">This user has no posts</h2>
            <button class="btn variant-filled">Write a new post</button>
        </div>
	{/if}
{:else}
	<div class="placeholder" />
{/if}
