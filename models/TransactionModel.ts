import {Realm} from '@realm/react';
import ICategory from '../interfaces/ICategory';
import IPayee from '../interfaces/IPayee';
import ITransaction from '../interfaces/ITransaction';

class TransactionModel extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  amount!: number;
  payee!: IPayee;
  category!: ICategory;
  date!: string;

  static generate(
    amount: number,
    payee: IPayee,
    category: ICategory,
    date?: Date,
  ): ITransaction {
    return {
      _id: new Realm.BSON.ObjectId(),
      amount,
      payee,
      category,
      date: date || new Date(),
    };
  }

  static schema: Realm.ObjectSchema = {
    name: 'Transaction',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      amount: 'double',
      payee: 'Payee',
      category: 'Category',
      date: 'date',
    },
  };
}

export default TransactionModel;
