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
  }

  type Comment {
    id: String!
    content: String!
    user: User!
    forumPost: ForumPost!
    createdAt: DateTime
    updatedAt: DateTime
  }

  ## Queries
  type Query {
    # Forum
    getForumPosts: [ForumPost]
    getForumPostById(id: String!): ForumPost
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
