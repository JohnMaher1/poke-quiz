<script lang="ts">
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
	import { LogOut, Menu, Settings, User } from 'lucide-svelte';
	import { navItems } from '../static-data/nav-items';
	import ThemeSwitch from './ThemeSwitch.svelte';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
</script>

<header class="bg-card shadow-sm dark:bg-muted">
	<div class="flex items-center justify-between p-4">
		<div class="flex items-center">
			<Sheet>
				<SheetTrigger class="md:hidden">
					<Menu class="h-6 w-6" />
				</SheetTrigger>
				<SheetContent side="left">
					<SheetHeader>
						<SheetTitle class="text-start">Poke-Quiz Menu</SheetTitle>
						<SheetDescription class="text-start">Choose your Pokémon challenge!</SheetDescription>
					</SheetHeader>
					<nav class="mt-6">
						{#each navItems as item}
							<a
								href="#{item.name.toLowerCase().replace(/\s+/g, '-')}"
								class="flex items-center py-2"
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
