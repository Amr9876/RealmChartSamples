import {View} from 'react-native';
import {BottomSheet, Button, ListItem} from '@rneui/themed';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, {useState} from 'react';
import moment from 'moment';
import {format} from 'date-fns';

interface Props {
  startDate: Date | undefined;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  endDate: Date | undefined;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DateModal = ({
  visible,
  setVisible,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) => {
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const toggleStartDatePickerVisibility = () => {
    setStartDatePickerVisibility(prev => !prev);
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    toggleStartDatePickerVisibility();
  };

  const toggleEndDatePickerVisibility = () => {
    setEndDatePickerVisibility(prev => !prev);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(date);
    toggleEndDatePickerVisibility();
  };

  return (
    <BottomSheet isVisible={visible} modalProps={{}}>
      <View>
        <Button
          title={
            startDate ? format(startDate, 'd/M/yyyy') : 'Select Start Date'
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
          title={endDate ? format(endDate, 'd/M/yyyy') : 'Select End Date'}
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
        containerStyle={{backgroundColor: 'rgb(26, 255, 146)'}}
        onPress={() => setVisible(false)}>
        <ListItem.Content>
          <ListItem.Title style={{color: '#fff'}}>Confirm</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </BottomSheet>
  );
};

export default DateModal;
