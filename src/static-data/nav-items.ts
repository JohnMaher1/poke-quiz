import type { GameHeader } from '../models/games.model';

export const navItems: GameHeader[] = [
	{
		name: 'Pokémon Move Matcher',
		icon: '⚒️',
		description: 'Find the common move between two Pokémon.',
		link: '/games/move-matcher',
		underConstruction: false
	},
	{
		name: 'Pokémon Trivia',
		icon: '🧠',
		description: 'Test your general knowledge about Pokémon.',
		link: '/games/trivia',
		underConstruction: true
	},
	{
		name: 'Pokédex Puzzle',
		icon: '📚',
		description: 'Solve puzzles related to the Pokédex entries.',
		link: '/games/pokedex-puzzle',
		underConstruction: true
	}
];
