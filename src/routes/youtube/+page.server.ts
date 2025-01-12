import { sql } from '$lib/db.server';
import { fail } from '@sveltejs/kit';
import 'dotenv/config';

export async function load() {
	const channels = await sql`SELECT * FROM youtube ORDER BY score DESC LIMIT 24`;

	return {
		channels: channels
	};
}

export const actions = {
	submit: async ({ request }) => {
		const formData = await request.formData();

		if (!formData.has('channel'))
			return fail(400, {
				error: 'channel is required'
			});

		if (!formData.has('description'))
			return fail(400, {
				error: 'description is required'
			});

		const description = formData.get('description') as string;
		if (!description || description.length < 10 || description.length > 150)
			return fail(400, {
				error: 'description must be between 10 and 150 characters'
			});

		let channel = formData.get('channel') as string;
		let handle = null;
		let id = null;

		if (channel[channel.length - 1] === '/') {
			channel = channel.substring(0, channel.length - 1);
		}

		if (channel.includes('youtube.com/channel/')) {
			id = channel.substring(channel.lastIndexOf('/') + 1);
		} else if (channel.includes('youtube.com/user/')) {
			handle = channel.substring(channel.lastIndexOf('/') + 1);
		} else if (channel.includes('youtube.com/c/')) {
			handle = channel.substring(channel.lastIndexOf('/') + 1);
		} else if (channel.includes('youtube.com/')) {
			handle = channel.substring(channel.lastIndexOf('/') + 1);
		} else {
			handle = channel;
		}

		if (handle && handle[0] === '@') {
			handle = handle.substring(1);
		}

		let sqlExistsCheck = null;
		if (handle) {
			sqlExistsCheck = await sql`SELECT * FROM youtube WHERE handle ILIKE ${handle}`;
		} else if (id) {
			sqlExistsCheck = await sql`SELECT * FROM youtube WHERE id ILIKE ${id}`;
		}

		if (sqlExistsCheck?.length !== 0) {
			return fail(409, {
				error: 'channel is already submitted, vote for it instead'
			});
		}

		const fetchUrl =
			`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings,snippet,statistics,topicDetails&key=${process.env.YOUTUBE_API_KEY as string}` +
			(id ? `&id=${id}` : `&forHandle=${handle}`);

		try {
			const response = await fetch(fetchUrl);
			const ytData = await response.json();

			if (!ytData.items || ytData.items.length === 0) {
				return fail(404, {
					error: 'channel not found'
				});
			}

			const ytItem = ytData.items[0];

			const topicCategories: string[] = [];
			ytItem.topicDetails.topicCategories.forEach((link: string) => {
				topicCategories.push(link.substring(link.lastIndexOf('/') + 1));
			});
			topicCategories.join(' ');

			// score calculation
			const score = 1 / Math.log(ytItem.statistics.subscriberCount + 2);

			await sql`
        INSERT INTO youtube (id, handle, title, channel_description, subscribers, initial_subscribers, profile_picture_url, topic_categories, keywords, user_description, score) 
        VALUES (
          ${ytItem.id}, 
          ${ytItem.snippet.customUrl.substring(1)}, 
          ${ytItem.snippet.title}, 
          ${ytItem.snippet.description}, 
          ${ytItem.statistics.subscriberCount}, 
          ${ytItem.statistics.subscriberCount}, 
          ${ytItem.snippet.thumbnails.default.url}, 
          ${topicCategories}, 
          ${ytItem.brandingSettings.channel.keywords ?? null}, 
          ${formData.get('description') as string},
          ${score}
        ) 
        ON CONFLICT (id) DO NOTHING`;

			return {
				status: 201,
				message: 'channel submitted successfully'
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				error: 'error submitting channel'
			});
		}
	}
};
