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
	submit: async (event) => {
		const request = event.request;
		const formData = await request.formData();
		const clientIpAddress = event.getClientAddress();

		if (!formData.has('channel') || !formData.has('description'))
			return fail(400, {
				error: 'channel and description are required'
			});

		let channel = formData.get('channel') as string;
		let description = formData.get('description') as string;

		if (!description || description.length < 10 || description.length > 150)
			return fail(400, {
				error: 'description must be between 10 and 150 characters'
			});

		// extract handle or id from url
		let handle = null;
		let id = null;

		if (channel[-1] === '/') {
			channel = channel.substring(0, channel.length - 1);
		}

		if (channel.includes('youtube.com/channel/')) {
			id = channel.substring(
				channel.indexOf('youtube.com/channel/') + 'youtube.com/channel/'.length
			);
		} else if (channel.includes('youtube.com/user/')) {
			handle = channel.substring(channel.indexOf('youtube.com/user/') + 'youtube.com/user/'.length);
		} else if (channel.includes('youtube.com/c/')) {
			handle = channel.substring(channel.indexOf('youtube.com/c/') + 'youtube.com/c/'.length);
		} else if (channel.includes('youtube.com/')) {
			handle = channel.substring(channel.indexOf('youtube.com/') + 'youtube.com/'.length);
		} else {
			handle = channel;
		}

		if (handle && handle[0] === '@') {
			handle = handle.substring(1);
		}

		// sanitize handle/id and description inputs
		const unsanitizedHandle = handle;
		const unsanitizedId = id;
		handle = handle ? handle.replace(/[&#?{}[\]$/\\'" ]/g, '') : null;
		id = id ? id.replace(/[^a-zA-Z0-9_-]/g, '') : null;
		description = description.replace(/[^a-zA-Z0-9-_.,:;() ]/g, '');

		if (
			handle !== unsanitizedHandle ||
			id !== unsanitizedId ||
			description !== formData.get('description')
		)
			return fail(400, {
				error: 'invalid characters in channel or description'
			});

		// check if channel is in db
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

		// check if limit per ip is reached
		const recentSubmissions = await sql`
			SELECT COUNT(*) 
			FROM youtube 
			WHERE ip_address = ${clientIpAddress} 
			AND submitted_on = CURRENT_DATE
		`;

		if (recentSubmissions[0].count >= 5) {
			return fail(429, {
				error: 'limit reached for this ip address, try again tomorrow'
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

			await sql`
        INSERT INTO youtube (id, handle, title, channel_description, subscribers, initial_subscribers, profile_picture_url, topic_categories, keywords, user_description, ip_address) 
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
					${clientIpAddress}
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
	},
	vote: async ({ request, cookies }) => {
		const formData = await request.formData();

		let votedFor = cookies.get('votedFor');

		if (votedFor && votedFor.includes(formData.get('id') as string))
			return fail(409, {
				error: 'already voted for this channel'
			});

		try {
			if (!formData.has('id'))
				return fail(400, {
					error: 'id is required'
				});

			await sql`UPDATE youtube SET votes = votes + 1 WHERE id = ${formData.get('id') as string}`;

			if (votedFor) {
				votedFor += `|${formData.get('id')}`;
			} else {
				votedFor = formData.get('id') as string;
			}

			cookies.set('votedFor', votedFor, { path: "/"});

			return {
				status: 201,
				message: 'vote counted successfully'
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				error: 'error submitting vote'
			});
		}
	},
	report: async ({ request, cookies }) => {
		const formData = await request.formData();

		let reported = cookies.get('reported');

		if (reported && reported.includes(formData.get('id') as string))
			return fail(409, {
				error: 'already reported this channel'
			});

		try {
			if (!formData.has('id'))
				return fail(400, {
					error: 'id is required'
				});

			await sql`UPDATE youtube SET reports = reports + 1 WHERE id = ${formData.get('id') as string}`;

			if (reported) {
				reported += `|${formData.get('id')}`;
			} else {
				reported = formData.get('id') as string;
			}

			cookies.set('reported', reported, { path: "/"});

			return {
				status: 201,
				message: 'report submitted successfully'
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				error: 'error submitting report'
			});
		}
	},
	search: async ({ request }) => {
		const formData = await request.formData();

		if (!formData.has('query'))
			return fail(400, {
				error: 'query is required'
			});

		let query = formData.get('query') as string;
		query = `%${query}%`;

		try {
			const channels = await sql`
				SELECT * 
				FROM youtube 
				WHERE title ILIKE ${query} 
				OR handle ILIKE ${query} 
				OR topic_categories ILIKE ${query} 
				OR keywords ILIKE ${query} 
				OR channel_description ILIKE ${query} 
				OR user_description ILIKE ${query} 
				ORDER BY score DESC
				LIMIT 24
			`;

			return {
				channels: channels
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				error: 'error searching channels'
			});
		}
	}
};
