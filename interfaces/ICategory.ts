import {Realm} from '@realm/react';

interface ICategory {
  _id: Realm.BSON.ObjectId;
  name: string;
}

export default ICategory;
