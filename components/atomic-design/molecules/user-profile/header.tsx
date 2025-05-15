import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import { UserAvatar } from "../../atoms/user-avatar";

type Props = {
    onEditClick: () => void;
};

export default function UserProfileHeader({ onEditClick }: Props) {

    const {data: session} = useSession();

    if(!session) return null


    return (
        <div className="mb-6">
            <>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <UserAvatar />
                        <div>
                            <h2 className="text-xl font-semibold">{session.user?.name}</h2>
                            <p className="text-sm text-muted-foreground">Area: {session.user?.area}</p>
                        </div>
                    </div>
                    <Badge variant="secondary">{session.user?.roleName}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mt-4">
                    <Button variant="default">Send Message</Button>
                    <Button variant="outline" onClick={onEditClick}>Edit</Button>
                    <Button variant="outline">Share</Button>
                    <Button variant="destructive">Delete</Button>
                </div>
            </>
        </div>
    )
}