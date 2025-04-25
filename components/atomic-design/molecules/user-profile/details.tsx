import { Button } from "@/components/ui/button";
import { UPDATE_USER } from "@/graphql/frontend/users";
import { useMutation } from "@apollo/client";
import { CalendarIcon, Contact2Icon, MailIcon, PhoneIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";


type Props = {
    isEditing: boolean;
  };

export default function UserProfileDetails({ isEditing }: Props) {

    const {data: session} = useSession();
    const userId = session?.user?.id;

    const [name, setName] = useState(session?.user?.name ?? "");
    const [phone, setPhone] = useState(session?.user?.phone ?? "");

    const [updateUser] = useMutation(UPDATE_USER);

    const handleSave = async () => {
        if (!userId) return;

        try {
            await updateUser({
                variables: {
                    id: userId,
                    phone,
                },
            });
            alert("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    return (
        <div className="grid grid-cols-1 gap-3 py-6 text-sm">
            {isEditing ? (
                <div className="flex items-center space-x-4 mb-2">
                    <span className="w-16 text-muted-foreground font-medium">Name</span>
                    <Contact2Icon className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="name"
                        className="border rounded px-2 py-1 w-full max-w-xs"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                ) : (
                    <></>
            )}
            
            <div className="flex items-center space-x-4 mb-2">
                <span className="w-16 text-muted-foreground font-medium">Email</span>
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <span>{session?.user?.email}</span>
                
            </div>

            <div className="flex items-center space-x-4 mb-2">
                <span className="w-16 text-muted-foreground font-medium">Phone</span>
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                    <input
                        type="tel"
                        className="border rounded px-2 py-1 w-full max-w-xs"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                ) : (
                    <span>{session?.user?.phone || "Not registered"}</span>
                )}
            </div>
            <div className="flex items-center space-x-4 mb-2">
                <span className="w-16 text-muted-foreground font-medium">Joined</span>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                    {session?.user?.createdAt
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(session.user.createdAt))
                    : "N/A"}
                </span>
            </div>

            {isEditing && (
                <div className="pt-2">
                    <Button onClick={handleSave}>Save changes</Button>
                </div>
            )}
        </div>
    );
}