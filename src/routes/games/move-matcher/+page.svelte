<script lang="ts">
	import { fetchData } from '$lib/http/pokemon-api-service.svelte';
	import { reactiveQueryArgs } from '$lib/tanstack-query-utils.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Move, Pokemon } from 'pokenode-ts/lib/index.d.ts';

	const movesQuery = createQuery<{ results: { name: string; url: string }[] }>({
		queryKey: ['moves'],
		queryFn: async () => await fetchData('move?limit=1000')
	});

	let moveList = $derived($movesQuery.data?.results.map((move) => move.name));

	let selectedMove = $state<string | undefined>(undefined);
	$effect(() => {
		if (moveList) {
			setSelectedMove(moveList);
		}
	});

	function setSelectedMove(moveList: string[]) {
		selectedMove = moveList[Math.floor(Math.random() * moveList.length)];
	}

	let selectedMoveQuery = createQuery<Move>(
		reactiveQueryArgs(() => ({
			queryKey: ['move', `move/${selectedMove}`],
			queryFn: () => fetchData(`move/${selectedMove}`),
			enabled: () => selectedMove !== undefined
		}))
	);

	// If the move is learned by only one pokemon, swap the selected move
	$effect(() => {
		if (learnedByPokemon && learnedByPokemon.length < 2 && moveList) {
			setSelectedMove(moveList);
		}
	});

	let learnedByPokemon = $derived(
		$selectedMoveQuery.data?.learned_by_pokemon.map((pokemon) => pokemon.name)
	);

	let pokemonOneName = $derived(
		learnedByPokemon
			? learnedByPokemon[Math.floor(Math.random() * learnedByPokemon.length)]
			: undefined
	);
	let pokemonTwoName = $derived(
		learnedByPokemon && pokemonOneName
			? getRandomPokemon(learnedByPokemon, pokemonOneName)
			: undefined
	);

	// To ensure uniqueness
	function getRandomPokemon(pokemonList: string[], excludePokemon: string): string {
		let randomPokemon;
		if (pokemonList.length === 1) {
			return pokemonList[0];
		}
		do {
			randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
		} while (randomPokemon === excludePokemon);
		return randomPokemon;
	}

	let pokemonOneQuery = createQuery<Pokemon>(
		reactiveQueryArgs(() => ({
			queryKey: ['pokemonOne', `pokemon/${pokemonOneName}`],
			queryFn: async () => await fetchData(`pokemon/${pokemonOneName}`),
			enabled: () => pokemonOneName !== undefined
		}))
	);

	let pokemonTwoQuery = createQuery<Pokemon>(
		reactiveQueryArgs(() => ({
			queryKey: ['pokemonTwo', `pokemon/${pokemonTwoName}`],
			queryFn: async () => await fetchData(`pokemon/${pokemonTwoName}`),
			enabled: () => pokemonTwoName !== undefined
		}))
	);

	let pokemonOne = $derived($pokemonOneQuery.data);
	let pokemonTwo = $derived($pokemonTwoQuery.data);

	$inspect(selectedMove, $selectedMoveQuery.data);
</script>

<div>
	<div>
		{#if $movesQuery.isPending}
			Loading...
		{/if}
		{#if $movesQuery.error}
			An error has occurred:
			{$movesQuery.error.message}
		{/if}
		{#if $movesQuery.isSuccess && $selectedMoveQuery.isSuccess}
			<div>Selected Move: {selectedMove}</div>
			{#if pokemonOne && pokemonTwo}
				<div>
					<div>Pokemon One: {pokemonOne.name}</div>
					<img src={pokemonOne.sprites.front_default} alt={pokemonOne.name} />
					<div>Pokemon Two: {pokemonTwo.name}</div>
					<img src={pokemonTwo.sprites.front_default} alt={pokemonTwo.name} />
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
</style>
