export interface ForumPostCardProps {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string; 
    training: string;
    commentsCount?: number;
    showActions?: boolean;
    isAdmin?: boolean;
    filter?: any;
  }

export type FormValues = {
  title: string;
  content: string;
};