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
	import ThemeSwitch from '../components/ThemeSwitch.svelte';

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

<div class="flex h-screen">
	<!-- Sidebar for large screens -->
	<aside class="bg-secondary hidden w-64 flex-col shadow-2xl md:flex">
		<div class="flex items-center justify-center pt-8 font-bold">
			<h3>Poke-Quiz</h3>
		</div>
		<nav class="mt-6 flex-1">
			{#each navItems as item}
				<a
					href="#{item.name.toLowerCase().replace(/\s+/g, '-')}"
					class="text-foreground hover:bg-accent flex items-center px-4 py-2"
				>
					<span class="mr-3 text-xl">{item.icon}</span>
					{item.name}
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Main content -->
	<div class=" flex flex-1 flex-col overflow-hidden">
		<!-- Top navbar -->
		<header class="bg-card dark:bg-muted shadow-sm">
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
										class="flex items-center px-4 py-2"
									>
										<span class="mr-3 text-xl">{item.icon}</span>
										{item.name}
									</a>
								{/each}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
				<div class="flex items-center space-x-4">
					<div class="relative">
						<Search
							class="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform"
						/>
						<Input type="search" placeholder="Search quizzes..." class="w-64 py-2 pl-10 pr-4" />
					</div>
					<div>
						<ThemeSwitch />
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage class="dark:bg-card" alt="User" />
								<AvatarFallback class="dark:bg-card">U</AvatarFallback>
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
		<main class="bg-background flex-1 overflow-y-auto p-6">
			<h1 class="text-center text-4xl font-bold">Welcome to Poke-Quiz!</h1>
			<div class="flex w-full items-center justify-center p-4 text-center">
				<img src="/poke_quiz_logo.jpg" alt="Poke-Quiz Logo" class="h-24 w-auto rounded-full" />
			</div>
			<p class="mb-12 text-center text-xl">
				Test your Pokémon knowledge with our exciting quizzes and puzzles!
			</p>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each navItems as item}
					<div
						class="dark:bg-popover flex flex-col justify-between rounded-lg p-6 shadow-md transition-shadow hover:shadow-lg"
					>
						<h2 class="mb-4 flex items-center text-2xl font-semibold">
							<span class="mr-3 text-3xl">{item.icon}</span>
							{item.name}
						</h2>
						<p class="text-muted-foreground mb-4">
							Challenge yourself with our {item.name.toLowerCase()} and become a Pokémon Master!
						</p>
						<Button class="w-40">Start Quiz</Button>
					</div>
				{/each}
			</div>
		</main>

		<!-- Footer -->
		<footer class="bg-muted mt-auto shadow-md">
			<div class="container mx-auto px-6 py-4">
				<p class="text-center">© 2024 Poke-Quiz. All rights reserved.</p>
			</div>
		</footer>
	</div>
</div>
