<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ThemeSwitch from './ThemeSwitch.svelte';
</script>

<header class="bg-nav border-b-nav-separator border-b shadow-lg">
	<div class="flex items-center p-2 py-3">
		<Button class="h-8 w-16" onclick={() => goto('/')}>Home</Button>
	</div>
</header>
