import {View} from 'react-native';
import {Tab, TabView, Button} from '@rneui/themed';
import RealmContext from '../RealmContext';
import ITransaction from '../interfaces/ITransaction';
import {useState, useEffect} from 'react';
import CustomBarChart from './charts/CustomBarChart';
import CustomLineChart from './charts/CustomLineChart';
import CustomPieChart from './charts/CustomPieChart';
import {useSelector, useDispatch} from 'react-redux';
import {
  getTransactionsState,
  setTransactions,
} from '../store/transactionsSlice';
import useChartData from '../hooks/useChartData';
import dataTransactions from '../data.json';
import TransactionModel from '../models/TransactionModel';
import PayeeModel from '../models/PayeeModel';
import CategoryModel from '../models/CategoryModel';
import {parse} from 'date-fns';

const Chart = () => {
  const [index, setIndex] = useState(0);

  const {useQuery, useRealm} = RealmContext;
  const {transactions} = useSelector(getTransactionsState);
  const {data, labels, pieData} = useChartData();
  const realmTransactions = useQuery<ITransaction>('Transaction');
  const dispatch = useDispatch();
  const realm = useRealm();

  useEffect(() => {
    if (realmTransactions.length > 0) return;

    realm.write(() => {
      realm.delete(realm.objects('Transaction'));

      dataTransactions.map(item =>
        realm.create(
          'Transaction',
          TransactionModel.generate(
            item.amount,
            PayeeModel.generate(item.payee),
            CategoryModel.generate(item.category),
            parse(item.date, 'd/M/yyyy', new Date()),
          ),
        ),
      );
    });
  }, []);

  useEffect(() => {
    if (transactions.length > 0) return;

    const result = realmTransactions.map(item => ({
      _id: item._id,
      amount: item.amount,
      category: item.category,
      date: item.date,
      payee: item.payee,
    }));

    if (result.length > 0) {
      dispatch(setTransactions(result));
    }
  }, [realmTransactions]);

  if (!(transactions.length > 0)) return <View></View>;

  return (
    <>
      <View>
        <Tab
          value={index}
          onChange={setIndex}
          indicatorStyle={{backgroundColor: '#eee', height: 3}}
          containerStyle={{backgroundColor: '#222'}}>
          <Tab.Item title="Bar" titleStyle={{fontSize: 24, color: '#eee'}} />
          <Tab.Item title="Line" titleStyle={{fontSize: 24, color: '#eee'}} />
          <Tab.Item title="Pie" titleStyle={{fontSize: 24, color: '#eee'}} />
        </Tab>

        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item
            style={{
              width: '100%',
              backgroundColor: '#222',
              paddingVertical: 40,
            }}>
            <CustomBarChart data={data} labels={labels} />
          </TabView.Item>
          <TabView.Item
            style={{
              width: '100%',
              backgroundColor: '#222',
              paddingVertical: 40,
            }}>
            <CustomLineChart data={data} labels={labels} />
          </TabView.Item>
          <TabView.Item
            style={{
              width: '100%',
              backgroundColor: '#222',
              paddingVertical: 40,
            }}>
            <CustomPieChart pieData={pieData} />
          </TabView.Item>
        </TabView>
      </View>
    </>
  );
};

export default Chart;
