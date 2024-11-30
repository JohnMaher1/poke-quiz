<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { navItems } from '../static-data/nav-items';
</script>

<h1 class="text-center text-4xl font-bold">Welcome to Poke-Quiz!</h1>
<div class="flex w-full items-center justify-center p-4 text-center">
	<img src="/poke_quiz_logo.jpg" alt="Poke-Quiz Logo" class="h-24 w-auto rounded-full" />
</div>
<p class="mb-12 text-center text-xl">
	Test your Pokémon knowledge with our exciting quizzes and puzzles!
</p>

<div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
	{#each navItems as item}
		<div
			class="flex flex-col justify-between rounded-lg p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-popover"
		>
			<h2 class="mb-4 flex items-center text-2xl font-semibold">
				<span class="mr-3 text-3xl">{item.icon}</span>
				{item.name}
			</h2>
			<p class="mb-4 text-muted-foreground">
				{item.description}
			</p>
			<Button class="w-40">Start Quiz</Button>
		</div>
	{/each}
</div>
