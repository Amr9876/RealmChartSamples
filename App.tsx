import {SafeAreaView, ScrollView, View} from 'react-native';
import RealmContext from './RealmContext';
import Chart from './components/Chart';
import ChooseType from './components/ChooseType';
import ChooseFilter from './components/ChooseFilter';
import ModifyData from './components/ModifyData';
import {Provider} from 'react-redux';
import store from './store';

function App() {
  const {RealmProvider} = RealmContext;

  return (
    <RealmProvider>
      <Provider store={store}>
        <ScrollView
          style={{backgroundColor: '#222'}}
          showsVerticalScrollIndicator>
          <ChooseType />
          <Chart />
          <View style={{marginTop: 420}}>
            <ChooseFilter />
            <ModifyData />
          </View>
        </ScrollView>
      </Provider>
    </RealmProvider>
  );
}

export default App;
