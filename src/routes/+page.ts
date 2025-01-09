import { frames } from '$lib/sea_animation';

export const prerender = true;

export function load() {
	return {
		frames: frames
	};
}
