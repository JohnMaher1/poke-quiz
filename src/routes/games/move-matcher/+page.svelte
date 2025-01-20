<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { fetchData } from '$lib/http/pokemon-api-service.svelte';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import { reactiveQueryArgs } from '$lib/tanstack-query-utils.svelte';
	import { toPascalCase } from '$lib/text-helpers';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Move, Pokemon } from 'pokenode-ts/lib/index.d.ts';
	import { Confetti } from 'svelte-confetti';

	let currentScore = $state(0);
	let currentQuestion = $state(1);
	let totalQuestions = 10;

	let { data } = $props();

	const locale = languageTag();

	let moveList = $derived(data.moves.map((move) => move.name));

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
		let randomPokemon: string;
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

	let pokemonOneMoves = $derived(pokemonOne?.moves.map((pokemonMove) => pokemonMove.move.name));
	let pokemonTwoMoves = $derived(pokemonTwo?.moves.map((pokemonMove) => pokemonMove.move.name));

	let nonMatchingMoves = $derived(
		pokemonOneMoves && pokemonTwoMoves
			? pokemonOneMoves.filter((move) => !pokemonTwoMoves.includes(move))
			: undefined
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
		pokemonImageOneLoaded = false;
		pokemonImageTwoLoaded = false;
		if (currentQuestion < totalQuestions) {
			currentQuestion++;
			hasChosenCorrectMove = false;
			if (moveList) {
				setSelectedMove(moveList);
			}
		} else {
			goto('/games/move-matcher/game-end', {
				state: { score: currentScore, totalQuestions }
			});
		}
	};

	let chosenAnswer = $state<string | undefined>(undefined);
	let correctAnswerSelected = $derived.by(() => {
		if (chosenAnswer === undefined) {
			return undefined;
		}
		return chosenAnswer === selectedMove;
	});

	let pokemonImageOne = $derived(pokemonOne?.sprites.front_default);
	let pokemonImageTwo = $derived(pokemonTwo?.sprites.front_default);
	let pokemonImageOneLoaded = $state(false);
	let pokemonImageTwoLoaded = $state(false);
	$effect(() => {
		let imgOne: HTMLImageElement;
		let imgTwo: HTMLImageElement;
		if (pokemonImageOne) {
			imgOne = new Image();
			imgOne.src = pokemonImageOne;
			imgOne.onload = () => {
				pokemonImageOneLoaded = true;
			};
		}
		if (pokemonImageTwo) {
			imgTwo = new Image();
			imgTwo.src = pokemonImageTwo;
			imgTwo.onload = () => {
				pokemonImageTwoLoaded = true;
			};
		}
		return () => {
			imgOne?.remove();
			imgTwo?.remove();
		};
	});

	let hasChosenCorrectMove = $state(false);

	const onCorrectMovedSelected = () => {
		currentScore++;
		hasChosenCorrectMove = true;
	};
</script>

{#snippet gameHeader()}
	<div class="flex w-full items-center justify-center gap-4 pb-4">
		<div class="border-primary w-48 rounded-lg border-2 p-2 text-center">
			Score | <span class="font-bold">{currentScore}</span>
		</div>
		<div class="border-primary w-48 rounded-lg border-2 p-2 text-center">
			Question | <span class="font-bold">{currentQuestion} / {totalQuestions}</span>
		</div>
	</div>
	<h2 class="flex items-center justify-center pb-8 text-center text-2xl">
		Which move do these Pokemon have in common?
	</h2>
{/snippet}

<div class="h-full">
	{#if !pokemonOne || !pokemonTwo || !moveChoices || !remainingMoveAnswers || !pokemonImageOneLoaded || !pokemonImageTwoLoaded}
		{@render gameHeader()}
		<div class="flex flex-row items-center justify-center gap-4 pb-8">
			<div class="flex flex-col items-end justify-end gap-2">
				<Skeleton class="h-4 w-36 lg:w-52" />
				<Skeleton class="h-36 w-36 rounded-lg lg:h-52 lg:w-52" />
			</div>
			<div class="flex flex-col gap-2">
				<Skeleton class="h-4 w-36 lg:w-52" />
				<Skeleton class="h-36 w-36 rounded-lg lg:h-52 lg:w-52" />
			</div>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-2 pb-10 lg:flex-row lg:gap-8">
			<Skeleton class="h-10 w-[90%] lg:w-60" />
			<Skeleton class="h-10 w-[90%] lg:w-60" />
			<Skeleton class="h-10 w-[90%] lg:w-60" />
			<Skeleton class="h-10 w-[90%] lg:w-60" />
		</div>
	{:else}
		<div class="flex h-full flex-col justify-between lg:justify-normal">
			<div>
				{@render gameHeader()}
				<div class="flex items-center justify-center gap-4 pb-8">
					<div class="flex w-full flex-col items-end justify-end">
						<div
							class="w-32 truncate overflow-x-hidden pb-2 text-center font-bold text-nowrap lg:w-52"
						>
							{toPascalCase(pokemonOne.name)}
						</div>
						<img
							class="border-primary h-36 w-36 self-end rounded-lg border-2 object-cover lg:h-52 lg:w-52"
							src={pokemonOne.sprites.front_default}
							alt={pokemonOne.name}
						/>
					</div>
					<div class="flex w-full flex-col">
						<div
							class="w-32 truncate overflow-x-hidden pb-2 text-center font-bold text-nowrap lg:w-52"
						>
							{toPascalCase(pokemonTwo.name)}
						</div>
						<img
							class="border-primary h-36 w-36 self-start rounded-lg border-2 object-cover lg:h-52 lg:w-52"
							src={pokemonTwo.sprites.front_default}
							alt={pokemonTwo.name}
						/>
					</div>
				</div>

				<div class="flex flex-col items-center justify-center gap-2 pb-10 lg:flex-row lg:gap-6">
					{#each moveChoices as move}
						{@const correctMove = move.name === selectedMove && correctAnswerSelected !== undefined}
						<div class="relative">
							{#if hasChosenCorrectMove && selectedMove === move.name}
								<div class="absolute top-0 flex w-full items-center justify-center">
									<Confetti fallDistance={'50px'} />
								</div>
							{/if}

							<Button
								disabled={correctAnswerSelected !== undefined}
								onclick={() => {
									chosenAnswer = move.name;
									if (selectedMove === move.name) {
										onCorrectMovedSelected();
									}
								}}
								variant="outline"
								class="w-[90%] text-lg lg:w-60 {correctMove
									? 'bg-green-500 text-black brightness-150'
									: correctAnswerSelected !== undefined
										? 'bg-red-500 text-black brightness-150'
										: ''} {correctAnswerSelected && selectedMove === move.name && 'animate-bounce'}"
								>{move.names.find((x) => x.language.name === locale)?.name ?? move.name}
							</Button>
						</div>
					{/each}
				</div>
			</div>
			<div>
				<div>
					<div class="flex w-full items-center justify-center pb-4">
						<Button
							class="w-[90%] lg:w-80"
							disabled={correctAnswerSelected === undefined}
							onclick={onNextQuestion}
							>{totalQuestions === currentQuestion ? 'Finish' : 'Next Question'}</Button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
