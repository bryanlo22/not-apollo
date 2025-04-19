<script lang="ts">
	import Comment from '$lib/components/Comment.svelte'
	import PostInfo from '$lib/components/PostInfo.svelte'

	import type { CommentType } from '$lib/types/CommentType'
	import type { PostType } from '$lib/types/PostType'

	type Props = {
		post: PostType
		comments: {
			data: {
				children: CommentType[]
			}
		}[]
	}

	let { post, comments }: Props = $props()
</script>

{#if post}
	<div class="post">
		<PostInfo {post} showingSubredditName showingFullSelfText />
	</div>
	<div class="comments">
		{#if comments[1]}
			{#each comments[1]?.data?.children as comment}
				<Comment {comment} />
			{/each}
		{/if}
	</div>
{/if}

<style>
	.post {
		padding: 8px;
		background-color: #222;
		border-radius: 4px;
	}
	.comments {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
