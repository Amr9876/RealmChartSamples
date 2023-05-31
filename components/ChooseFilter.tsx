import type {Dispatch, SetStateAction} from 'react';
import {BottomSheet, Button, ListItem, Text} from '@rneui/themed';
import {useState, useEffect} from 'react';
import {View} from 'react-native';
import ITransaction from '../interfaces/ITransaction';
import RealmContext from '../RealmContext';
import _ from 'lodash';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Props = {
  transactions: ITransaction[];
  setTransactions: Dispatch<SetStateAction<ITransaction[]>>;
};

const ChooseFilter = ({transactions, setTransactions}: Props) => {
  const {useQuery, useRealm} = RealmContext;

  const allTransactions = useQuery<ITransaction>('Transaction');

  const categories = [
    ...new Set(allTransactions.map(item => item.category.name)),
  ];
  const payees = [...new Set(allTransactions.map(item => item.payee.name))];
  const dates = [...new Set(allTransactions.map(item => item.date))];

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isPayeeModalVisible, setIsPayeeModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    ...new Set(allTransactions.map(item => item.category.name)),
  ]);
  const [selectedPayees, setSelectedPayees] = useState<string[]>([
    ...new Set(allTransactions.map(item => item.payee.name)),
  ]);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);

  const [marginTop, setMarginTop] = useState(0);

  const toggleStartDatePickerVisibility = () => {
    setStartDatePickerVisibility(prev => !prev);
  };

  const handleStartDateConfirm = (date: Date) => {
    console.log('A start date has been picked: ', {
      date,
      momentDate: moment(date),
    });
    setStartDate(moment(date));
    toggleStartDatePickerVisibility();
  };

  const toggleEndDatePickerVisibility = () => {
    setEndDatePickerVisibility(prev => !prev);
  };

  const handleEndDateConfirm = (date: Date) => {
    console.log('An end date has been picked: ', {
      date,
      momentDate: moment(date).toLocaleString(),
    });
    setEndDate(moment(date));
    toggleEndDatePickerVisibility();
  };

  const getDatesBetweenDates = (
    startDate: moment.Moment,
    endDate: moment.Moment,
  ) => {
    let dates: string[] = [];
    let currentDate = moment(startDate).startOf('day');
    let stopDate = moment(endDate).startOf('day');
    while (currentDate <= stopDate) {
      dates.push(moment(currentDate).format('D/M/YYYY'));
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dates;
  };

  const applyFilter = () => {
    if (!(selectedCategories.length > 0) || !(selectedPayees.length > 0))
      return;

    const isDatesAvailable = startDate && endDate;

    const dates = isDatesAvailable
      ? getDatesBetweenDates(startDate, endDate)
      : [];

    console.log({dates});

    const filteredTransactions = allTransactions
      .filter(item => selectedCategories.includes(item.category.name))
      .filter(item => selectedPayees.includes(item.payee.name))
      .filter(item => {
        console.log(`${item.date} - ${dates.includes(item.date)}`);
        return dates.includes(item.date);
      });

    const result = filteredTransactions.map(item => ({
      _id: item._id,
      amount: item.amount,
      category: item.category,
      date: item.date,
      payee: item.payee,
    }));

    setTransactions(result);

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

    setTransactions(result);

    console.log('reset filter');
  };

  useEffect(() => {
    setMarginTop(
      [...new Set(transactions.map(item => item.category.name))].length > 4
        ? 300
        : 0,
    );
  }, [transactions]);

  return (
    <View style={{marginTop}}>
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

      <Button
        buttonStyle={{backgroundColor: 'darkgreen', borderRadius: 8}}
        containerStyle={{
          marginHorizontal: 10,
        }}
        titleStyle={{fontSize: 20}}
        onPress={applyFilter}>
        Apply Filter
      </Button>

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

      <BottomSheet isVisible={isCategoryModalVisible} modalProps={{}}>
        {categories.map((item, i) => (
          <ListItem
            key={i}
            onPress={() =>
              setSelectedCategories(prev =>
                prev.find(x => x === item)
                  ? prev.filter(x => x !== item)
                  : [...prev, item],
              )
            }
            containerStyle={{backgroundColor: '#111'}}>
            <ListItem.Content>
              <ListItem.Title
                style={{
                  color: selectedCategories.find(x => x === item)
                    ? 'rgb(26, 255, 146)'
                    : '#fff',
                }}>
                {item}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}

        <ListItem
          containerStyle={{backgroundColor: 'rgba(26, 255, 146, 0.6)'}}
          onPress={() => setIsCategoryModalVisible(false)}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#fff'}}>Confirm</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>

      <BottomSheet isVisible={isPayeeModalVisible} modalProps={{}}>
        {payees.map((item, i) => (
          <ListItem
            onPress={() =>
              setSelectedPayees(prev =>
                prev.find(x => x === item)
                  ? prev.filter(x => x !== item)
                  : [...prev, item],
              )
            }
            key={i}
            containerStyle={{backgroundColor: '#111'}}>
            <ListItem.Content>
              <ListItem.Title
                style={{
                  color: selectedPayees.find(x => x === item)
                    ? 'rgb(26, 255, 146)'
                    : '#fff',
                }}>
                {item}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}

        <ListItem
          containerStyle={{backgroundColor: 'rgba(26, 255, 146, 0.6)'}}
          onPress={() => setIsPayeeModalVisible(false)}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#fff'}}>Confirm</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>

      <BottomSheet isVisible={isDateModalVisible} modalProps={{}}>
        <View>
          <Button
            title={
              startDate
                ? startDate.toDate().toLocaleDateString()
                : 'Select Start Date'
            }
            onPress={toggleStartDatePickerVisibility}
          />
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={toggleStartDatePickerVisibility}
          />
          <Button
            title={
              endDate
                ? endDate.toDate().toLocaleDateString()
                : 'Select End Date'
            }
            onPress={toggleEndDatePickerVisibility}
          />
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={toggleEndDatePickerVisibility}
          />
        </View>
        <ListItem
          containerStyle={{backgroundColor: 'rgba(26, 255, 146, 0.6)'}}
          onPress={() => setIsDateModalVisible(false)}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#fff'}}>Confirm</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>
    </View>
  );
};

export default ChooseFilter;
