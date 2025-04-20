<script lang="ts">
	let titleWidth = 50 + Math.random() * 50
	let contentHeight = 64 + Math.random() * 192
	let animationDuration = 0.75 + Math.random() * 0.5
</script>

<div style="min-height: {contentHeight}px;">
	<div class="title" style="width: {titleWidth}%; animation-duration: {animationDuration}s"></div>
</div>

<style>
	@keyframes breathing {
		0% {
			opacity: 0.6;
		}
		100% {
			opacity: 1;
		}
	}

	.title {
		height: 24px;
		margin-bottom: 4px;
		border-radius: 4px;
		background-color: rgba(255, 255, 255, 0.1);
		animation: breathing 1s ease-in-out infinite alternate;
	}
</style>
