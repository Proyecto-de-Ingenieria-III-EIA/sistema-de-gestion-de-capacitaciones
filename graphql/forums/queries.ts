import { Context } from '@/types';
import { Prisma } from '@prisma/client';

export const queries = {
  // Forum queries
  getForumPosts: async (_: unknown, __: unknown, { db }: Context) => 
    db.forumPost.findMany({
      include: {
        user: {
          select: {id: true, name: true},
        },
        comments: {
          select: { id: true },
        },
        training: {
          select: { id: true, title: true },
        },
      }
    }),

  getForumPostById: async (_: unknown, args: { id: string }, { db }: Context) =>
    db.forumPost.findUnique({ 
      where: { id: args.id }, 
      include: {
        user: {
          select: { id: true, name: true },
        },
        training: {
          select: { id: true, title: true },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: { id: true, name: true },
            },
          }
        }
      }
    }),

  getFilteredForumPosts: async (
    _: unknown,
    args: { filter? : { sortBy?: string, onlyMyPosts?: boolean } },
    { db, authData } : Context
  ) => {
    const { sortBy, onlyMyPosts } = args.filter || {};

    const orderBy = 
      sortBy === 'OLDEST'
        ? { createdAt: Prisma.SortOrder.asc }
        : sortBy === 'NEWEST'
        ? { createdAt: Prisma.SortOrder.desc }
        : undefined;


    const where = {
      isActive: true,
      ...(onlyMyPosts && { userId: authData?.id})
    };

    const posts = await db.forumPost.findMany({
      where,
      orderBy,
      include: {
        user: true,
        training: true,
        comments: true,
        _count: { select: { comments: true } },
      }
    });

    if (sortBy === 'MOST_POPULAR') {
      posts.sort((a, b) => b._count.comments - a._count.comments);
    } else if (sortBy === 'LEAST_POPULAR') {
      posts.sort((a, b) => a._count.comments - b._count.comments);
    }

    console.log(args)

    return posts;
  }
};
