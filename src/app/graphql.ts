import {Table, User, Waiter, Link} from './types';


import gql from 'graphql-tag'


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


export interface AllLinkQueryResponse {
  allLinks: Link[];
  loading: boolean;
}

export const ALL_TABLES_QUERY = gql`
  query AllTablesQuery {
    allLinks {
      id
      createdAt
      name
      beerCount
      users
    }
  }
`;


export interface AllTableQueryResponse {
  allTables: Table[];
  loading: boolean;
}


export const CREATE_TABLE_MUTATION = gql`
  mutation CreateTableMutation($name: String!, $QRId: String!) {
    createTable(
      name: $name,
      qrID: $QRId,
    ) {
      id
      createdAt
      name
    }
  }
`;

export interface CreateTableMutationResponse {
  createTable: Table;
  loading: boolean;
}
