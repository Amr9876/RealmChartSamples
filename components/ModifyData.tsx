import {View, Dimensions} from 'react-native';
import React from 'react';
import {Button} from '@rneui/themed';
import DocumentPicker from 'react-native-document-picker';
import IResponseTransaction from '../interfaces/IResponseTransaction';
import TransactionModel from '../models/TransactionModel';
import PayeeModel from '../models/PayeeModel';
import CategoryModel from '../models/CategoryModel';
import RealmContext from '../RealmContext';
import ITransaction from '../interfaces/ITransaction';
import {useDispatch} from 'react-redux';
import {setTransactions} from '../store/transactionsSlice';

const ModifyData = () => {
  const {useRealm} = RealmContext;
  const realm = useRealm();
  const dispatch = useDispatch();

  const addOrReplaceData = (type: 'add' | 'replace') => {
    (async () => {
      try {
        const result = await DocumentPicker.pickSingle({
          type: ['application/json'],
        });

        const response = await fetch(result.uri);
        const data: IResponseTransaction[] = await response.json();

        if (type === 'add') {
          realm.write(() =>
            data.map(item =>
              realm.create(
                'Transaction',
                TransactionModel.generate(
                  item.amount,
                  PayeeModel.generate(item.payee),
                  CategoryModel.generate(item.category),
                  item.date,
                ),
              ),
            ),
          );

          const result = realm
            .objects<ITransaction>('Transaction')
            .map(item => ({
              _id: item._id,
              amount: item.amount,
              category: item.category,
              date: item.date,
              payee: item.payee,
            }));

          dispatch(setTransactions(result));
        } else {
          realm.write(() => {
            realm.delete(realm.objects('Transaction'));

            data.map(item =>
              realm.create(
                'Transaction',
                TransactionModel.generate(
                  item.amount,
                  PayeeModel.generate(item.payee),
                  CategoryModel.generate(item.category),
                  item.date,
                ),
              ),
            );
          });

          const result = realm
            .objects<ITransaction>('Transaction')
            .map(item => ({
              _id: item._id,
              amount: item.amount,
              category: item.category,
              date: item.date,
              payee: item.payee,
            }));

          dispatch(setTransactions(result));
        }
      } catch (error) {
        if (!DocumentPicker.isCancel(error)) {
          throw error;
        }
      }
    })();
  };

  return (
    <View
      style={{
        marginTop: 32,
        flexDirection: 'row',
      }}>
      <Button
        buttonStyle={{
          backgroundColor: 'darkgreen',
          borderRadius: 8,
          width: Dimensions.get('window').width / 2,
        }}
        containerStyle={{
          marginHorizontal: 10,
        }}
        titleStyle={{fontSize: 20}}
        onPress={() => addOrReplaceData('add')}>
        Add Data
      </Button>
      <Button
        buttonStyle={{
          backgroundColor: 'darkgreen',
          borderRadius: 8,
          width: Dimensions.get('window').width / 2 - 40,
        }}
        containerStyle={{
          marginHorizontal: 10,
        }}
        titleStyle={{fontSize: 18}}
        onPress={() => addOrReplaceData('replace')}>
        Replace Data
      </Button>
    </View>
  );
};

export default ModifyData;
