import {Realm} from '@realm/react';

interface IPayee {
  _id: Realm.BSON.ObjectId;
  name: string;
}

export default IPayee;
