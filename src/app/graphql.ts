import { Table, User, Link } from './types';
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
}

export const ALL_TABLES_QUERY = gql`
  query AllTablesQuery {
    allTables(orderBy: beerCount_DESC) {
      id
      name
      beerCount
      users {
        id
      }
    }
  }
`;


export interface AllTableQueryResponse {
  allTables: Table[];
  loading: boolean;
}

export const TABLE_QUERY = gql`
  query TableQuery($id: ID!){
    Table(
      id: $id
    ) {
      id
      name
      beerCount
      picture
      users {
        name
        avatarUrl
        beerCount
      }
    }
  }
`;

export interface TableQueryResponse {
  Table: Table;
  loading: boolean;
}

export const TABLE_QR_QUERY = gql`
  query TableQRQuery($qrID: String!){
    Table(
      qrID: $qrID
    ) {
      id
      name
      beerCount
      picture
      users {
        name
        avatarUrl
        beerCount
      }
    }
  }
`;

export interface TableQRQueryResponse {
  table: Table;
  loading: boolean;
}

export const CREATE_TABLE_MUTATION = gql`
  mutation CreateTableMutation($QRId: String!) {
    createTable(
      qrID: $QRId,
      beerCount: 0,
      picture: "https://voiceofpeopletoday.com/wp-content/uploads/2017/11/Beer-kills-the-liver-study.jpg"
    ) {
      id
      qrID
      createdAt
      beerCount
      picture
    }
  }
`;

export interface CreateTableMutationResponse {
  createTable: Table;
  loading: boolean;
}

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
}

export const JOIN_TABLE_MUTATION = gql`
  mutation JoinTableMutation($userId: ID!, $tableId: ID!) {
    addToUserTable (
      usersUserId: $userId,
      tableTableId: $tableId,
    )
    {
      usersUser {
        id
      },
      tableTable {
        id
        picture
        users {
          id
          name
          avatarUrl
          beerCount
        }
      }
    }
  }
`;

export interface JoinTableMutationResponse {
  table: Table;
  loading: boolean;
}

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($uid: String!, $name: String!, $avatarURL: String, $email: String!) {
    createUser(
      uid: $uid,
      name: $name,
      avatarUrl: $avatarURL,
      email: $email,
      beerCount : 0
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

export interface CreateUserMutationResponse {
  user: User;
  loading: boolean;
}

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
}

export const USER_TABLE_QUERY = gql`
  query UserTableQuery($id: ID!){
    User(
      id: $id
    ) {
      table{
        id,
        name,
        picture,
        beerCount,
        qrID,
        users{
          name,
          avatarUrl,
          beerCount
        }
      }
    }
  }
`;

export interface UserTableQueryResponse {
  user: User;
  loading: boolean;
}

export const UPDATE_BEERS_TABLE = gql`
  mutation updateBeers($id: ID!, $beerCount: Int!) {
    updateTable(
      id: $id,
      beerCount: $beerCount
    )
    {
      id
      beerCount
    }
  }
`;

export interface UpdateBeersTableResponse {
  updateTable: Table;
  loading: boolean;
}

export const NEW_TABLE_SUBSCRIPTION = gql`
  subscription {
    Table(filter: {
      mutation_in : [CREATED]
    }) {
      node {
        id
        name
        beerCount
        users {
          id
        }
      }
    }
  }
  `;

export interface NewTableSubscriptionResponse {
  node: Table;
}

export const UPDATE_TABLE_SUBSCRIPTION = gql`
  subscription {
    Table(filter: {
      mutation_in : [UPDATED]
    }) {
      node {
        id
        name
        beerCount
        users {
          id
        }
      }
    }
  }
`;

export interface UpdateTableSubscriptionResponse {
  node: Table;
}

export const UPDATE_USER_TABLE_SUBSCRIPTION = gql`
  subscription ($tableId: ID!){
    Table(filter: {
      node: {
        id: $tableId
      }
      mutation_in : [UPDATED]
    }) {
      node {
        id
        name
        beerCount
        picture
        users {
          id
          name
          beerCount
          avatarUrl
        }
      }
    }
  }
`;

export interface UpdateTableSubscriptionResponse {
  node: Table;
}


export const FAKE_UPDATE_TABLE_MUTATION = gql`
  mutation fakeUpdateTable($tableId: ID!, $dummy: String!) {
    updateTable(
      id: $tableId,
      dummy: $dummy
    )
    {
      id
    }
  }
`;

export interface FakeUpdateTableResponse {
  updateTable: Table;
  loading: boolean;
}