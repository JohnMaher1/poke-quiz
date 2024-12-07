<script lang="ts">
	import { goto } from '$app/navigation';
	import { Separator } from '$lib/components/ui/separator';
	import { navItems } from '../static-data/nav-items';
</script>

<!-- Sidebar for large screens -->
<aside class="hidden w-64 flex-col bg-secondary shadow-2xl md:flex">
	<div class="flex items-center justify-center pb-4 pt-7 font-bold">
		<button onclick={() => goto('/')} class="w-full hover:brightness-90">Poke-Quiz</button>
	</div>
	<Separator class="w-32 self-center" />
	<nav class="mt-4 flex-1">
		{#each navItems as item}
			<button
				onclick={() => goto(item.link)}
				class="flex w-full items-center px-4 py-2 text-foreground hover:bg-accent {item.underConstruction &&
					'pointer-events-none opacity-50'}"
			>
				<span class="mr-3 text-xl">{item.icon}</span>
				{item.name}
			</button>
		{/each}
	</nav>
</aside>
