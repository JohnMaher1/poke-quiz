<script lang="ts">
	import { fetchData } from '$lib/http/pokemon-api-service.svelte.js';
	import { reactiveQueryArgs } from '$lib/tanstack-query-utils.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { NamedAPIResourceList, Pokedex, PokemonSpecies } from 'pokenode-ts';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toPascalCase } from '$lib/text-helpers.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	let open = $state(true);
	let value = $state('');

	const pokedexQuery = createQuery<NamedAPIResourceList>(
		reactiveQueryArgs(() => ({
			queryKey: ['pokedex'],
			queryFn: () => fetchData('pokedex?limit=1000')
		}))
	);

	const pokemonQuery = createQuery<NamedAPIResourceList>(
		reactiveQueryArgs(() => ({
			queryKey: ['pokemon'],
			queryFn: () => fetchData('pokemon?limit=2000')
		}))
	);

	const locale = languageTag();
	const pokedexNames = $derived($pokedexQuery.data?.results.map((pokedex) => pokedex.name));
	const pokemonNames = $derived($pokemonQuery.data?.results.map((p) => p.name));

	const getRandomPokedex = (pokedexNames: string[], currentPokedex?: string) => {
		let randomPokedex = pokedexNames[Math.floor(Math.random() * pokedexNames.length)];
		if (randomPokedex === currentPokedex) {
			return getRandomPokedex(pokedexNames, currentPokedex);
		}
		return randomPokedex;
	};

	let selectedPokedexName = $state<string | undefined>(undefined);

	$effect(() => {
		if (pokedexNames) {
			selectedPokedexName = getRandomPokedex(pokedexNames);
		}
	});

	let selectedPokedexQuery = createQuery<Pokedex>(
		reactiveQueryArgs(() => ({
			queryKey: ['pokedex', `pokedex/${selectedPokedexName}`],
			queryFn: () => fetchData(`pokedex/${selectedPokedexName}`),
			enabled: () => selectedPokedexName !== undefined
		}))
	);

	let selectedPokedex = $derived($selectedPokedexQuery.data);
	let randomEntry = $derived(
		selectedPokedex?.pokemon_entries[
			Math.floor(Math.random() * selectedPokedex?.pokemon_entries.length)
		]
	);

	let pokemonSpeciesQuery = createQuery<PokemonSpecies>(
		reactiveQueryArgs(() => ({
			queryKey: ['pokemon-species', `pokemon-species/${randomEntry?.entry_number}`],
			queryFn: () => fetchData(`pokemon-species/${randomEntry?.entry_number}`),
			enabled: () => randomEntry !== undefined
		}))
	);

	let pokemonSpecies = $derived($pokemonSpeciesQuery.data);
	let pokemonSpeciesName = $derived(pokemonSpecies?.name);
	let flavourTextEntry = $derived(
		pokemonSpecies?.flavor_text_entries.find((f) => f.language.name === locale)
	);
	let removedPokemonNameTextEntry = $derived(
		flavourTextEntry?.flavor_text?.replace(new RegExp(pokemonSpeciesName ?? '', 'i'), '[Pokemon]')
	);
	let formattedTextEntry = $derived(removedPokemonNameTextEntry?.replace('\n', ' '));

	let inputVal = $state('');

	let userSelection = $state('');

	let filteredPokemonNames = $derived.by(() => {
		if (!pokemonNames) {
			return [];
		}
		if (inputVal.length < 3) {
			return [];
		}
		return pokemonNames.filter((p) => p.toLowerCase().includes(inputVal.toLowerCase()));
	});

	let submittedAnswer = $state<string | undefined>(undefined);
	let correctAnswerSelected = $derived(submittedAnswer === pokemonSpeciesName);

	let isLoading = $derived(
		$selectedPokedexQuery.isLoading ||
			$pokemonSpeciesQuery.isLoading ||
			$pokedexQuery.isLoading ||
			$pokemonQuery.isLoading
	);

	const reset = () => {
		selectedPokedexName = getRandomPokedex(pokedexNames!, selectedPokedexName);
		submittedAnswer = undefined;
		value = '';
	};
</script>

<div class="mx-auto flex max-w-md flex-col items-center justify-center gap-4 text-center">
	{#if isLoading}
		<div class="flex w-full flex-col gap-2">
			<Skeleton class="h-12 w-[90%] md:w-100" />
			<Skeleton class="h-32 w-[90%] md:w-100" />
			<div class="h-4"></div>
			<Skeleton class="h-12 w-[90%] md:w-100" />
			<Skeleton class="h-12 w-[90%] md:w-100" />
		</div>
	{:else}
		<div>
			Pokedex: <span class="font-bold"> {toPascalCase(selectedPokedexName ?? '')}</span>
		</div>
		<div>
			{formattedTextEntry}
		</div>
		{#if value}
			<div class="pt-4">
				Selected Pokemon: <span class="text-selection-foreground">{toPascalCase(value)}</span>
			</div>
		{/if}
		<Command.Root>
			<Command.Input
				disabled={submittedAnswer !== undefined}
				value={toPascalCase(value)}
				oninput={(x) => {
					inputVal = (x.target as HTMLInputElement).value;
				}}
				placeholder="Search Pokemon..."
			/>
			<Command.List>
				{#if filteredPokemonNames.length === 0 && inputVal.length >= 3}
					<div class="px-4 py-2">No results found</div>
				{:else}
					<div class="flex max-h-80 flex-col overflow-y-auto text-start">
						{#each filteredPokemonNames as pokedexName}
							<button
								onclick={() => {
									open = false;
									userSelection = pokedexName;
									inputVal = '';
									value = pokedexName;
								}}
							>
								<div
									class="hover:text-selection-foreground hover:bg-selection w-full cursor-pointer px-4 py-2 text-start"
								>
									{toPascalCase(pokedexName)}
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</Command.List>
			<div class="flex w-full flex-col items-center justify-center gap-2 pt-12">
				<Button
					variant="default"
					class="relative w-[90%] bg-gradient-to-r md:w-100"
					disabled={submittedAnswer !== undefined}
					onclick={() => {
						submittedAnswer = value;
					}}>Submit</Button
				>
				<Button
					variant="default"
					class="relative w-[90%] bg-gradient-to-r md:w-100"
					disabled={submittedAnswer === undefined}
					onclick={reset}>Next Entry</Button
				>
			</div>
		</Command.Root>
	{/if}
	{#if submittedAnswer !== undefined && pokemonSpeciesName}
		<div>
			{#if correctAnswerSelected}
				<span
					>Correct: <span class="text-selection-foreground">{toPascalCase(pokemonSpeciesName)}</span
					></span
				>
			{:else}
				<span class="text-destructive">Incorrect</span>:
				<span> {toPascalCase(pokemonSpeciesName)}</span>
			{/if}
		</div>
	{/if}
</div>
