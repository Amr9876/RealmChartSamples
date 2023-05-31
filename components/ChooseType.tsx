import {View} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Button} from '@rneui/themed';

type Props = {
  type: 'category' | 'payee' | 'date';
  setType: Dispatch<SetStateAction<'category' | 'payee' | 'date'>>;
};

const ChooseType = ({type, setType}: Props) => {
  return (
    <View style={{flexDirection: 'row', marginBottom: 40, width: '100%'}}>
      <Button
        onPress={() => setType('category')}
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
        onPress={() => setType('payee')}
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
        onPress={() => setType('date')}
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
