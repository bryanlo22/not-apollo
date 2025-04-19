<script lang="ts">
	import { onMount } from 'svelte'

	import { faClose } from '@fortawesome/free-solid-svg-icons'

	import PostDetails from '$lib/components/PostDetails.svelte'
	import Icon from '$lib/components/Icon.svelte'
	import PostInfo from '$lib/components/PostInfo.svelte'

	import type { PostType } from '$lib/types/PostType'
	import type { CommentType } from '$lib/types/CommentType'

	import 'modern-normalize'

	let subreddit: string = $state('')
	let posts: PostType[] = $state([])
	let selectedPost: PostType | null = $state(null)
	let modal: HTMLDialogElement | null = $state(null)
	let showingSubredditName = $state(false)
	let comments: {
		data: {
			children: CommentType[]
		}
	}[] = $state([])

	onMount(async () => {
		let urlParams = new URLSearchParams(location.search)
		let subredditParam = urlParams.get('r') || ''
		if (subredditParam != '') {
			subreddit = subredditParam.replaceAll(' ', '+')
		} else {
			subreddit = 'all'
		}

		await getList()

		const intersectionObserver = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				getList(true)
			}
		})
		let loadMoreElement = document.querySelector('.load-more') as HTMLDivElement
		intersectionObserver.observe(loadMoreElement)
	})

	async function getList(nextPage = false) {
		let after = ''
		if (nextPage) {
			after = `${posts.at(-1)?.kind}_${posts.at(-1)?.data.id}`
		}
		let response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?after=${after}`)
		let json = await response.json()
		if (nextPage) {
			posts = [...posts, ...json.data.children]
		} else {
			posts = json.data.children
		}
		;(window as any).twttr.widgets.load()
		if (subreddit == 'all' || subreddit.includes('+')) {
			showingSubredditName = true
		}
	}

	let debouncedGetList = debounce(function () {
		getList()
	}, 300)

	function getRedditUrl(permalink: string) {
		return 'https://old.reddit.com' + permalink
	}

	async function selectPost(post: PostType) {
		selectedPost = post
		if (modal && window.innerWidth < 768) {
			modal.showModal()
		}
		comments = []
		let response = await fetch(`https://www.reddit.com${post.data.permalink}.json`)
		let json = await response.json()
		comments = json
	}

	function debounce(callback: { (): void }, delayMs: number) {
		let timeoutId: number
		return () => {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				callback()
			}, delayMs)
		}
	}
</script>

<div class="subreddit-container">
	<input
		class="subreddit-input"
		type="text"
		bind:value={subreddit}
		oninput={() => {
			posts = []
			debouncedGetList()
		}}
	/>
</div>

<div class="grid-container">
	<main>
		{#each posts as post}
			<a
				class="link-panel"
				class:selected={selectedPost?.data.id == post.data.id}
				href={getRedditUrl(post.data.permalink)}
				target="_blank"
				rel="noopener noreferrer"
				onclick={(event) => {
					event.preventDefault()
					selectPost(post)
				}}
			>
				<PostInfo {showingSubredditName} {post} />
			</a>
		{/each}
		<div class="load-more"></div>
	</main>
	<aside>
		{#if selectedPost}
			<PostDetails post={selectedPost} {comments} />
		{/if}
	</aside>
	<dialog bind:this={modal}>
		<button
			class="close-btn"
			onclick={() => {
				modal?.close()
			}}
		>
			<Icon data={faClose} />
		</button>
		{#if selectedPost}
			<PostDetails post={selectedPost} {comments} />
		{/if}
	</dialog>
</div>

<style>
	:global(html) {
		box-sizing: border-box;
	}
	:global(body) {
		max-width: 1440px;
		margin: 0 auto;
		background-color: #111;
		color: white;
		line-height: 1.4;
		font-family: sans-serif;
	}
	:global(a) {
		color: rgb(161, 252, 255);
		text-decoration: none;
	}
	:global(a):hover {
		text-decoration: underline;
	}

	.subreddit-container {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		padding: 12px;
		background-color: #222;
		z-index: 1;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
	}
	.subreddit-input {
		padding: 4px;
		font-size: 16px;
	}

	.grid-container {
		margin-top: 62px;
		padding: 0 8px;
	}
	@media (min-width: 768px) {
		.grid-container {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 8px;
		}
	}
	a {
		color: unset;
		text-decoration: none;
	}
	.link-panel {
		display: block;
		padding: 8px;
		background-color: #222;
		border-radius: 4px;
	}
	.link-panel:hover {
		cursor: pointer;
		background-color: #333;
		text-decoration: none;
	}
	.link-panel.selected {
		background-color: #333;
	}
	.link-panel.selected:hover {
		background-color: #444;
	}
	main {
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	aside {
		display: none;
	}
	@media (min-width: 768px) {
		aside {
			display: flex;
			flex-direction: column;
			gap: 8px;
			position: sticky;
			top: 64px;
			height: calc(100vh - 64px);
			overflow-y: scroll;
		}
	}
	dialog {
		min-width: 100%;
		min-height: 100%;
		width: 100%;
		height: 100%;
		background-color: #111;
		color: white;
		border: none;
		margin: 0;
		padding: 0;
	}
	.close-btn {
		position: fixed;
		top: 16px;
		right: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		padding: 0;
		background-color: rgba(0, 0, 0, 0.5);
		border: none;
		border-radius: 100%;
		color: white;
		font-size: 32px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
	}
	.close-btn:hover {
		cursor: pointer;
		background-color: rgba(96, 96, 96, 0.5);
	}
	.load-more {
		height: 1500px;
		margin-top: -1500px;
		z-index: -1;
		position: relative;
	}
</style>
