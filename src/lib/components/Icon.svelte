<script lang="ts">
	type Props = {
		data: {
			icon: [
				number, // width
				number, // height
				string[], // ligatures
				string, // unicode
				any, // svgPathData
			]
		}
	}

	let { data }: Props = $props()
</script>

<svg viewBox={`0 0 ${data.icon[0]} ${data.icon[1]}`}>
	<path d={data.icon[4]} fill="currentColor" />
</svg>

<style>
	svg {
		display: block;
		width: 1em;
		height: 1em;
	}
</style>
