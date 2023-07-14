import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {ListItem} from '@rneui/themed';
import {useSelector, useDispatch} from 'react-redux';
import {
  getPeriodState,
  updatePeriod,
  updateShowPeriodsList,
} from '../../store/periodSlice';

const PeriodsListModal = () => {
  const [busy, setBusy] = useState({loading: false, period: ''});

  const {period, showPeriodsList} = useSelector(getPeriodState);
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(updateShowPeriodsList(false));
  };

  const handleOnPress = (item: string) => {
    setBusy({loading: true, period: item});

    dispatch(updatePeriod(item));

    closeModal();
    setBusy({loading: false, period: ''});
  };

  return (
    <Modal visible={showPeriodsList} onRequestClose={closeModal} transparent>
      <Pressable style={styles.container} onPress={closeModal}>
        <FlatList
          style={{
            width: '100%',
            marginTop: Dimensions.get('window').height / 3,
          }}
          data={['7days', '1month', '1year', 'decade']}
          renderItem={({item, index}) => (
            <ListItem
              onPress={() => handleOnPress(item)}
              key={index}
              containerStyle={{backgroundColor: '#111'}}>
              <ListItem.Content>
                {busy.loading && busy.period === item ? (
                  <ActivityIndicator size={24} color="#eee" />
                ) : (
                  <ListItem.Title
                    style={{
                      color: period === item ? 'rgb(26, 255, 146)' : '#fff',
                    }}>
                    {item}
                  </ListItem.Title>
                )}
              </ListItem.Content>
            </ListItem>
          )}
        />
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PeriodsListModal;
