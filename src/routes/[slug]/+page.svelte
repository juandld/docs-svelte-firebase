<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Timestamp } from "firebase/firestore";
	import chamoFileService from "$lib/util/chamofiles/chamofileHandle";

	const chamofileCRUD = new chamoFileService();
	interface Props {
		data: {
		userDetails: {
			email: string;
			username: string;
			fullName: string;
		}
		posts: { 
			title: string 
			updatedAt: Timestamp
			postID: string
		}[];
	};
	}

	let { data }: Props = $props();


	const newChamofile = async() => {
    const newChamofileID = await chamofileCRUD.create(data.userDetails.username);
    goto("/work/" + newChamofileID);
}

</script>

{#if data}
	<div class="card">
		<p>{data.userDetails.email}</p>
		<p>{data.userDetails.username}</p>
		<p>{data.userDetails.fullName}</p>
	</div>
	<br>

	{#if data.posts}
		<button class="btn variant-filled" onclick={newChamofile}>New Chamofile</button>

		<h2>{data.userDetails.username}'s Chamofiles</h2>
		<div>
			{#each data.posts as post}
			<a href={"/work/" + post.postID} onclick={() => goto("/work/" + post.postID)}>					<div class="card variant-ghost-surface w-1/2">
						<h3 class="h3">{post.title}</h3>
						<p>Last updated: {post.updatedAt}</p>
					</div>
				</a>
			{/each}
		</div>
	{:else} 
        <div class="flex flex-col">
            <h2 class="h2">This user has no posts</h2>
            <button class="btn variant-filled" onclick={newChamofile}>Write a new post</button>
        </div>
	{/if}
{:else}
	<div class="placeholder"></div>
{/if}
