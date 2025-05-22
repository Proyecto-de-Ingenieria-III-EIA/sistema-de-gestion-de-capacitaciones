import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";


export function UserAvatar() {
    const { data: session } = useSession();

    const name = session?.user?.name ?? "User";
    const image  = session?.user?.image ?? "https://github.com/shadcn.png";
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <Avatar>
            <AvatarImage src={image} alt={name}/>
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    )
}