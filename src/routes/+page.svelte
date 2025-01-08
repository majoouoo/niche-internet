<script lang="ts">
	import { onMount } from 'svelte';

	let theme: string = 'menu';

	let windowWidth = 0;
	let windowHeight = 0;

	let cursorX = 0;
	let cursorY = 0;

	const fullTitle = 'NICHE INTERNET';
	let title = fullTitle[0];

	onMount(() => {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;

		cursorX = windowWidth / 2;
		cursorY = windowHeight / 2;

		window.addEventListener('resize', () => {
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
		});

		const titleInterval = setInterval(() => {
			title += fullTitle[title.length];
			if (title.length === fullTitle.length) {
				clearInterval(titleInterval);
			}
		}, 80);
	});

	function updateCursorPosition(e: MouseEvent) {
		cursorX = e.clientX;
		cursorY = e.clientY;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="" />
</svelte:head>

<div
	class="bg-theme h-screen w-screen -z-20 absolute top-0 left-0"
	style="background-color: var(--menu-bg);"
></div>

<div
	class="bg-theme h-screen w-screen -z-10 absolute top-0 left-0"
	style="background: var(--web-gradient); {theme === 'web' ? 'opacity: 1;' : 'opacity: 0;'}"
></div>
<div
	class="bg-theme h-screen w-screen -z-10 absolute top-0 left-0"
	style="background: var(--youtube-gradient); {theme === 'youtube' ? 'opacity: 1;' : 'opacity: 0;'}"
></div>
<div
	class="bg-theme h-screen w-screen -z-10 absolute top-0 left-0"
	style="background: var(--tiktok-gradient); {theme === 'tiktok' ? 'opacity: 1;' : 'opacity: 0;'}"
></div>
<div
	class="bg-theme h-screen w-screen -z-10 absolute top-0 left-0"
	style="background: var(--instagram-gradient); {theme === 'instagram'
		? 'opacity: 1;'
		: 'opacity: 0;'}"
></div>

<div
	class="bg min-h-screen overflow-hidden"
	role="presentation"
	style={theme === 'menu' ? 'color: var(--text-color);' : 'color: var(--border-color);'}
	on:mousemove={(e) => updateCursorPosition(e)}
>
	<header class="p-3 flex justify-between">
		<div>
			<a href="/">faq</a>
			<a href="/">about</a>
		</div>
		<a href="/">github</a>
	</header>

	<section
		class="flex flex-col items-center justify-center"
		style="transform: translate({(cursorX - windowWidth / 2) * 0.01}px, {(cursorY -
			windowHeight / 2) *
			0.01}px);"
	>
		<h2 style="color: var(--border-color);">discover unknown websites and creators</h2>
		<h1 class="title mb-4">{title}</h1>
		<div class="grid grid-cols-2 grid-rows-2 gap-2">
			<a
				class="card flex items-center justify-center px-8 py-3 rounded-lg"
				on:mouseenter={() => (theme = 'web')}
				on:mouseleave={() => (theme = 'menu')}
				style={theme === 'web' || theme === 'menu' ? 'color: var(--text-color);' : ''}
				href="/"
			>
				<h2>NICHE WEB</h2>
			</a>

			<a
				class="card flex items-center justify-center px-8 py-3 rounded-lg"
				on:mouseenter={() => (theme = 'youtube')}
				on:mouseleave={() => (theme = 'menu')}
				style={theme === 'youtube' || theme === 'menu' ? 'color: var(--text-color);' : ''}
				href="/youtube"
			>
				<h2>NICHE YOUTUBE</h2>
			</a>

			<a
				class="card flex items-center justify-center px-8 py-3 rounded-lg"
				on:mouseenter={() => (theme = 'tiktok')}
				on:mouseleave={() => (theme = 'menu')}
				style={theme === 'tiktok' || theme === 'menu' ? 'color: var(--text-color);' : ''}
				href="/"
			>
				<h2>NICHE TIKTOK</h2>
			</a>

			<a
				class="card flex items-center justify-center px-8 py-3 rounded-lg"
				on:mouseenter={() => (theme = 'instagram')}
				on:mouseleave={() => (theme = 'menu')}
				style={theme === 'instagram' || theme === 'menu' ? 'color: var(--text-color);' : ''}
				href="/"
			>
				<h2>NICHE INSTAGRAM</h2>
			</a>
		</div>
	</section>
</div>

<style lang="postcss">
	.bg-theme {
		transition: opacity 0.5s;
	}

	.bg {
		transition:
			background-color 0.5s,
			color 0.5s;
		display: grid;
		grid-template-rows: auto 1fr;
	}

	.card {
		transition:
			color 0.5s,
			border-color 0.5s;
		text-decoration: none;
		border: 1px solid var(--border-color);
	}

	.card:hover {
		border-color: var(--text-color);
	}

	a.card:hover {
		color: inherit;
	}
</style>
