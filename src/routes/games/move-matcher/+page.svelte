<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { fetchData } from '$lib/http/pokemon-api-service.svelte';
	import { reactiveQueryArgs } from '$lib/tanstack-query-utils.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Move, Pokemon } from 'pokenode-ts/lib/index.d.ts';

	let currentScore = $state(0);
	let currentQuestion = $state(1);
	let totalQuestions = 10;

	let locale = 'en'; // TODO: Get locale from store

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

	let nonMatchingMoves = $derived(
		pokemonOne?.moves
			.filter((move) => !pokemonTwo?.moves.includes(move))
			.map((pokemonMove) => pokemonMove.move.name)
	);

	let remainingMoveAnswers = $derived.by(() => {
		if (!nonMatchingMoves || !selectedMove || !moveList) {
			return undefined;
		}
		let selection: string[] = [];
		const randomNonMatchingMoves = nonMatchingMoves.sort(() => Math.random() - 0.5);
		if (nonMatchingMoves.length >= 3) {
			selection = [selectedMove, ...randomNonMatchingMoves.slice(0, 3)];
			return selection;
		}
		let remainingMoves = moveList.filter(
			(move) => move !== selectedMove && !nonMatchingMoves.includes(move)
		);
		shuffleMoves(remainingMoves);
		selection = [
			selectedMove,
			...nonMatchingMoves,
			...remainingMoves.slice(0, 3 - randomNonMatchingMoves.length)
		];
		return selection;
	});

	function shuffleMoves(moves: string[] | Move[]) {
		for (let i = moves.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[moves[i], moves[j]] = [moves[j], moves[i]];
		}
		pokemonOne?.sprites.front_default;
	}

	let remainingMovesQuery = createQuery<Move[]>(
		reactiveQueryArgs(() => ({
			queryKey: [
				'move',
				`move/${remainingMoveAnswers?.at(1)}`,
				`move/${remainingMoveAnswers?.at(2)}`,
				`move/${remainingMoveAnswers?.at(3)}`
			],
			queryFn: async () => {
				const res = await Promise.all([
					fetchData<Move>(`move/${remainingMoveAnswers?.at(1)}`),
					fetchData<Move>(`move/${remainingMoveAnswers?.at(2)}`),
					fetchData<Move>(`move/${remainingMoveAnswers?.at(3)}`)
				]);
				return res;
			},
			enabled: () => remainingMoveAnswers !== undefined
		}))
	);

	let moveChoices = $derived.by(() => {
		if (!$remainingMovesQuery.data || !$selectedMoveQuery.data) {
			return undefined;
		}
		const moves = [$selectedMoveQuery.data, ...$remainingMovesQuery.data];
		shuffleMoves(moves);
		return moves;
	});

	const onNextQuestion = () => {
		chosenAnswer = undefined;
		if (currentQuestion < totalQuestions) {
			currentQuestion++;
			if (moveList) {
				setSelectedMove(moveList);
			}
		} else {
			goto('/');
		}
	};

	let chosenAnswer = $state<string | undefined>(undefined);
	let correctAnswerSelected = $derived.by(() => {
		if (chosenAnswer === undefined) {
			return undefined;
		}
		return chosenAnswer === selectedMove;
	});
</script>

<div>
	<div
		class="flex w-full flex-col items-center justify-center gap-2 pb-4 lg:flex-row lg:justify-between"
	>
		<div class="border-primary w-48 rounded-lg border-2 p-2 text-center">
			Score | <span class="font-bold">{currentScore}</span>
		</div>
		<div class="border-primary w-48 rounded-lg border-2 p-2 text-center">
			Question | <span class="font-bold">{currentQuestion} / {totalQuestions}</span>
		</div>
	</div>
	<h2 class="flex items-center justify-center pb-8 text-2xl">
		Which move do these Pokemon have in common?
	</h2>
	{#if !pokemonOne || !pokemonTwo || !remainingMoveAnswers || !moveChoices}
		<div class="flex flex-col items-center justify-center gap-8 pb-8 lg:flex-row">
			<Skeleton class="h-32 w-32 rounded-lg" />
			<Skeleton class="h-32 w-32 rounded-lg" />
		</div>
		<div class="flex flex-col items-center justify-center gap-2 pb-10 lg:flex-row lg:gap-8">
			<Button class="w-40" disabled></Button>
			<Button class="w-40" disabled></Button>
			<Button class="w-40" disabled></Button>
			<Button class="w-40" disabled></Button>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center gap-8 pb-8 lg:flex-row">
			<div>
				<img
					class="border-primary h-32 w-32 rounded-lg border-2 object-cover"
					src={pokemonOne.sprites.front_default}
					alt={pokemonOne.name}
				/>
			</div>
			<div>
				<img
					class="border-primary h-32 w-32 rounded-lg border-2 object-cover"
					src={pokemonTwo.sprites.front_default}
					alt={pokemonTwo.name}
				/>
			</div>
		</div>
		<div class="flex flex-col items-center justify-center gap-2 pb-10 lg:flex-row lg:gap-8">
			{#each moveChoices as move}
				<Button
					disabled={correctAnswerSelected !== undefined}
					onclick={() => {
						chosenAnswer = move.name;
						if (selectedMove === move.name) {
							currentScore++;
						}
					}}
					variant="outline"
					class="w-40 {selectedMove === move.name && correctAnswerSelected !== undefined
						? 'border-green-400 text-white'
						: correctAnswerSelected !== undefined
							? 'border-red-400 text-white'
							: ''}">{move.names.find((x) => x.language.name === locale)?.name ?? move.name}</Button
				>
			{/each}
		</div>
		<div class="flex items-center justify-center lg:items-end lg:justify-end">
			<Button disabled={correctAnswerSelected === undefined} onclick={onNextQuestion}
				>Next Question</Button
			>
		</div>
	{/if}
</div>

<style>
</style>
