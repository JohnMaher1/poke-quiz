<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ThemeSwitch from './ThemeSwitch.svelte';
</script>

<header class="bg-primary shadow-xs">
	<div class="flex items-center p-2 py-4">
		<Button variant="outline" onclick={() => goto('/')}>Home</Button>

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
