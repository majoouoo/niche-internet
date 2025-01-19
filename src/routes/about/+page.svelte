<script lang="ts">
</script>

<svelte:head>
	<title>about | niche internet</title>
	<meta name="description" content="" />
</svelte:head>

<div class="bg min-h-screen">
	<header class="px-4 py-2 grid grid-cols-3 z-30 items-center">
		<a class="jusitfy-self-start" href="/">back</a>
		<img src="/icon.png" alt="" class="h-8 justify-self-center" />
		<a class="justify-self-end" href="https://github.com/majoouoo/niche-internet" target="_blank"
			>github</a
		>
	</header>

	<div class="flex justify-center items-center flex-col gap-8 px-2 pt-32 pb-24">
		<p class="about-text">
			<strong>niche internet</strong> is a place to discover unknown creators who deserve more
			attention.<br /><br />

			You can submit channels you’ve found, add a short description, and vote for your favorites.
			Our <strong>algorithm</strong> then highlights channels with the most votes but the fewest
			subscribers, so even the smallest creators with great content can be seen.<br /><br />

			With the <strong>search</strong> feature, you can find creators by keywords and topics. It
			looks through YouTube tags, channel descriptions, and user-submitted descriptions, making it
			easy to find content that matches your interests.<br /><br />

			Explore the internet’s hidden gems.
		</p>
		<div class="divider"></div>
		<p class="about-text">
			NSFW or malicious content is not allowed on this site.<br /><br />
			This website is moderated, however the owner does not take responsibility for the content shared
			by the creators featured here.<br /><br />
			If you find any content that violates the rules, please report it, it will be taken down.
		</p>
		<div class="divider"></div>
		<p class="about-text">
			This website uses the following open-source projects:<br /><br />
			<a href="https://svelte.dev/" target="_blank">Svelte</a> &copy; 2016-2025 Svelte contributors
			licensed under the
			<a href="https://github.com/sveltejs/svelte/blob/main/LICENSE.md" target="_blank"
				>MIT License</a
			><br />
			<a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a> &copy; Tailwind Labs, Inc.
			licensed under the
			<a href="https://github.com/tailwindlabs/tailwindcss/blob/next/LICENSE" target="_blank"
				>MIT License</a
			><br />
			<a href="https://github.com/evilmartians/mono" target="_blank">Martian Mono</a> &copy; 2021
			The Martian Mono Project Authors licensed under the
			<a href="https://openfontlicense.org/open-font-license-official-text/" target="_blank"
				>SIL Open Font License, Version 1.1</a
			><br />
			<a href="https://github.com/motdotla/dotenv" target="_blank">dotenv</a> &copy; 2015 Scott
			Motte licensed under the
			<a href="https://github.com/motdotla/dotenv/blob/master/LICENSE" target="_blank"
				>BSD 2-Clause "Simplified" License</a
			><br />
			<a href="https://github.com/microsoft/TypeScript" target="_blank">TypeScript</a> &copy;
			Microsoft licensed under the
			<a href="https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt" target="_blank"
				>Apache License 2.0</a
			>
		</p>
	</div>
</div>

<style>
	.bg {
		background: var(--menu-bg);
		color: var(--text-color);
		display: grid;
		grid-template-rows: auto 1fr;
	}

	.about-text {
		max-width: 600px;
		text-align: center;
	}

	.about-text strong {
		text-decoration: underline;
	}

	.divider {
		height: 1px;
		width: 100%;
		max-width: 600px;
		background-color: var(--border-color);
	}
</style>
