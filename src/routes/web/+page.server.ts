import { sql } from '$lib/db.server';
import { fail } from '@sveltejs/kit';
import 'dotenv/config';

export async function load() {
	try {
		const websites =
			await sql`SELECT * FROM web WHERE is_banned = false ORDER BY score DESC LIMIT 30`;

		return {
			websites: websites
		};
	} catch (error) {
		console.error(error);
		return fail(500, {
			error: 'error loading websites'
		});
	}
}

export const actions = {
	submit: async (event) => {
		const request = event.request;
		const formData = await request.formData();

		if (!formData.has('url') || !formData.has('description'))
			return fail(400, {
				error: 'url and description are required'
			});

		let url = formData.get('url') as string;
		let description = formData.get('description') as string;

		if (!description || description.length < 10 || description.length > 150)
			return fail(400, {
				error: 'description must be between 10 and 150 characters'
			});

		// extract domain from url
		const urlObj = new URL(url);
		url = urlObj.hostname;

		// sanitize url and description inputs
		const unsanitizedUrl = url;
		url = url.replace(/[^a-zA-Z0-9._-]/g, '');
		description = description.replace(/[^a-zA-Z0-9-_.,:;() \r\n]/g, '');

		if (url !== unsanitizedUrl || description !== formData.get('description'))
			return fail(400, {
				error: 'invalid characters in url or description'
			});

		// check if website is in db
		const sqlExistsCheck = await sql`SELECT * FROM web WHERE url ILIKE ${url}`;

		if (sqlExistsCheck && sqlExistsCheck?.length !== 0) {
			if (sqlExistsCheck[0].is_banned)
				return fail(409, {
					error: 'website is banned'
				});
			else
				return fail(409, {
					error: 'website is already submitted, vote for it instead'
				});
		}

		try {
			await sql`
        INSERT INTO web (url, user_description) 
        VALUES (
          ${url},
          ${formData.get('description') as string}
        ) 
        ON CONFLICT (url) DO NOTHING`;

			return {
				status: 201,
				message: 'website submitted successfully'
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				error: 'error submitting website'
			});
		}
	},
	vote: async ({ request, cookies }) => {
		const formData = await request.formData();

		let votedFor = cookies.get('votedForWeb');

		if (votedFor && votedFor.includes(formData.get('url') as string))
			return fail(409, {
				error: 'already voted for this website'
			});

		try {
			if (!formData.has('url'))
				return fail(400, {
					error: 'url is required'
				});

			await sql`UPDATE web SET votes = votes + 1 WHERE url = ${formData.get('url') as string}`;

			if (votedFor) {
				votedFor += `|${formData.get('url')}`;
			} else {
				votedFor = formData.get('url') as string;
			}

			cookies.set('votedForWeb', votedFor, { path: '/', maxAge: 60 * 60 * 24 * 365 });

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

		let reported = cookies.get('reportedWeb');

		if (reported && reported.includes(formData.get('url') as string))
			return fail(409, {
				error: 'already reported this website'
			});

		try {
			if (!formData.has('url'))
				return fail(400, {
					error: 'url is required'
				});

			await sql`UPDATE web SET reports = reports + 1 WHERE url = ${formData.get('url') as string}`;

			if (reported) {
				reported += `|${formData.get('url')}`;
			} else {
				reported = formData.get('url') as string;
			}

			cookies.set('reportedWeb', reported, { path: '/', maxAge: 60 * 60 * 24 * 365 });

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

		const query =
			formData.has('query') && formData.get('query') !== ''
				? `%${formData.get('query') as string}%`
				: null;

		try {
			let websites;
			if (query) {
				websites = await sql`
					SELECT * 
					FROM web 
					WHERE (url ILIKE ${query} 
					OR user_description ILIKE ${query}) 
					AND is_banned = false
					ORDER BY score DESC
					LIMIT 30
				`;
			} else {
				websites = await sql`
					SELECT * 
					FROM web 
					WHERE is_banned = false 
					ORDER BY score DESC 
					LIMIT 30
				`;
			}

			return {
				searchResults: websites
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				error: 'error searching websites'
			});
		}
	},
	load: async ({ request }) => {
		const formData = await request.formData();

		if (!formData.has('offset'))
			return fail(400, {
				error: 'error loading more'
			});

		const offset = Number(formData.get('offset'));
		const query =
			formData.has('query') && formData.get('query') !== ''
				? `%${formData.get('query') as string}%`
				: null;

		try {
			let websites;
			if (query) {
				websites = await sql`
					SELECT * 
					FROM web 
					WHERE (url ILIKE ${query} 
					OR user_description ILIKE ${query}) 
					AND is_banned = false
					ORDER BY score DESC
					LIMIT 30 
					OFFSET ${offset}
				`;
			} else {
				websites = await sql`
					SELECT * 
					FROM web 
					WHERE is_banned = false 
					ORDER BY score DESC 
					LIMIT 30 
					OFFSET ${offset}
				`;
			}

			return {
				moreWebsites: websites
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				error: 'error loading more'
			});
		}
	}
};
