import type {Dispatch, SetStateAction} from 'react';
import {View} from 'react-native';
import {Tab, TabView} from '@rneui/themed';
import RealmContext from '../RealmContext';
import ITransaction from '../interfaces/ITransaction';
import {LineChart, BarChart, PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {AbstractChartConfig} from 'react-native-chart-kit/dist/AbstractChart';
import {useState, useEffect} from 'react';
import _ from 'lodash';
import {getRandomColor, sortDates} from '../utils';

const chartConfig: AbstractChartConfig = {
  backgroundGradientFrom: '#222',
  backgroundGradientTo: '#222',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  fillShadowGradientFrom: '#0A0',
  fillShadowGradientTo: '#0F0',
  barPercentage: 0.5,
  decimalPlaces: 0,
  strokeWidth: 4,
  propsForDots: {
    r: '3',
    strokeWidth: '1',
    strokeOpacity: 0,
  },
};

type ChartProps = {
  transactions: ITransaction[];
  type: 'category' | 'payee' | 'date';
};

const checkOverlap = (labels: string[]) => {
  const labelWidth = 50; // width of each label
  const chartWidth = Dimensions.get('window').width * 0.1; // width of chart
  const numLabels = labels.length;
  const totalLabelWidth = numLabels * labelWidth;
  return totalLabelWidth > chartWidth;
};

const CustomLineChart = ({transactions, type}: ChartProps) => {
  const [rotationAngle, setRotationAngle] = useState(0);

  const groupedT = _.groupBy(transactions, item =>
    type === 'category'
      ? item.category.name
      : type === 'payee'
      ? item.payee.name
      : item.date,
  );
  const labels = [
    ...new Set(
      transactions.map(item =>
        type === 'category'
          ? item.category.name
          : type === 'payee'
          ? item.payee.name
          : item.date,
      ),
    ),
  ];

  const tdata = {
    labels: type === 'date' ? sortDates(labels) : labels,
    datasets: [
      {
        data: labels.map(item =>
          groupedT[item].reduce((prev, b) => prev + b.amount, 0),
        ),
      },
    ],
  };

  useEffect(() => {
    if (checkOverlap(labels)) {
      setRotationAngle(-50);
    }
  }, []);

  return (
    <LineChart
      style={{marginLeft: checkOverlap(labels) ? 0 : 40}}
      verticalLabelRotation={rotationAngle}
      chartConfig={{...chartConfig, propsForVerticalLabels: {dy: 10, dx: -40}}}
      data={tdata}
      width={Dimensions.get('window').width}
      height={checkOverlap(labels) ? Dimensions.get('window').width : 250}
      withShadow={false}
    />
  );
};

const CustomBarChart = ({transactions, type}: ChartProps) => {
  const [rotationAngle, setRotationAngle] = useState(0);

  const groupedT = _.groupBy(transactions, item =>
    type === 'category'
      ? item.category.name
      : type === 'payee'
      ? item.payee.name
      : item.date,
  );
  const labels = [
    ...new Set(
      transactions.map(item =>
        type === 'category'
          ? item.category.name
          : type === 'payee'
          ? item.payee.name
          : item.date,
      ),
    ),
  ];
  const tdata = {
    labels,
    datasets: [
      {
        data: labels.map(item =>
          groupedT[item].reduce((prev, b) => prev + b.amount, 0),
        ),
      },
    ],
  };

  useEffect(() => {
    if (checkOverlap(labels)) {
      setRotationAngle(90);
    }
  }, []);

  return (
    <BarChart
      yAxisLabel=""
      yAxisSuffix=""
      verticalLabelRotation={rotationAngle}
      chartConfig={chartConfig}
      data={tdata}
      width={Dimensions.get('window').width}
      height={checkOverlap(labels) ? Dimensions.get('window').width : 220}
      style={{marginLeft: labels.length > 4 ? 0 : 15}}
    />
  );
};

const CustomPieChart = ({transactions, type}: ChartProps) => {
  const groupedT = _.groupBy(transactions, item =>
    type === 'category'
      ? item.category.name
      : type === 'payee'
      ? item.payee.name
      : item.date,
  );
  const labels = [
    ...new Set(
      transactions.map(item =>
        type === 'category'
          ? item.category.name
          : type === 'payee'
          ? item.payee.name
          : item.date,
      ),
    ),
  ];
  const tdata = labels.map(item => ({
    name: item,
    amount: groupedT[item].reduce((prev, b) => prev + b.amount, 0),
    color: getRandomColor(),
    legendFontColor: '#eee',
    legendFontSize: 15,
  }));

  return (
    <PieChart
      paddingLeft={'15'}
      backgroundColor={'transparent'}
      data={tdata}
      width={Dimensions.get('window').width}
      height={220}
      chartConfig={chartConfig}
      accessor="amount"
    />
  );
};

type Props = {
  type: 'category' | 'payee' | 'date';
  transactions: ITransaction[];
  setTransactions: Dispatch<SetStateAction<ITransaction[]>>;
};

const Chart = ({type, transactions, setTransactions}: Props) => {
  const [index, setIndex] = useState(0);
  const {useQuery} = RealmContext;
  const realmTransactions = useQuery<ITransaction>('Transaction');

  useEffect(() => {
    const result = realmTransactions.map(item => ({
      _id: item._id,
      amount: item.amount,
      category: item.category,
      date: item.date,
      payee: item.payee,
    }));

    if (result.length > 0 && !(transactions.length > 0)) {
      setTransactions(result);
    }
  }, [realmTransactions]);

  if (!(transactions.length > 0)) return <View></View>;

  return (
    <>
      <View style={{height: 'auto', marginBottom: 450}}>
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
            <View>
              <CustomBarChart type={type} transactions={transactions} />
            </View>
          </TabView.Item>
          <TabView.Item
            style={{
              width: '100%',
              backgroundColor: '#222',
              paddingVertical: 40,
            }}>
            <CustomLineChart type={type} transactions={transactions} />
          </TabView.Item>
          <TabView.Item
            style={{
              width: '100%',
              backgroundColor: '#222',
              paddingVertical: 40,
            }}>
            <CustomPieChart type={type} transactions={transactions} />
          </TabView.Item>
        </TabView>
      </View>
    </>
  );
};

export default Chart;
