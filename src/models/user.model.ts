//import { alias } from '../decorators/alias.decorator';

import { ModelFactory } from './model-factory.model';
//import { UserStatus } from './user-status.model';

export class User extends ModelFactory {
  id: number;
  uid: string;
  name: string;
  avatarUrl: string;
  beerCount:number;
  email: string;
  
  constructor(args: any = null) {
     super(args);
  //   if (this.status === undefined || this.status === null) {
  //     this.status = UserStatus.INICIAL;
  //   }
  }
}
