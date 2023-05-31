import {Realm} from '@realm/react';
import ICategory from '../interfaces/ICategory';

class CategoryModel extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;

  static generate(name: string): ICategory {
    return {
      _id: new Realm.BSON.ObjectId(),
      name,
    };
  }

  static schema: Realm.ObjectSchema = {
    name: 'Category',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
    },
  };
}

export default CategoryModel;
