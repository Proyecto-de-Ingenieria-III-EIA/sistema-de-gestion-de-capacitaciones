import { gql } from "@apollo/client";

export const GET_FORUM_POSTS = gql`
    query GetForumPosts {
        getForumPosts {
            id
            title
            content
            createdAt
            training {
                id
                title
            }
            user {
                name
            }
            comments {
                id
            }
        }
    }
`;

export const CREATE_FORUM_POST = gql`
    mutation CreateForumPost(
        $title: String!
        $content: String!
        $userId: String!
        $trainingId: String!
    ) {
        createForumPost(
            title: $title
            content: $content
            userId: $userId
            trainingId: $trainingId
        ) {
            id
            title
        }
    }
    `;

    export const CREATE_COMMENT = gql`
    mutation CreateComment($content: String!, $userId: String!, $forumPostId: String!) {
        createComment(content: $content, userId: $userId, forumPostId: $forumPostId) {
            id
            content
            createdAt
            user {
                id
                name
            }
        }
    }
`;

export const GET_FORUM_POST_BY_ID = gql`
  query GetForumPostById($id: String!) {
    getForumPostById(id: $id) {
      id
      title
      content
      createdAt
      training {
        id
        title
      }
      user {
        id
        name
      }
      comments {
        id
        content
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_FORUM_POST = gql`
  mutation DeleteForumPost($id: String!) {
    deleteForumPost(id: $id)
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;

export const GET_FORUM_POSTS_WITH_FILTER = gql`
  query GetFilteredForumPosts($filter: ForumPostFilterInput) {
    getFilteredForumPosts(filter: $filter) {
      id
      title
      content
      createdAt
      user {
        id
        name
      }
      training {
        title
      }
      _count {
        comments
      }
    }
  }
`;