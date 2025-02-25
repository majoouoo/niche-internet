<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { fly } from 'svelte/transition';
	let { data, form } = $props();

	let channels: any[] = $state(data.channels ?? []);

	let searchQuery = $state('');

	let isBtnHover: boolean = $state(false);
	let isSubmitLoading: boolean = $state(false);
	let isSearchLoading: boolean = $state(false);

	const placeholderImage = '/placeholder.png';
</script>

<svelte:head>
	<title>youtube | niche internet</title>
	<meta name="description" content="" />
</svelte:head>

<div
	class="bg min-h-screen pb-16"
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
				isSearchLoading = true;
				return async ({ result }) => {
					isSearchLoading = false;
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
				class="submit-btn px-2 py-1 rounded-md relative"
				onmouseenter={() => (isBtnHover = true)}
				onmouseleave={() => (isBtnHover = false)}
				disabled={isSearchLoading}
			>
				<span style={isSearchLoading ? 'opacity: 0;' : 'opacity: 1;'}
					>{searchQuery ? 'show all' : 'search'}</span
				>
				{#if isSearchLoading}
					<div class="spinner"></div>
				{/if}
			</button>
		</form>
	</header>

	<section class="flex flex-col items-center justify-center relative">
		<div class="px-2 md:px-4 pb-4 flex flex-col w-full items-center justify-center">
			<h1 class="my-4 text-center">
				NICHE
				<span class="gradient-heading">YOUTUBE</span>
			</h1>
			<form
				class="submit-form flex flex-col items-center gap-4"
				method="POST"
				action="?/submit"
				use:enhance={({ formElement }) => {
					isSubmitLoading = true;
					return async ({ result }) => {
						isSubmitLoading = false;
						applyAction(result);
						formElement.reset();
					};
				}}
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
					class="submit-btn flex items-center justify-center px-8 py-3 rounded-lg relative"
					onmouseenter={() => (isBtnHover = true)}
					onmouseleave={() => (isBtnHover = false)}
					disabled={isSubmitLoading}
				>
					<span style={isSubmitLoading ? 'opacity: 0;' : 'opacity: 1;'}>submit a channel</span>
					{#if isSubmitLoading}
						<div class="spinner"></div>
					{/if}
				</button>
			</form>

			{#if form?.error}
				<div
					class="message flex gap-2 mt-4 text-red-300 sticky top-2 p-2 rounded-full z-50"
					in:fly={{ y: -20, duration: 1000 }}
				>
					<span class="material-symbols-rounded">error</span>
					<p>{form.error}</p>
				</div>
			{:else if form?.message}
				<div
					class="message flex gap-2 mt-4 text-green-300 sticky top-2 p-2 rounded-full z-50"
					in:fly={{ y: -20, duration: 1000 }}
				>
					<span class="material-symbols-rounded">check_circle</span>
					<p>{form.message}</p>
				</div>
			{:else}
				<div class="flex gap-2 mt-4 p-2 opacity-0">
					<span class="material-symbols-rounded">check_circle</span>
					<p>placeholder</p>
				</div>
			{/if}

			{#if channels.length === 0}
				<p class="text-center mt-4">no channels found</p>
			{/if}

			<section class="grid grid-cols-1 w-full gap-2 md:gap-4 mt-24 lg:grid-cols-3">
				{#each channels as channel, i}
					<div class="channel rounded-xl p-2 grid gap-3 overflow-x-hidden">
						<a
							href={'https://youtube.com/@' + channel.handle}
							target="_blank"
							class="row-span-full"
						>
							<img
								src={channel.profile_picture_url}
								alt={channel.title}
								class="rounded-md w-16 aspect-square md:w-24"
								onerror={(e) => {
									const target = e.target as HTMLImageElement;
									if (target) target.src = placeholderImage;
								}}
							/>
						</a>

						<div class="channel-info grid gap-1 md:gap-3">
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
							<form
								class="flex flex-col gap-0.5 relative"
								method="POST"
								use:enhance={({ action }) => {
									channel.isLoading = true;
									return async ({ result }) => {
										channel.isLoading = false;
										await applyAction(result);
										if (result.type === 'success') {
											// increment votes or reports by 1
											channel[action.search.substring(2) + 's'] += 1;
										}
									};
								}}
							>
								<input type="hidden" name="id" value={channel.id} />
								<div
									class="relative flex flex-col gap-0.5"
									style={channel.isLoading ? 'opacity: 0;' : 'opacity: 1;'}
								>
									<button
										class="vote-btn px-4 py-1 rounded-md"
										onmouseenter={() => (isBtnHover = true)}
										onmouseleave={() => (isBtnHover = false)}
										formaction="?/vote"
										>vote
									</button>
									<button
										class="underline"
										onmouseenter={() => (isBtnHover = true)}
										onmouseleave={() => (isBtnHover = false)}
										formaction="?/report"
										>report
									</button>
								</div>
								{#if channel.isLoading}
									<div class="spinner"></div>
								{/if}
							</form>
							<p class="text-5xl">{channel.votes}</p>
						</div>

						<p class="font-light" style="overflow-wrap: anywhere;">{channel.user_description}</p>
					</div>
				{/each}
			</section>

			{#if channels.length % 30 === 0 && channels.length > 0 && form?.moreChannels?.length !== 0}
				<form
					class="flex justify-center mt-4"
					method="POST"
					action="?/load"
					use:enhance={() => {
						isSubmitLoading = true;
						return async ({ result }) => {
							isSubmitLoading = false;
							await applyAction(result);
							if (result?.type === 'success') {
								channels = [...channels, ...(form?.moreChannels ?? [])];
							}
						};
					}}
				>
					<input type="hidden" name="offset" value={channels.length} />
					<input type="hidden" name="query" value={searchQuery} />
					<button class="load-btn underline relative" disabled={isSubmitLoading}>
						<span style={isSubmitLoading ? 'opacity: 0;' : 'opacity: 1;'}>load more...</span>
						{#if isSubmitLoading}
							<div class="spinner"></div>
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</section>
</div>

<style lang="postcss">
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

	.gradient-heading {
		background: var(--youtube-gradient);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		filter: brightness(2.5);
		text-shadow: 0 0 16px #d6090990;
	}

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
		color: #ffffff60;
	}

	.message {
		background-color: var(--menu-bg);
	}

	.channel {
		background-color: #1f1f1f;
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

	.load-btn {
		transition: color 0.5s;
	}

	.load-btn:hover {
		color: white;
	}

	/* spinner */

	.spinner {
		height: 20px;
		width: 20px;
		position: absolute;
		top: calc(50% - 10px);
		left: calc(50% - 10px);
		border-radius: 50%;
		background: white;
		mix-blend-mode: difference;
		pointer-events: none;
		z-index: 10;
		animation: spinner 2.5s infinite;
	}

	.spinner::after {
		content: '';
		background: white;
		height: 10px;
		width: 10px;
		position: absolute;
		top: 25%;
		left: 25%;
		animation: spinner-after 2.5s 1s infinite;
	}

	@keyframes spinner {
		0% {
			border-radius: 50%;
			transform: rotate(0deg);
		}
		20% {
			border-radius: 0%;
			transform: rotate(0deg);
		}
		40% {
			border-radius: 0%;
			transform: rotate(45deg);
		}
		60% {
			border-radius: 0%;
			transform: rotate(45deg) scaleY(0.5);
		}
		80% {
			border-radius: 0%;
			transform: rotate(45deg) scaleY(0.5);
		}
		80.0001% {
			border-radius: 0%;
			transform: rotate(45deg);
		}
		100% {
			border-radius: 50%;
			transform: rotate(45deg);
		}
	}

	@keyframes spinner-after {
		0% {
			border-radius: 0%;
			transform: none;
		}
		20% {
			border-radius: 0%;
			transform: scaleY(4);
		}
		40% {
			border-radius: 0%;
			transform: scaleY(4) scaleX(2);
		}
		40.0001% {
			transform: none;
		}
		60% {
			border-radius: 50%;
			transform: none;
		}
	}
</style>
