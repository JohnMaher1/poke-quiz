import type { GameHeader } from '../models/games.model';

export const navItems: GameHeader[] = [
	{
		name: 'Pokémon Trivia',
		icon: '🧠',
		description: 'Test your general knowledge about Pokémon.'
	},
	{
		name: "Who's That Pokémon?",
		icon: '👀',
		description: 'Identify the Pokémon from its silhouette.'
	},
	{
		name: 'Type Matchup Challenge',
		icon: '⚔️',
		description: 'Match Pokémon types to their strengths and weaknesses.'
	},
	{
		name: 'Pokédex Puzzle',
		icon: '📚',
		description: 'Solve puzzles related to the Pokédex entries.'
	},
	{
		name: 'Evolution Chain Quiz',
		icon: '🔗',
		description: 'Guess the Pokémon based on its evolution chain.'
	}
];
