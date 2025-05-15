import { ForumPostList } from "../atomic-design/organisms/forum-postlist";
import { ForumAppSidebar } from "../atomic-design/organisms/forum-sidebar/forum-sidebar";
import { ForumSidebar } from "../atomic-design/organisms/forum-sidebar2";
import { NewForumPostDialog } from "../atomic-design/organisms/new-forumpost-dialog";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

export default function ForumPage() {
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

                    <ForumPostList />
                </main>
            </SidebarInset>
            </SidebarProvider>
        </div>
    );
}