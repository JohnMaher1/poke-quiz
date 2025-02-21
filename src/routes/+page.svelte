<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { navItems } from '../static-data/nav-items';
</script>

<div class="flex w-full justify-center pb-8">
	<h1 class="text-primary text-4xl font-bold">Poke-Quiz</h1>
</div>
<p class="mb-12 text-center text-lg">
	Test your Pokémon knowledge with some exciting quizzes and puzzles!
</p>

<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-3">
	{#each navItems as item}
		<Card.Root class="flex h-full flex-col pb-4">
			<Card.Header class=" flex flex-row items-center text-2xl font-semibold">
				<span class="mr-3 text-3xl">{item.icon}</span>
				{item.name}
			</Card.Header>
			<Card.Content class="flex h-full flex-col justify-between p-4 pb-0">
				<p class="text-muted-foreground pb-4">
					{item.description}
				</p>
				<div class="flex items-end">
					{#if item.underConstruction}
						<Button onclick={() => goto(item.link)} class="w-40" disabled={item.underConstruction}
							>Coming Soon...</Button
						>
					{:else}
						<Button onclick={() => goto(item.link)} class="w-40" disabled={item.underConstruction}
							>Start Quiz</Button
						>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>

<style>
	.header-text-gradient {
		background: linear-gradient(to right, #7aa1d3, #e684ae, #7aa1d3, #e684ae);
		background-clip: text;
		-webkit-text-fill-color: transparent;
		background-size: 500% auto;
		animation: textShine 5s ease-in-out infinite alternate;
	}

	@keyframes textShine {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 100% 50%;
		}
	}
</style>
