<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { navItems } from '../static-data/nav-items';
</script>

<div class="flex w-full justify-center">
	<h1 class="header-text-gradient text-center text-4xl font-bold">Poke-Quiz</h1>
</div>
<div class="flex w-full items-center justify-center p-4 text-center">
	<img src="/logo.webp" alt="Poke-Quiz Logo" class="h-24 w-auto rounded-full" />
</div>
<p class="mb-12 text-center text-xl">
	Test your Pokémon knowledge with some exciting quizzes and puzzles!
</p>

<div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
	{#each navItems as item}
		<div
			class="dark:bg-popover flex flex-col justify-between rounded-lg p-6 shadow-md transition-shadow hover:shadow-lg"
		>
			<h2 class="mb-4 flex items-center text-2xl font-semibold">
				<span class="mr-3 text-3xl">{item.icon}</span>
				{item.name}
			</h2>
			<p class="text-muted-foreground mb-4">
				{item.description}
			</p>
			<div class="flex items-center justify-between">
				{#if item.underConstruction}
					<p class="text-muted">Coming Soon!</p>
				{:else}
					<Button onclick={() => goto(item.link)} class="w-40" disabled={item.underConstruction}
						>Start Quiz</Button
					>
				{/if}
			</div>
		</div>
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
