import PayeeModel from './models/PayeeModel';
import {createRealmContext} from '@realm/react';
import {Realm} from '@realm/react';
import CategoryModel from './models/CategoryModel';
import TransactionModel from './models/TransactionModel';

const config: Realm.Configuration = {
  schema: [PayeeModel, CategoryModel, TransactionModel],
  deleteRealmIfMigrationNeeded: true,
};

export default createRealmContext(config);
