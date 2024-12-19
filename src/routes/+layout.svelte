<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<div class="flex h-screen">
		<div class=" flex flex-1 flex-col overflow-hidden">
			<Navbar />
			<main class="flex-1 overflow-y-auto bg-background p-6">
				{@render children()}
			</main>
			<Footer />
		</div>
	</div>

	<ModeWatcher />
</ParaglideJS>
