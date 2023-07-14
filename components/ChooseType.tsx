import {View} from 'react-native';
import React from 'react';
import {Button} from '@rneui/themed';
import {useSelector, useDispatch} from 'react-redux';
import {getTransactionsState, setType} from '../store/transactionsSlice';

const ChooseType = () => {
  const {type} = useSelector(getTransactionsState);
  const dispatch = useDispatch();

  return (
    <View style={{flexDirection: 'row', width: '100%', marginTop: 20}}>
      <Button
        onPress={() => dispatch(setType('category'))}
        buttonStyle={{
          backgroundColor: '#222',
          borderWidth: 1,
          borderColor: type === 'category' ? 'rgb(26, 255, 146)' : '#eee',
          borderRadius: 8,
        }}
        titleStyle={{
          color: type === 'category' ? 'rgb(26, 255, 146)' : '#eee',
        }}
        containerStyle={{width: '33%', marginHorizontal: 6}}
        size="lg">
        Category
      </Button>
      <Button
        onPress={() => dispatch(setType('payee'))}
        buttonStyle={{
          backgroundColor: '#222',
          borderWidth: 1,
          borderColor: type === 'payee' ? 'rgb(26, 255, 146)' : '#eee',
          borderRadius: 8,
        }}
        titleStyle={{
          color: type === 'payee' ? 'rgb(26, 255, 146)' : '#eee',
        }}
        containerStyle={{width: '33%', marginRight: 6}}
        size="lg">
        Payee
      </Button>
      <Button
        onPress={() => dispatch(setType('date'))}
        buttonStyle={{
          backgroundColor: '#222',
          borderWidth: 1,
          borderColor: type === 'date' ? 'rgb(26, 255, 146)' : '#eee',
          borderRadius: 8,
        }}
        titleStyle={{
          color: type === 'date' ? 'rgb(26, 255, 146)' : '#eee',
        }}
        containerStyle={{width: '28%'}}
        size="lg">
        Date
      </Button>
    </View>
  );
};

export default ChooseType;
