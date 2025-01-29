<script lang="ts">
	import { fetchData } from '$lib/http/pokemon-api-service.svelte.js';
	import { reactiveQueryArgs } from '$lib/tanstack-query-utils.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Pokedex, PokemonSpecies } from 'pokenode-ts';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';
	import { toPascalCase } from '$lib/text-helpers.js';
	import { Item } from '$lib/components/ui/dropdown-menu/index.js';

	let open = $state(false);
	let value = $state('');
	let triggerRef = $state<HTMLButtonElement>(null!);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	let { data } = $props();
	const locale = languageTag();

	let pokedexNames = data.pokedexes.map((pokedex) => pokedex.name);
	let pokemon = data.pokemon;
	let pokemonNames = pokemon.map((p) => p.name);

	const selectedValue = $derived(pokedexNames.find((f) => f === value));

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
		flavourTextEntry?.flavor_text.replace(new RegExp(pokemonSpeciesName ?? '', 'i'), '[Pokemon]')
	);
	let formattedTextEntry = $derived(removedPokemonNameTextEntry?.replace('\n', ' '));

	let inputVal = $state('');

	let filteredPokemonNames = $derived.by(() => {
		if (!pokemonNames) {
			return [];
		}
		if (inputVal.length < 3) {
			return [];
		}
		return pokemonNames.filter((p) => p.toLowerCase().includes(inputVal.toLowerCase()));
	});
</script>

{#snippet item(val: string)}
	<div class="cursor-pointer hover:brightness-90">
		<Check class={cn('mr-2 size-4')} />
		{val}
	</div>
{/snippet}

<div>
	{formattedTextEntry}
</div>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="secondary"
				class="w-[200px] justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || 'Select a Pokemon...'}
				<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input
				oninput={(x) => {
					inputVal = (x.target as HTMLInputElement).value;
				}}
				placeholder="Search Pokemon..."
			/>
			<Command.List>
				<Command.Empty>No Pokemon found</Command.Empty>
			</Command.List>
			<div>
				{#each filteredPokemonNames as pokedexName}
					<div
						class="hover:bg-primary hover:text-primary-foreground w-full cursor-pointer px-4 py-2"
					>
						{toPascalCase(pokedexName)}
					</div>
				{/each}
			</div>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
