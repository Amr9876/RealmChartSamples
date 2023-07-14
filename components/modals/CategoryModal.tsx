import React, {useMemo} from 'react';
import {FlatList} from 'react-native';
import {BottomSheet, ListItem} from '@rneui/themed';

interface Props {
  categories: string[];
  selectedCategories: string[];
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryModal = ({
  categories,
  selectedCategories,
  visible,
  setSelectedCategories,
  setVisible,
}: Props) => {
  const selectedCategoriesSet = useMemo(
    () => new Set(selectedCategories),
    [selectedCategories],
  );

  const selectCategory = (item: string) => {
    setSelectedCategories(prev => {
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
      {categories.map((item, index) => (
        <ListItem
          key={index}
          onPress={() => selectCategory(item)}
          containerStyle={{backgroundColor: '#111'}}>
          <ListItem.Content>
            <ListItem.Title
              style={{
                color: selectedCategoriesSet.has(item)
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

export default CategoryModal;
