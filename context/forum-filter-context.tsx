import  { createContext, useContext, useState } from "react";


export type ForumPostFilter = {
    sortBy: "NEWEST" | "OLDEST" | "MOST_POPULAR" | "LEAST_POPULAR" | undefined;
    onlyMyPosts: boolean;
}

const ForumFilterContext = createContext<{
    filter: ForumPostFilter;
    setFilter: React.Dispatch<React.SetStateAction<ForumPostFilter>>;
} | null>(null);

export function ForumFilterProvider({ children }: { children: React.ReactNode }) {
    const [filter, setFilter] = useState<ForumPostFilter>({
        sortBy: "NEWEST",
        onlyMyPosts: false,
    });

    return (
        <ForumFilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </ForumFilterContext.Provider>
    );
}

export function useForumFilter() {
    const context = useContext(ForumFilterContext);
    if (!context) {
        if (typeof window !== "undefined") {
          console.error("❌ useForumFilter debe usarse dentro del ForumFilterProvider");
        }
        throw new Error("useForumFilter must be used within a ForumFilterProvider");
    }
    return context;
}