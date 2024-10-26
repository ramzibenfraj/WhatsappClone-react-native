
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const Group = () => {
  const navigation = useNavigation(); 

  const data = [
    { id: '1', name: 'GL1' },
    { id: '2', name: 'BI1' },
    { id: '3', name: 'BI2' },
    { id: '4', name: 'GL2' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => navigateToForm(item.name)}
    >
      <Text style={styles.groupText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const navigateToForm = (groupName) => {

      
      navigation.navigate("Forum", { groupName });
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  groupText: {
    fontSize: 16,
  },
});

export default Group;
