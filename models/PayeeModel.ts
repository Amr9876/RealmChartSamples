import {Realm} from '@realm/react';
import IPayee from '../interfaces/IPayee';

class PayeeModel extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;

  static generate(name: string): IPayee {
    return {
      _id: new Realm.BSON.ObjectId(),
      name,
    };
  }

  static schema: Realm.ObjectSchema = {
    name: 'Payee',
    properties: {
      _id: 'objectId',
      name: 'string',
    },
    primaryKey: '_id',
  };
}

export default PayeeModel;
