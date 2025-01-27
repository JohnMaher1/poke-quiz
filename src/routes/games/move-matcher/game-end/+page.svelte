<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	let data = $page.state as { score: number; totalQuestions: number };
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<div class="flex w-full justify-center">
		<div class="header-text-gradient text-center text-2xl font-bold">Game Over!</div>
	</div>
	<p class="text-center text-xl">
		You scored {data.score} out of {data.totalQuestions}!
	</p>

	<Button class="w-[90%] lg:w-80" onclick={() => goto('/games/move-matcher')}>Play Again</Button>
	<Button class="w-[90%] lg:w-80" onclick={() => goto('/')}>Back Home</Button>
</div>
