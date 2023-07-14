import {Realm} from '@realm/react';
import ICategory from './ICategory';
import IPayee from './IPayee';

interface ITransaction {
  _id: Realm.BSON.ObjectId;
  amount: number;
  payee: IPayee;
  category: ICategory;
  date: Date;
}

export default ITransaction;
