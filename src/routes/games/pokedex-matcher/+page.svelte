<script lang="ts">
	import { fetchData } from '$lib/http/pokemon-api-service.svelte.js';
	import { reactiveQueryArgs } from '$lib/tanstack-query-utils.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Pokedex } from 'pokenode-ts';
	import { languageTag } from '$lib/paraglide/runtime.js';

	let { data } = $props();
	const locale = languageTag();

	let pokedexNames = data.pokedexes.map((pokedex) => pokedex.name);

	const getRandomPokedex = (pokedexNames: string[], currentPokedex?: string) => {
		let randomPokedex = pokedexNames[Math.floor(Math.random() * pokedexNames.length)];
		if (randomPokedex === currentPokedex) {
			return getRandomPokedex(pokedexNames, currentPokedex);
		}
		return randomPokedex;
	};

	let selectedPokedexName = $state(getRandomPokedex(pokedexNames));

	let selectedPokedexQuery = createQuery<Pokedex>(
		reactiveQueryArgs(() => ({
			queryKey: ['pokedex', `pokedex/${selectedPokedexName}`],
			queryFn: () => fetchData(`pokedex/${selectedPokedexName}`),
			enabled: () => selectedPokedexName !== undefined
		}))
	);

	let selectedPokedex = $derived($selectedPokedexQuery.data);
</script>
