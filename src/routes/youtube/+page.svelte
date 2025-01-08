<script lang="ts">
	let isSubmitHover: boolean = false;
</script>

<svelte:head>
	<title>YouTube</title>
	<meta name="description" content="" />
</svelte:head>

<div
	class="bg min-h-screen"
	style={isSubmitHover ? 'color: var(--border-color);' : 'color: var(--text-color);'}
>
	<header class="p-3">
		<a href="/">back to menu</a>
	</header>

	<section class="flex flex-col items-center justify-center">
		<h1 class="mb-4">NICHE YOUTUBE</h1>
		<button
			class="submit-btn flex items-center justify-center px-8 py-3 rounded-lg"
			on:mouseenter={() => (isSubmitHover = true)}
			on:mouseleave={() => (isSubmitHover = false)}
			style="color: var(--text-color);">submit a channel</button
		>
	</section>
</div>

<style lang="postcss">
	.bg {
		transition: color 0.5s;
		background-color: var(--youtube-bg);
		color: var(--text-color);
		grid-template-rows: auto 1fr;
	}

	.submit-btn {
		border: 1px solid var(--border-color);
		transition: border-color 0.5s;
	}

	.submit-btn:hover {
		border-color: var(--text-color);
	}
</style>
