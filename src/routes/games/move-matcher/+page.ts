import { fetchData } from '$lib/http/pokemon-api-service.svelte.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery({
		queryKey: ['moves'],
		queryFn: () => fetchData<{ results: { name: string; url: string }[] }>('move?limit=1000')
	});
};
