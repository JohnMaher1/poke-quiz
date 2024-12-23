<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ThemeSwitch from './ThemeSwitch.svelte';
</script>

<header class="bg-card shadow-xs">
	<div class="flex items-center p-4">
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger
					><button
						class="flex cursor-pointer items-center justify-center pr-2 text-center hover:brightness-125"
						onclick={() => goto('/')}
					>
						<img src="/logo.webp" alt="Poke-Quiz Logo" class="h-12 w-auto rounded-full" />
					</button></Tooltip.Trigger
				>
				<Tooltip.Content>
					<p>Home</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>

		<div class="flex w-full justify-end space-x-4">
			<div>
				<!-- TODO: Add back in once light theme supported -->
				<!-- <ThemeSwitch /> -->
			</div>
			<!-- TODO: Add user login and other things -->
			<!-- <DropdownMenu>
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
			</DropdownMenu> -->
		</div>
	</div>
</header>
