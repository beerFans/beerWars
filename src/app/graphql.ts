import { Table, User, Waiter, Link } from './types';


import gql from 'graphql-tag';


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
};

export const ALL_TABLES_QUERY = gql`
  query AllTablesQuery {
    allTables {
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
};

export const TABLE_QR_QUERY = gql`
  query TableQRQuery($qrID: String!){
    Table(
      qrID: $qrID
    ) {
      id
      name
      beerCount
      users {
        name
      }
    }
  }
`;


export interface TableQRQueryResponse {
  table: Table;
  loading: boolean;
};


export const CREATE_TABLE_MUTATION = gql`
  mutation CreateTableMutation($QRId: String!) {
    createTable(
      qrID: $QRId,
    ) {
      id
      createdAt
    }
  }
`;

export interface CreateTableMutationResponse {
  createTable: Table;
  loading: boolean;
};

export const CREATE_QR_MUTATION = gql`
  mutation CreateQRMutation {
    createQR
    {
      id
    }
  }
`;

export interface CreateQRMutationResponse {
  createTable: Table;
  loading: boolean;
};
