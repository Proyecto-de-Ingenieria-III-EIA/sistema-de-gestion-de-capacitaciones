import { ForumPostList } from "../atomic-design/organisms/forum-postlist";
import { ForumSidebar } from "../atomic-design/organisms/forum-sidebar";
import { NewForumPostDialog } from "../atomic-design/organisms/new-forumpost-dialog";

export default function ForumPage() {
    return (
        <div className="flex gap-6 p-6">
            <aside className="w-1/4">
                <ForumSidebar/>
            </aside>

            <main className="flex-1">
                <div className="flex justify-between items-center mb-4">
                    <NewForumPostDialog  /> 
                    <div>
                        <button>Latest ▼</button>
                        <button className="ml-4">Mark all as read</button>
                    </div>
                </div>

                <ForumPostList />
            </main>
        </div>
    );
}