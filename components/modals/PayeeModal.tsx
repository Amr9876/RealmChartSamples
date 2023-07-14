import React, {useMemo} from 'react';
import {FlatList} from 'react-native';
import {BottomSheet, ListItem} from '@rneui/themed';

interface Props {
  payees: string[];
  selectedPayees: string[];
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPayees: React.Dispatch<React.SetStateAction<string[]>>;
}

const PayeeModal = ({
  payees,
  selectedPayees,
  visible,
  setSelectedPayees,
  setVisible,
}: Props) => {
  const selectedPayeesSet = useMemo(
    () => new Set(selectedPayees),
    [selectedPayees],
  );

  const selectPayee = (item: string) => {
    setSelectedPayees(prev => {
      const prevSet = new Set(prev);

      if (prevSet.has(item)) {
        prevSet.delete(item);
      } else {
        prevSet.add(item);
      }

      return Array.from(prevSet);
    });
  };

  return (
    <BottomSheet isVisible={visible} modalProps={{}}>
      {payees.map((item, index) => (
        <ListItem
          key={index}
          onPress={() => selectPayee(item)}
          containerStyle={{backgroundColor: '#111'}}>
          <ListItem.Content>
            <ListItem.Title
              style={{
                color: selectedPayeesSet.has(item)
                  ? 'rgb(26, 255, 146)'
                  : '#fff',
              }}>
              {item}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
      <ListItem
        containerStyle={{backgroundColor: 'rgb(26, 255, 146)'}}
        onPress={() => setVisible(false)}>
        <ListItem.Content>
          <ListItem.Title style={{color: '#fff'}}>Confirm</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </BottomSheet>
  );
};

export default PayeeModal;
