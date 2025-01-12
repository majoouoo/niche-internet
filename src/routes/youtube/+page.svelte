<script lang="ts">
	let { data, form } = $props();

	let isSubmitHover: boolean = $state(false);
</script>

<svelte:head>
	<title>YouTube</title>
	<meta name="description" content="" />
</svelte:head>

<div
	class="bg min-h-screen"
	style={isSubmitHover ? 'color: var(--border-color);' : 'color: var(--text-color);'}
>
	<header class="p-3 z-30">
		<a href="/">back to menu</a>
	</header>

	<section class="flex flex-col items-center justify-center relative">
		<div class="framing absolute z-20"></div>

		<h1 class="mb-4">NICHE YOUTUBE</h1>
		<form class="flex flex-col items-center gap-4" method="POST" action="?/submit">
			<input
				type="text"
				placeholder="channel link or @handle"
				class="input-field px-4 py-2"
				name="channel"
				required
			/>
			<textarea
				placeholder="short description of channel"
				class="input-field px-4 py-2 resize-none"
				rows="2"
				name="description"
				required
				minlength="10"
				maxlength="150"
			></textarea>
			<button
				class="submit-btn flex items-center justify-center px-8 py-3 rounded-lg"
				onmouseenter={() => (isSubmitHover = true)}
				onmouseleave={() => (isSubmitHover = false)}
				style="color: var(--text-color);">submit a channel</button
			>
		</form>

		{#if form?.error}
			<div class="flex gap-2 mt-4">
				<span class="material-symbols-outlined">error</span>
				<p>{form.error}</p>
			</div>
		{/if}
		{#if form?.message}
			<div class="flex gap-2 mt-4">
				<span class="material-symbols-outlined">check_circle</span>
				<p>{form.message}</p>
			</div>
		{/if}

		<section class="grid grid-cols-3 w-full gap-4 mt-8 p-8">
			{#each data.channels as channel, i}
				<div class="channel rounded-lg p-2 grid gap-3">
					<a href={'https://youtube.com/@' + channel.handle} target="_blank">
						<img src={channel.profile_picture_url} alt={channel.title} class="rounded-sm size-24" />
					</a>
					<div>
						<h2 class="font-bold">
							<a href={'https://youtube.com/@' + channel.handle} target="_blank">{channel.title}</a>
						</h2>
						<p class="font-light">
							{channel.subscribers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} subs
						</p>
						<p class="font-light mt-4">{channel.user_description}</p>
					</div>
					<div class="flex flex-col gap-2">
						<button class="vote-btn px-2 py-1 rounded-md">vote</button>
						<button class="px-2 py-1 rounded-md">report</button>
					</div>
					<p class="text-5xl">{channel.votes}</p>
				</div>
			{/each}
		</section>
	</section>
</div>

<style lang="postcss">
	.w-full {
		width: calc(100% - 2rem);
	}

	.bg {
		transition: color 0.5s;
		background: var(--youtube-gradient);
		color: var(--text-color);
		display: grid;
		grid-template-rows: auto 1fr;
	}

	.submit-btn,
	button {
		border: 1px solid var(--border-color);
		transition: border-color 0.5s;
	}

	.submit-btn:hover,
	button:hover {
		border-color: var(--text-color);
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
		box-shadow: 0 0 0 10rem var(--menu-bg);
		pointer-events: none;
	}

	form textarea,
	form input {
		background-color: transparent;
		border-bottom: 1px solid var(--border-color);
		width: 100%;
		transition:
			width 0.5s,
			border-color 0.5s;
	}

	form textarea:focus,
	form input:focus {
		border-bottom: 1px solid var(--text-color);
		outline: none;
		width: min(100vw, 200%);
	}

	form textarea::placeholder,
	form input::placeholder {
		color: #ffffff90;
	}

	.channel {
		border: 1px solid var(--border-color);
		grid-template-columns: auto 1fr auto auto;
	}

	.vote-btn {
		background-color: white;
		color: var(--youtube-bg-2);
		transition:
			background-color 0.5s,
			color 0.5s;
	}

	.vote-btn:hover {
		background-color: transparent;
		color: white;
	}
</style>
