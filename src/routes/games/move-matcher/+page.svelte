<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { fetchData } from '$lib/http/pokemon-api-service.svelte';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import { reactiveQueryArgs } from '$lib/tanstack-query-utils.svelte';
	import { toPascalCase } from '$lib/text-helpers';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Move, NamedAPIResourceList, Pokemon } from 'pokenode-ts/lib/index.d.ts';
	import { Confetti } from 'svelte-confetti';

	let currentScore = $state(0);
	let currentQuestion = $state(1);
	let totalQuestions = 10;

	const locale = languageTag();

	const movesQuery = createQuery<NamedAPIResourceList>(
		reactiveQueryArgs(() => ({
			queryKey: ['moves'],
			queryFn: () => fetchData('move?limit=1000')
		}))
	);

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
	let pokemonOneHasImage = $derived(pokemonOne && pokemonOne.sprites.front_default);
	let pokemonImageTwo = $derived(pokemonTwo?.sprites.front_default);
	let pokemonTwoHasImage = $derived(pokemonTwo && pokemonTwo.sprites.front_default);

	let pokemonImageOneLoaded = $state(false);
	let pokemonImageTwoLoaded = $state(false);
	$effect(() => {
		let imgOne: HTMLImageElement;
		let imgTwo: HTMLImageElement;
		if (pokemonImageOne) {
			imgOne = new Image();
			imgOne.src = pokemonImageOne;
			pokemonImageOneLoaded = true;
		}
		if (!pokemonOneHasImage) {
			imgOne = new Image();
			imgOne.alt = 'No Image';
			pokemonImageOneLoaded = true;
		}
		if (pokemonImageTwo) {
			imgTwo = new Image();
			imgTwo.src = pokemonImageTwo;
			pokemonImageTwoLoaded = true;
		}
		if (!pokemonTwoHasImage) {
			imgTwo = new Image();
			imgTwo.alt = 'No Image';
			pokemonImageTwoLoaded = true;
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
		<div class=" border-muted flex w-48 justify-between rounded-md border p-2 px-4 text-center">
			<span>Question:</span> <span class="font-bold">{currentQuestion} / {totalQuestions}</span>
		</div>
		<div class="border-muted flex w-48 justify-between rounded-md border p-2 px-4 text-center">
			<span>Score:</span><span class="font-bold">{currentScore}</span>
		</div>
	</div>
	<h2 class="flex items-center justify-center pb-8 text-center text-2xl">
		Which move do these Pokemon have in common?
	</h2>
{/snippet}

<div class="h-full">
	{#if !pokemonOne || !pokemonTwo || !moveChoices || !remainingMoveAnswers || !pokemonImageOneLoaded || !pokemonImageTwoLoaded}
		{@render gameHeader()}
		<div class="mx-auto flex max-w-2xl flex-row items-center justify-center gap-4 pb-8">
			<div class="flex flex-col items-end justify-end gap-2">
				<Skeleton class="h-6 w-36 md:w-60" />
				<Skeleton class="h-36 w-36 rounded-md md:h-60 md:w-60" />
			</div>
			<div class="flex flex-col gap-2">
				<Skeleton class="h-6 w-36 md:w-60" />
				<Skeleton class="h-36 w-36 rounded-md md:h-60 md:w-60" />
			</div>
		</div>
		<div
			class="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-2 pb-10 md:grid md:grid-cols-2 md:gap-8"
		>
			<Skeleton class="h-10 w-full" />
			<Skeleton class="h-10 w-full" />
			<Skeleton class="h-10 w-full" />
			<Skeleton class="h-10 w-full" />
		</div>
	{:else}
		<div class="flex h-full flex-col justify-between md:justify-normal">
			<div>
				{@render gameHeader()}
				<div class="flex items-center justify-center gap-4 pb-8">
					<div class="flex w-full flex-col items-end justify-end">
						<div
							class="w-32 truncate overflow-x-hidden pb-2 text-center font-bold text-nowrap md:w-60"
						>
							{toPascalCase(pokemonOne.name)}
						</div>
						<img
							class="border-muted h-36 w-36 self-end rounded-md border-2 object-cover md:h-60 md:w-60"
							src={pokemonOne.sprites.front_default}
							alt={pokemonOne.name}
						/>
					</div>
					<div class="flex w-full flex-col">
						<div
							class="w-32 truncate overflow-x-hidden pb-2 text-center font-bold text-nowrap md:w-60"
						>
							{toPascalCase(pokemonTwo.name)}
						</div>
						<img
							class="border-muted h-36 w-36 self-start rounded-md border-2 object-cover md:h-60 md:w-60"
							src={pokemonTwo.sprites.front_default}
							alt={pokemonTwo.name}
						/>
					</div>
				</div>
				<div class="flex w-full items-center justify-center">
					<div
						class="flex w-full max-w-2xl flex-col items-center justify-center gap-2 pb-10 md:grid md:grid-cols-2 md:gap-6"
					>
						{#each moveChoices as move}
							{@const correctMove =
								move.name === selectedMove && correctAnswerSelected !== undefined}
							<div class="relative w-full">
								{#if hasChosenCorrectMove && selectedMove === move.name}
									<div class="absolute top-0 flex w-full items-center justify-center">
										<Confetti fallDistance={'50px'} />
									</div>
								{/if}

								<Button
									onclick={() => {
										chosenAnswer = move.name;
										if (selectedMove === move.name) {
											onCorrectMovedSelected();
										}
									}}
									variant={correctAnswerSelected === undefined
										? 'secondary'
										: correctMove
											? 'success'
											: 'destructive'}
									class="w-full  {hasChosenCorrectMove &&
										correctMove &&
										'animate-bounce'} {hasChosenCorrectMove === undefined && 'pointer-events-none'}"
									>{move.names.find((x) => x.language.name === locale)?.name ?? move.name}
								</Button>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div>
				<div>
					<div class="flex w-full items-center justify-center pb-4">
						<Button
							variant="default"
							class="relative w-[90%] bg-gradient-to-r  md:w-100"
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
