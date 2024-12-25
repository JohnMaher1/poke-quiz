export const pokeApiEndpoint = 'https://pokeapi.co/api/v2/';

export const fetchData = async <T>(url: string) => {
	const result = await fetch(`${pokeApiEndpoint}${url}`);
	const json = (await result.json()) as T;
	return json;
};
