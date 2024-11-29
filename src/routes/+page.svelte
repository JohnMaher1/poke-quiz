<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { Search, Menu, User, LogOut, Settings } from 'lucide-svelte';

	let isOpen = $state(false);

	const navItems = [
		{ name: 'Pokémon Trivia', icon: '🧠' },
		{ name: "Who's That Pokémon?", icon: '👀' },
		{ name: 'Type Matchup Challenge', icon: '⚔️' },
		{ name: 'Pokédex Puzzle', icon: '📚' },
		{ name: 'Evolution Chain Quiz', icon: '🔗' }
	];

	function toggleSidebar() {
		isOpen = !isOpen;
	}
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar for large screens -->
	<aside class="hidden w-64 flex-col bg-white shadow-lg md:flex">
		<div class="p-4">
			<img src="/images/logo.png" alt="Poke-Quiz Logo" class="h-12 w-auto" />
		</div>
		<nav class="mt-6 flex-1">
			{#each navItems as item}
				<a
					href="#{item.name.toLowerCase().replace(/\s+/g, '-')}"
					class="flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-100"
				>
					<span class="mr-3 text-xl">{item.icon}</span>
					{item.name}
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Main content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top navbar -->
		<header class="bg-white shadow-sm">
			<div class="flex items-center justify-between p-4">
				<div class="flex items-center">
					<Sheet>
						<SheetTrigger class="md:hidden">
							<Menu class="h-6 w-6" />
						</SheetTrigger>
						<SheetContent side="left">
							<SheetHeader>
								<SheetTitle>Poke-Quiz Menu</SheetTitle>
								<SheetDescription>Choose your Pokémon challenge!</SheetDescription>
							</SheetHeader>
							<nav class="mt-6">
								{#each navItems as item}
									<a
										href="#{item.name.toLowerCase().replace(/\s+/g, '-')}"
										class="flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-100"
									>
										<span class="mr-3 text-xl">{item.icon}</span>
										{item.name}
									</a>
								{/each}
							</nav>
						</SheetContent>
					</Sheet>
					<img src="/images/logo.png" alt="Poke-Quiz Logo" class="ml-4 h-8 w-auto md:hidden" />
				</div>
				<div class="flex items-center space-x-4">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
						<Input type="search" placeholder="Search quizzes..." class="w-64 py-2 pl-10 pr-4" />
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage src="/images/user.png" alt="User" />
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User class="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings class="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem>
								<LogOut class="mr-2 h-4 w-4" />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>

		<!-- Main content area -->
		<main class="flex-1 overflow-y-auto bg-gray-100 p-6">
			<h1 class="mb-8 text-center text-4xl font-bold">Welcome to Poke-Quiz!</h1>
			<p class="mb-12 text-center text-xl">
				Test your Pokémon knowledge with our exciting quizzes and puzzles!
			</p>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each navItems as item}
					<div class="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
						<h2 class="mb-4 flex items-center text-2xl font-semibold">
							<span class="mr-3 text-3xl">{item.icon}</span>
							{item.name}
						</h2>
						<p class="mb-4 text-gray-600">
							Challenge yourself with our {item.name.toLowerCase()} and become a Pokémon Master!
						</p>
						<Button>Start Quiz</Button>
					</div>
				{/each}
			</div>
		</main>

		<!-- Footer -->
		<footer class="mt-auto bg-white shadow-md">
			<div class="container mx-auto px-6 py-4">
				<p class="text-center text-gray-600">© 2023 Poke-Quiz. All rights reserved.</p>
			</div>
		</footer>
	</div>
</div>
