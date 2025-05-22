import { useForumFilter } from "@/context/forum-filter-context";
import { ForumPostList } from "../atomic-design/organisms/forum-postlist";
import { ForumAppSidebar } from "../atomic-design/organisms/forum-sidebar/forum-sidebar";
import { ForumSidebar } from "../atomic-design/organisms/forum-sidebar2";
import { NewForumPostDialog } from "../atomic-design/organisms/new-forumpost-dialog";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { GET_FORUM_POSTS_WITH_FILTER } from "@/graphql/frontend/forum";

export default function ForumPage() {

    const { filter } = useForumFilter();
    const { data: session } = useSession();

    console.log("📦 Filtro actual:", filter);

    const { data, loading, error } = useQuery(GET_FORUM_POSTS_WITH_FILTER, {
        variables: { filter }
    });

    

    return (
        <div className="flex gap-6 p-6">
            <SidebarProvider>
                <ForumAppSidebar />

            <SidebarInset>
                <main className="flex-1 mt-8 mr-8">
                    <div className="flex justify-between items-center mb-4">
                        <SidebarTrigger className="-ml-1" />
                        <NewForumPostDialog  /> 
                    </div>

                    {loading && <p className="text-center">Loading posts...</p>}
                    {error && (
                      <pre className="text-red-500 whitespace-pre-wrap">
                        {JSON.stringify(error, null, 2)}
                      </pre>
                    )}

                    <ForumPostList 
                        filter={filter}
                        isAdmin={session?.user.roleName === "ADMIN"}
                    />
                </main>
            </SidebarInset>
            </SidebarProvider>
        </div>
    );
}