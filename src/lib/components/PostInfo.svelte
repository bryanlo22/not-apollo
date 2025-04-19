<script lang="ts">
	import PostStats from '$lib/components/PostStats.svelte'

	import { htmlDecode } from '$lib/htmlDecode'

	import type { PostType } from '$lib/types/PostType'

	type Props = {
		post: PostType
		showingSubredditName: boolean
		showingFullSelfText?: boolean
	}

	let { post, showingSubredditName, showingFullSelfText = false }: Props = $props()

	function isLight(hex: string) {
		if (hex == null) {
			return
		}
		let red = parseInt(hex.slice(1, 3), 16)
		let green = parseInt(hex.slice(3, 5), 16)
		let blue = parseInt(hex.slice(5, 7), 16)
		// https://www.w3.org/TR/AERT/#color-contrast
		return (red * 299 + green * 587 + blue * 114) / 1000 > 128
	}

	function getTwitchSrc(url: string) {
		let clip = url.replace('https://clips.twitch.tv/', 'https://clips.twitch.tv/embed?clip=')
		return `${clip}&parent=not-apollo.pages.dev`
	}

	function unescapeMedia(str: string) {
		return htmlDecode(str).replace('position:absolute', '').replace('position: absolute', '')
	}
</script>

<div class="title" class:mod={post.data.distinguished == 'moderator'}>
	{#if post.data.link_flair_text}
		<span
			class="flair"
			class:light={isLight(post.data.link_flair_background_color)}
			style="background-color: {post.data.link_flair_background_color}"
		>
			{htmlDecode(post.data.link_flair_text)}
		</span>
	{/if}
	{htmlDecode(post.data.title)}
</div>
{#if post.data.media_metadata}
	{#each Object.entries(post.data.media_metadata) as [key, value]}
		{#if value.status == 'valid'}
			<img class="image" alt="" src={value?.s?.u?.replace(/&amp;/g, '&')} loading="lazy" />
		{/if}
	{/each}
{:else if post.data.media}
	{#if post.data.media.type == 'clips.twitch.tv'}
		<iframe
			title="twitch tv"
			src={getTwitchSrc(post.data.url)}
			frameborder="0"
			allowfullscreen
			scrolling="no"
			loading="lazy"
		></iframe>
	{:else if post.data.media.type == 'youtube.com'}
		<div class="youtube-iframe-container">
			{@html unescapeMedia(post.data.media_embed.content)}
		</div>
	{:else if post.data.media.reddit_video}
		<!-- svelte-ignore a11y_media_has_caption -->
		<video controls>
			<source
				src={post.data.media.reddit_video.fallback_url.replace(/&amp;/g, '&')}
				type="video/mp4"
			/>
			Your browser does not support the video tag.
		</video>
	{:else}
		<div class="other-embed">
			{@html unescapeMedia(post.data.media_embed.content)}
		</div>
	{/if}
{:else if post.data.post_hint == 'image'}
	<img class="image" alt="" src={post.data.url} loading="lazy" />
{:else if post.data.url}
	<div>
		<a
			class="external-link"
			href={post.data.url}
			target="_blank"
			onclick={(event) => {
				event.stopPropagation()
			}}>{post.data.url}</a
		>
	</div>
{/if}
{#if post.data.selftext_html}
	<div class="selftext" class:truncated={!showingFullSelfText}>
		{@html htmlDecode(post.data.selftext_html)}
	</div>
{/if}
<PostStats showingSubreddit={showingSubredditName} {post} />

<style>
	iframe {
		width: 100%;
	}
	.image {
		width: 100%;
	}
	.flair {
		display: inline-flex;
		padding: 0 4px;
		border-radius: 4px;
		background-color: #444;
		font-weight: bold;
		font-size: 14px;
	}
	.flair.light {
		color: #222;
	}
	.title {
		font-size: 18px;
		margin-bottom: 4px;
	}
	.youtube-iframe-container :global(iframe) {
		width: 100%;
		height: unset;
		aspect-ratio: 16/9;
	}
	video {
		width: 100%;
	}
	.other-embed :global(iframe) {
		width: 100%;
		height: unset;
	}
	.mod {
		color: hsl(116, 80%, 50%);
	}
	.external-link {
		word-break: break-word;
	}
	.selftext.truncated {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
		margin-bottom: 8px;
	}
</style>
