import { pokeApiEndpoint } from '$lib/http/pokemon-api-service.svelte.js';
import type { NamedAPIResourceList } from 'pokenode-ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	const res = await queryClient.fetchQuery({
		queryKey: ['moves'],
		queryFn: () => fetch(`${pokeApiEndpoint}move?limit=1000`)
	});

	if (!res.ok) {
		throw new Error('Failed to fetch moves');
	}

	const moves: NamedAPIResourceList = await res.clone().json();

	return {
		moves: moves.results
	};
};
