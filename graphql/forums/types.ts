import gql from 'graphql-tag';

export const forumTypes = gql`
  scalar DateTime
  ## Forum Model
  type ForumPost {
    id: String!
    title: String!
    content: String!
    user: User!
    training: Training!
    comments: [Comment]
    createdAt: DateTime
    updatedAt: DateTime
    _count: ForumPostCount
  }

  type ForumPostCount {
  comments: Int!
}

  type Comment {
    id: String!
    content: String!
    user: User!
    forumPost: ForumPost!
    createdAt: DateTime
    updatedAt: DateTime
  }

  input ForumPostFilterInput {
    sortBy: ForumPostSort
    onlyMyPosts: Boolean
  }

  enum ForumPostSort {
    NEWEST
    OLDEST
    MOST_POPULAR
    LEAST_POPULAR
  }

  ## Queries
  type Query {
    # Forum
    getForumPosts: [ForumPost]
    getForumPostById(id: String!): ForumPost
    getFilteredForumPosts(filter: ForumPostFilterInput): [ForumPost]
  }

  ## Mutations
  type Mutation {
    # Forum mutations
    createForumPost(
      title: String!
      content: String!
      userId: String!
      trainingId: String!
    ): ForumPost

    updateForumPost(id: String!, title: String, content: String): ForumPost

    deleteForumPost(id: String!): Boolean

    # Comment mutations
    createComment(
      content: String!
      userId: String!
      forumPostId: String!
    ): Comment

    deleteComment(id: String!): Boolean
  }
`;
