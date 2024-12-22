<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Navbar from '../components/Navbar.svelte';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
	let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
	<ParaglideJS {i18n}>
		<div class="flex h-screen">
			<div class=" flex flex-1 flex-col overflow-hidden">
				<Navbar />
				<main class="bg-background flex-1 overflow-y-auto p-6">
					{@render children()}
				</main>
				<!-- <Footer /> -->
			</div>
		</div>

		<ModeWatcher />
	</ParaglideJS>
</QueryClientProvider>
