<script lang="ts">
	let theme: string = "menu";
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="" />
</svelte:head>

<div class="bg min-h-screen" style="background-color: var(--{theme}-bg); {theme === 'menu' ? 'color: var(--text-color);' : 'color: var(--border-color);'}">
	<header class="p-2">
		<a href="/faq">faq</a>
		<a href="/">github</a>
	</header>

	<section class="flex flex-col items-center justify-center">
		<h2 style="color: var(--border-color);">discover unknown websites and creators</h2>
		<h1 class="mb-4">NICHE INTERNET</h1>
		<div class="grid grid-cols-2 grid-rows-2 gap-2">

			<a class="card flex items-center justify-center px-8 py-3 rounded-lg" on:mouseenter={() => theme = "web"} on:mouseleave={() => theme = "menu"} style="{theme === 'web' || theme === 'menu' ? 'color: var(--text-color);' : ''}" href="/web">
				<h2>NICHE WEB</h2>
			</a>

			<a class="card flex items-center justify-center px-8 py-3 rounded-lg" on:mouseenter={() => theme = "youtube"} on:mouseleave={() => theme = "menu"} style="{theme === 'youtube' || theme === 'menu' ? 'color: var(--text-color);' : ''}" href="/youtube">
				<h2>NICHE YOUTUBE</h2>
			</a>

			<a class="card flex items-center justify-center px-8 py-3 rounded-lg" on:mouseenter={() => theme = "tiktok"} on:mouseleave={() => theme = "menu"} style="{theme === 'tiktok' || theme === 'menu' ? 'color: var(--text-color);' : ''}" href="/tiktok">
				<h2>NICHE TIKTOK</h2>
			</a>

			<a class="card flex items-center justify-center px-8 py-3 rounded-lg" on:mouseenter={() => theme = "instagram"} on:mouseleave={() => theme = "menu"} style="{theme === 'instagram' || theme === 'menu' ? 'color: var(--text-color);' : ''}" href="/instagram">
				<h2>NICHE INSTAGRAM</h2>
			</a>

		</div>
	</section>
</div>


<style lang="postcss">
	.bg {
		transition: background-color 0.5s, color 0.5s;
		display: grid;
		grid-template-rows: auto 1fr;
	}
	
	.card {
		transition: color 0.5s;
		text-decoration: none;
		border: 1px solid var(--border-color);
	}

	a.card:hover {
		color: inherit;
	}
</style>
