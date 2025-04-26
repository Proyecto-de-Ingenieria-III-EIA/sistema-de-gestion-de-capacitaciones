import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import router from "next/router"

export function NavUser () {

    const { data: session } = useSession()
    const { isMobile } = useSidebar()
    return (
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage 
                            src={session?.user?.image || '/default-avatar.png'} 
                            alt={session?.user?.name || 'User Avatar'}
                        />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{session?.user?.name}</span>
                        <span className="truncate text-xs">{session?.user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src={session?.user?.image || '/default-avatar.png'} 
                                alt={session?.user?.name || 'User Avatar'}
                            />
                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{session?.user?.name}</span>
                            <span className="truncate text-xs">{session?.user?.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push(`/profile/user?id=${session?.user?.id}`)}>
                    <Sparkles />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                onClick={async () => {
                    try {
                    const session = await fetch('/api/auth/session').then((res) => res.json());

                    if (!session) {
                        console.warn('No active session found. Redirecting to logout page.');
                        router.push('/logout');
                        return;
                    }

                    router.push('/logout');
                    } catch (error) {
                    console.error('Error during logout:', error);
                    router.push('/logout');
                    }
                }}
                >
                <LogOut />
                Log out
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}