import { pokeApiEndpoint } from '$lib/http/pokemon-api-service.svelte.js';
import type { NamedAPIResourceList } from 'pokenode-ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { queryClient } = await parent();

	const pokedexResponse = await queryClient.fetchQuery({
		queryKey: ['pokedex'],
		queryFn: () => fetch(`${pokeApiEndpoint}pokedex?limit=1000`)
	});

	const pokemonResponse = await queryClient.fetchQuery({
		queryKey: ['pokemon'],
		queryFn: () => fetch(`${pokeApiEndpoint}pokemon?limit=2000`)
	});

	if (!pokedexResponse.ok || !pokemonResponse.ok) {
		throw new Error('Failed to fetch pokedex or pokemon');
	}

	const pokedexes: NamedAPIResourceList = await pokedexResponse.clone().json();
	const pokemon: NamedAPIResourceList = await pokemonResponse.clone().json();

	return {
		pokedexes: pokedexes.results,
		pokemon: pokemon.results
	};
};
