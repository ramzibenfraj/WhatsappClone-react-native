
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Form = ({ route }) => {
  const { groupName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.groupText}>{groupName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupText: {
    fontSize: 24, 
  },
});

export default Form;
