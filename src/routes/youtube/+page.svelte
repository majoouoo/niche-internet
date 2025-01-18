<script lang="ts">
	import { page } from '$app/state';
	import { enhance, applyAction } from '$app/forms';
	let { data, form } = $props();

	let channels: any[] = $state(data.channels ?? []);

	let searchQuery = $state('');

	let isBtnHover: boolean = $state(false);
</script>

<svelte:head>
	<title>youtube | niche internet</title>
	<meta name="description" content="" />
</svelte:head>

<div
	class="bg min-h-screen"
	style={isBtnHover ? 'color: var(--border-color);' : 'color: var(--text-color);'}
>
	<header
		class="p-3 z-30 flex flex-col justify-between items-center gap-4 md:flex-row md:items-start"
	>
		<a href="/">back to menu</a>
		<form
			class="search-form"
			method="POST"
			action="?/search"
			use:enhance={({ formElement, formData }) => {
				return async ({ result }) => {
					await applyAction(result);
					if (result?.type === 'success') {
						searchQuery = formData.get('query') as string;
					}
					formElement.reset();
					channels = form?.searchResults ?? [];
				};
			}}
		>
			<input
				type="search"
				name="query"
				placeholder={searchQuery ? searchQuery : 'search for channels...'}
			/>
			<button
				class="submit-btn px-2 py-1 rounded-md"
				onmouseenter={() => (isBtnHover = true)}
				onmouseleave={() => (isBtnHover = false)}>{searchQuery ? 'show all' : 'search'}</button
			>
		</form>
	</header>

	<section class="flex flex-col items-center justify-center relative">
		<!-- <div class="framing absolute z-20"></div> -->

		<div class="px-4 pb-4 flex flex-col items-center justify-center">
			<h1 class="my-4">NICHE YOUTUBE</h1>
			<form
				class="submit-form flex flex-col items-center gap-4"
				method="POST"
				action="?/submit"
				use:enhance
			>
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
					onmouseenter={() => (isBtnHover = true)}
					onmouseleave={() => (isBtnHover = false)}>submit a channel</button
				>
			</form>

			{#if form?.error}
				<div class="flex gap-2 mt-4 text-red-300">
					<span class="material-symbols-outlined">error</span>
					<p>{form.error}</p>
				</div>
			{/if}
			{#if form?.message}
				<div class="flex gap-2 mt-4 text-green-300">
					<span class="material-symbols-outlined">check_circle</span>
					<p>{form.message}</p>
				</div>
			{/if}
			{#if channels.length === 0}
				<p class="text-center mt-4">no channels found</p>
			{/if}

			<section class="grid grid-cols-1 w-full gap-4 mt-24 lg:grid-cols-3">
				{#each channels as channel, i}
					<div class="channel rounded-lg p-2 grid gap-3">
						<a
							href={'https://youtube.com/@' + channel.handle}
							target="_blank"
							class="row-span-full"
						>
							<img
								src={channel.profile_picture_url}
								alt={channel.title}
								class="rounded-sm w-24 aspect-square"
							/>
						</a>

						<div class="channel-info grid gap-3">
							<div>
								<h2
									class="font-bold"
									class:text-red-300={channel.reports >= 4 && !isBtnHover}
									style="transition: color 0.5s;"
								>
									<a href={'https://youtube.com/@' + channel.handle} target="_blank"
										>{channel.title}</a
									>
								</h2>
								<p class="font-light">
									{channel.subscribers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} subs
								</p>
								{#if channel.reports >= 4}
									<p
										class="font-light"
										class:text-red-300={!isBtnHover}
										style="transition: color 0.5s;"
									>
										{channel.reports} reports
									</p>
								{/if}
							</div>
							<form class="flex flex-col gap-0.5" method="POST" use:enhance>
								<input type="hidden" name="id" value={channel.id} />
								<button
									class="vote-btn px-4 py-1 rounded-md"
									onmouseenter={() => (isBtnHover = true)}
									onmouseleave={() => (isBtnHover = false)}
									formaction="?/vote">vote</button
								>
								<button
									class="underline"
									onmouseenter={() => (isBtnHover = true)}
									onmouseleave={() => (isBtnHover = false)}
									formaction="?/report">report</button
								>
							</form>
							<p class="text-5xl">{channel.votes}</p>
						</div>

						<p class="font-light">{channel.user_description}</p>
					</div>
				{/each}
			</section>

			{#if channels.length % 30 === 0 && channels.length > 0 && form?.moreChannels?.length !== 0}
				<form
					class="flex justify-center mt-4"
					method="POST"
					action="?/load"
					use:enhance={() => {
						return async ({ result }) => {
							await applyAction(result);
							if (result?.type === 'success') {
								channels = [...channels, ...(form?.moreChannels ?? [])];
							}
						};
					}}
				>
					<input type="hidden" name="offset" value={channels.length} />
					<input type="hidden" name="query" value={searchQuery} />
					<button class="underline">load more</button>
				</form>
			{/if}
		</div>
	</section>
</div>

<style lang="postcss">
	/* .w-full {
		width: calc(100% - 2rem);
	} */

	.bg {
		transition: color 0.5s;
		background: var(--menu-bg);
		color: var(--text-color);
		display: grid;
		grid-template-rows: auto 1fr;
	}

	.submit-btn,
	.vote-btn {
		border: 1px solid var(--border-color);
		transition: border-color 0.5s;
	}

	.submit-btn:hover,
	.vote-btn:hover {
		border-color: var(--text-color);
	}

	button:hover {
		color: var(--text-color);
	}

	header {
		background-color: var(--menu-bg);
	}

	/* .framing {
		height: calc(100% - 1rem);
		width: calc(100% - 2rem);
		top: 0;
		margin: auto;
		border-radius: 2rem;
		box-shadow: 0 0 0 10rem var(--menu-bg);
		pointer-events: none;
	} */

	.submit-form {
		min-width: 30vw;
	}

	.submit-form textarea,
	.submit-form input {
		background-color: transparent;
		border-bottom: 1px solid var(--border-color);
		width: 100%;
		transition:
			width 0.5s,
			border-color 0.5s;
	}

	.submit-form textarea:focus,
	.submit-form input:focus {
		border-bottom: 1px solid var(--text-color);
		outline: none;
		width: min(calc(100vw - 4rem), 120%);
	}

	.submit-form textarea::placeholder,
	.submit-form input::placeholder,
	.search-form input::placeholder {
		color: #ffffff90;
	}

	.channel {
		border: 1px solid var(--border-color);
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr;
	}

	.channel-info {
		grid-template-columns: 1fr auto auto;
	}

	.search-form input {
		background-color: transparent;
		border-bottom: 1px solid var(--border-color);
		transition: border-color 0.5s;
	}

	.search-form input:focus {
		border-bottom: 1px solid var(--text-color);
		outline: none;
	}
</style>
