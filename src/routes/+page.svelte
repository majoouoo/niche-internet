<script lang="ts">
	import { onMount } from 'svelte';
	let { data } = $props();

	let theme: string = $state('menu');

	let windowWidth = $state(0);
	let windowHeight = $state(0);

	let cursorX = $state(0);
	let cursorY = $state(0);

	const fullTitle = 'NICHE INTERNET';
	let title = $state(fullTitle[0]);
	let blinkingCursor = $state('_');

	let frame = $state(0);
	let frameOffsets: number[] = $state([]);
	let animationX = $state(0);

	onMount(() => {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;

		cursorX = windowWidth / 2;
		cursorY = windowHeight / 2;

		window.addEventListener('resize', () => {
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;

			frameOffsets = Array.from(
				{ length: Math.floor(windowWidth / 259.2) },
				() => Math.floor(Math.random() * 5) + 1
			);
			frameOffsets.push(frameOffsets[0]);
		});

		const titleInterval = setInterval(() => {
			title += fullTitle[title.length];
			if (title.length === fullTitle.length) {
				clearInterval(titleInterval);
			}
		}, 100);

		setInterval(() => {
			blinkingCursor = blinkingCursor === '_' ? ' ' : '_';
		}, 1000);

		setInterval(() => {
			if (frame === data.frames.length - 1) {
				frame = 0;
			} else frame++;

			if (animationX >= (frameOffsets.length - 1) * 18) {
				animationX = 0;
			} else animationX++;
		}, 80);

		frameOffsets = Array.from({ length: Math.floor(windowWidth / 259.2) }, () =>
			Math.floor(Math.random() * 8)
		);
		frameOffsets.push(frameOffsets[0]);
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
	onmousemove={(e) => updateCursorPosition(e)}
>
	<header class="p-3 flex justify-between z-30">
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
		<div class="framing absolute z-20"></div>

		<h2 style="color: var(--border-color);">discover unknown websites and creators</h2>
		<h1 class="title mb-4 whitespace-pre">{title}{blinkingCursor}</h1>
		<div class="grid grid-cols-2 grid-rows-2 gap-2">
			<a
				class="card flex items-center justify-center px-8 py-3 rounded-lg"
				onmouseenter={() => (theme = 'web')}
				onmouseleave={() => (theme = 'menu')}
				style={theme === 'web' || theme === 'menu' ? 'color: var(--text-color);' : ''}
				href="/"
			>
				<h2>NICHE WEB</h2>
			</a>

			<a
				class="card flex items-center justify-center px-8 py-3 rounded-lg"
				onmouseenter={() => (theme = 'youtube')}
				onmouseleave={() => (theme = 'menu')}
				style={theme === 'youtube' || theme === 'menu' ? 'color: var(--text-color);' : ''}
				href="/youtube"
			>
				<h2>NICHE YOUTUBE</h2>
			</a>

			<a
				class="card flex items-center justify-center px-8 py-3 rounded-lg"
				onmouseenter={() => (theme = 'tiktok')}
				onmouseleave={() => (theme = 'menu')}
				style={theme === 'tiktok' || theme === 'menu' ? 'color: var(--text-color);' : ''}
				href="/"
			>
				<h2>NICHE TIKTOK</h2>
			</a>

			<a
				class="card flex items-center justify-center px-8 py-3 rounded-lg"
				onmouseenter={() => (theme = 'instagram')}
				onmouseleave={() => (theme = 'menu')}
				style={theme === 'instagram' || theme === 'menu' ? 'color: var(--text-color);' : ''}
				href="/"
			>
				<h2>NICHE INSTAGRAM</h2>
			</a>
		</div>

		<div class="flex absolute w-screen bottom-3 left-0 z-10 text-2xl overflow-hidden">
			{#each frameOffsets as offset}
				<div
					class="transform-wrapper"
					style="transform: translateX({-259.2 * (frameOffsets.length - 1) + animationX * 14.4}px);"
				>
					<p class="sea-animation">{data.frames[(frame + offset) % data.frames.length]}</p>
				</div>
			{/each}
			{#each frameOffsets as offset}
				<div
					class="transform-wrapper"
					style="transform: translateX({-259.2 * (frameOffsets.length - 1) + animationX * 14.4}px);"
				>
					<p class="sea-animation">{data.frames[(frame + offset) % data.frames.length]}</p>
				</div>
			{/each}
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

	.sea-animation {
		white-space: pre;
		color: transparent;
		line-height: 1;
		background: linear-gradient(to bottom, var(--border-color) 30%, rgba(255, 255, 255, 0));
		-webkit-background-clip: text;
		background-clip: text;
		user-select: none;
	}

	header {
		background-color: var(--menu-bg);
	}

	.framing {
		height: calc(100% - 1rem);
		width: calc(100% - 2rem);
		top: 0;
		margin: auto;
		border-radius: 2rem;
		box-shadow: 0 0 0 10rem vaR(--menu-bg);
		pointer-events: none;
	}
</style>
