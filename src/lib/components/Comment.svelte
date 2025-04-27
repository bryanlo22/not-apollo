<script lang="ts">
	import Comment from '$lib/components/Comment.svelte'

	import { htmlDecode } from '$lib/htmlDecode'

	import type { CommentType } from '$lib/types/CommentType'

	type Props = {
		comment: CommentType
		isAltColor?: boolean
		isReply?: boolean
	}

	let { comment, isAltColor = false, isReply = false }: Props = $props()

	let isHidden = $state(false)

	function getRedditUrl(permalink: string) {
		return 'https://old.reddit.com' + permalink
	}
</script>

<a
	class="comment"
	class:alt={isAltColor}
	class:reply={isReply}
	class:hidden={isHidden}
	href={getRedditUrl(comment.data.permalink)}
	onclick={(event) => {
		event.stopPropagation()
		event.preventDefault()
		isHidden = !isHidden
	}}
>
	<div class="author" class:mod={comment.data.distinguished == 'moderator'}>
		{comment.data.author}
	</div>
	<div class="content">
		{@html htmlDecode(comment.data.body_html)}
		{#if comment?.data?.replies?.data?.children}
			{#each comment?.data?.replies?.data?.children as childComment}
				{#if childComment.data.author}
					<Comment comment={childComment} isAltColor={!isAltColor} isReply />
				{/if}
			{/each}
		{/if}
	</div>
</a>

<style>
	.comment {
		padding: 8px;
		background-color: #222;
		border-radius: 4px;
	}
	.comment:hover {
		cursor: pointer;
		background-color: #282828;
	}
	.alt {
		background-color: #333;
	}
	.alt:hover {
		cursor: pointer;
		background-color: #383838;
	}
	.reply {
		margin-top: 8px;
	}
	.hidden .content {
		display: none;
	}
	.content {
		word-break: break-word;
	}
	a {
		display: block;
		color: unset;
		text-decoration: none;
	}
	a:hover {
		text-decoration: none;
	}
	.mod {
		color: hsl(116, 80%, 50%);
	}
</style>
