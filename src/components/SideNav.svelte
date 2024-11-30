<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { navItems } from '../static-data/nav-items';
</script>

<!-- Sidebar for large screens -->
<aside class="hidden w-64 flex-col bg-secondary shadow-2xl md:flex">
	<div class="flex items-center justify-center pb-[15px] pt-8 font-bold">
		<h3>Poke-Quiz</h3>
	</div>
	<Separator class="w-32 self-center" />
	<nav class="mt-4 flex-1">
		{#each navItems as item}
			<a
				href="#{item.name.toLowerCase().replace(/\s+/g, '-')}"
				class="flex items-center px-4 py-2 text-foreground hover:bg-accent"
			>
				<span class="mr-3 text-xl">{item.icon}</span>
				{item.name}
			</a>
		{/each}
	</nav>
</aside>
