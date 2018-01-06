export class Link {
  id?: string;
  description?: string;
  url?: string;
  createdAt?: string;
  postedBy?: User;
  votes?: Vote[];
}

export class User {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  beerCount? : Int;
  table? : Table;

}

export class Table {
  id?: string;
  name?: string;
  picture?: string;
  beerCount?: Int;
  qrID?: string;
  waiter?: Waiter;
  users?: User[];

}

export class Waiter {
  id?: string;
  name?: string;
  avatarUrl?: string;

  tables: Table[];
}
