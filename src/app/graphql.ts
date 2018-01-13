import {Link, User} from './types';
// 1
import gql from 'graphql-tag'

// 2
export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery {
    allLinks {
      id
      createdAt
      url
      description
    }
  }
`;

// 3
export interface AllLinkQueryResponse {
  allLinks: Link[];
  loading: boolean;
}

// 1
export const CREATE_LINK_MUTATION = gql`
  # 2
  mutation CreateLinkMutation($description: String!, $url: String!) {
    createLink(
      description: $description,
      url: $url,
    ) {
      id
      createdAt
      url
      description
    }
  }
`;

//3
export interface CreateLinkMutationResponse {
  createLink: Link;
  loading: boolean;
};

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($uid: String!, $name: String!, $avatarURL: String, $email: String!) {
    createUser(
      uid: $uid,
      name: $name,
      avatarUrl: $avatarURL,
      email: $email,
      beerCount:0,
    ) {
      id,
      uid,
      name,
      avatarUrl,
      beerCount,
      email,
    }
  }
`;

export interface CreateUserMutationResponse {
  user: User;
  loading: boolean;
};

export const USER_UID_QUERY = gql`
  query UserUidQuery($uid: String!){
    User(
      uid: $uid
    ) {
      id,
      uid,
      name,
      avatarUrl,
      beerCount,
      email
    }
  }
`;


export interface UserUidQueryResponse {
  user: User;
  loading: boolean;
};