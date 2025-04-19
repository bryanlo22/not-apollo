<script lang="ts">
	import Icon from '$lib/components/Icon.svelte'

	import { faArrowUp, faComment } from '@fortawesome/free-solid-svg-icons'

	import type { PostType } from '$lib/types/PostType'

	type Props = {
		post: PostType
		showingSubreddit: boolean
	}

	let { post, showingSubreddit }: Props = $props()
</script>

{#if showingSubreddit}
	<div class="subreddit-name">
		{post.data.subreddit}
	</div>
{/if}
<div class="stats">
	<div class="stat">
		<Icon data={faArrowUp} />
		{post.data.score}
	</div>
	<div class="stat">
		<Icon data={faComment} />
		{post.data.num_comments}
	</div>
</div>

<style>
	.stats {
		margin-top: 4px;
		display: flex;
		gap: 12px;
	}
	.subreddit-name {
		font-weight: bold;
	}
	.stat {
		display: flex;
		align-items: center;
		gap: 6px;
	}
</style>
