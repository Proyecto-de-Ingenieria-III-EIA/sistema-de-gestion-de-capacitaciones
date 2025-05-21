
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
  training: {
    title: string;
  };
  _count: {
    comments: number;
  };
}
