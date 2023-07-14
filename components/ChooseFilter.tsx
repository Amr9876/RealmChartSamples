import {Button, Text} from '@rneui/themed';
import {useState, useMemo} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {getDatesBetweenDates} from '../utils';
import {useDispatch} from 'react-redux';
import {setTransactions} from '../store/transactionsSlice';
import {format} from 'date-fns';
import ITransaction from '../interfaces/ITransaction';
import RealmContext from '../RealmContext';
import CategoryModal from './modals/CategoryModal';
import PayeeModal from './modals/PayeeModal';
import DateModal from './modals/DateModal';

const ChooseFilter = () => {
  const {useQuery} = RealmContext;

  const allTransactions = useQuery<ITransaction>('Transaction');

  const categories = useMemo(
    () => [...new Set(allTransactions.map(item => item.category.name))],
    [],
  );
  const payees = useMemo(
    () => [...new Set(allTransactions.map(item => item.payee.name))],
    [],
  );
  const dates = useMemo(
    () => [
      ...new Set(allTransactions.map(item => format(item.date, 'd/M/yyyy'))),
    ],
    [],
  );

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isPayeeModalVisible, setIsPayeeModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(categories);
  const [selectedPayees, setSelectedPayees] = useState<string[]>(payees);

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [isBusy, setIsBusy] = useState(false);

  const dispatch = useDispatch();

  const applyFilter = () => {
    if (!(selectedCategories.length > 0) || !(selectedPayees.length > 0))
      return;

    setIsBusy(true);

    const isDatesAvailable = startDate && endDate;

    const selectedDates = isDatesAvailable
      ? getDatesBetweenDates(startDate, endDate) // <=== 😁
      : dates;

    const filteredTransactions = allTransactions.filter(
      item =>
        selectedCategories.includes(item.category.name) &&
        selectedPayees.includes(item.payee.name) &&
        selectedDates.includes(format(item.date, 'd/M/yyyy')),
    );

    const result = filteredTransactions.map(item => ({
      _id: item._id,
      amount: item.amount,
      category: item.category,
      date: item.date,
      payee: item.payee,
    }));

    console.log('ChooseFilter.tsx 80', {result});

    dispatch(setTransactions(result));

    setIsBusy(false);

    console.log('applied filter');
  };

  const resetFilter = () => {
    const result = allTransactions.map(item => ({
      _id: item._id,
      amount: item.amount,
      category: item.category,
      date: item.date,
      payee: item.payee,
    }));

    dispatch(setTransactions(result));

    console.log('reset filter');
  };

  return (
    <View>
      <Text
        h3
        h3Style={{color: '#eee', textAlign: 'center', marginVertical: 24}}>
        Pick a filter
      </Text>

      <View style={{flexDirection: 'row', marginBottom: 40, width: '100%'}}>
        <Button
          onPress={() => setIsCategoryModalVisible(true)}
          buttonStyle={{
            backgroundColor: '#222',
            borderWidth: 1,
            borderColor: '#eee',
            borderRadius: 8,
          }}
          containerStyle={{width: '33%', marginHorizontal: 6}}
          size="lg">
          Category
        </Button>
        <Button
          onPress={() => setIsPayeeModalVisible(true)}
          buttonStyle={{
            backgroundColor: '#222',
            borderWidth: 1,
            borderColor: '#eee',
            borderRadius: 8,
          }}
          containerStyle={{width: '33%', marginRight: 6}}
          size="lg">
          Payee
        </Button>
        <Button
          onPress={() => setIsDateModalVisible(true)}
          buttonStyle={{
            backgroundColor: '#222',
            borderWidth: 1,
            borderColor: '#eee',
            borderRadius: 8,
          }}
          containerStyle={{width: '28%'}}
          size="lg">
          Date
        </Button>
      </View>

      {isBusy ? (
        <ActivityIndicator size={24} color="#eee" style={{marginVertical: 8}} />
      ) : (
        <Button
          buttonStyle={{backgroundColor: 'darkgreen', borderRadius: 8}}
          containerStyle={{
            marginHorizontal: 10,
          }}
          titleStyle={{fontSize: 20}}
          onPress={applyFilter}>
          Apply Filter
        </Button>
      )}

      <Button
        buttonStyle={{backgroundColor: 'darkgreen', borderRadius: 8}}
        containerStyle={{
          marginHorizontal: 10,
          marginVertical: 10,
        }}
        titleStyle={{fontSize: 20}}
        onPress={resetFilter}>
        Reset Filter
      </Button>

      <CategoryModal
        setSelectedCategories={setSelectedCategories}
        selectedCategories={selectedCategories}
        categories={categories}
        visible={isCategoryModalVisible}
        setVisible={setIsCategoryModalVisible}
      />

      <PayeeModal
        setSelectedPayees={setSelectedPayees}
        selectedPayees={selectedPayees}
        payees={payees}
        visible={isPayeeModalVisible}
        setVisible={setIsPayeeModalVisible}
      />

      <DateModal
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        visible={isDateModalVisible}
        setVisible={setIsDateModalVisible}
      />
    </View>
  );
};

export default ChooseFilter;
