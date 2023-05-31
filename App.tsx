import {useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import RealmContext from './RealmContext';
import Chart from './components/Chart';
import ChooseType from './components/ChooseType';
import ChooseFilter from './components/ChooseFilter';
import ITransaction from './interfaces/ITransaction';
import ModifyData from './components/ModifyData';

function App() {
  const {RealmProvider} = RealmContext;
  const [type, setType] = useState<'category' | 'payee' | 'date'>('category');
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  return (
    <RealmProvider>
      <SafeAreaView
        style={{paddingVertical: 40, backgroundColor: '#222', flex: 1}}>
        <ScrollView showsHorizontalScrollIndicator>
          <ChooseType type={type} setType={setType} />
          <Chart
            transactions={transactions}
            setTransactions={setTransactions}
            type={type}
          />
          <ChooseFilter
            transactions={transactions}
            setTransactions={setTransactions}
          />
          <ModifyData setTransactions={setTransactions} />
        </ScrollView>
      </SafeAreaView>
    </RealmProvider>
  );
}

export default App;
