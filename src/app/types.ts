export class Link {
  id?: string;
  description?: string;
  url?: string;
  createdAt?: string;
  postedBy?: User;
}

export class User {
  id?: string;
  uid?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  beerCount? : number;
  table? : Table;
}

export class Table {
  id?: string;
  name?: string;
  picture?: string;
  beerCount?: number;
  qrID?: string;
  waiter?: Waiter;
  users?: User[];
  dummy?: string;
  numero?: number;
}

export class WinnerTable {
  id?: string;
  name?: string;
  picture?: string;
  beerCount?: number;
  users?: User[];
  createdAt? : Date;
}

export class Waiter {
  id?: string;
  name?: string;
  avatarUrl?: string;

  tables: Table[];
}
