import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import firebase from '../../firebaseConnection'
import Icon from '@expo/vector-icons/Feather';


const TaskList = ({ data, deleteItem, editeItem }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ marginRight: 10 }} onPress={() => deleteItem(data.key)}>
        <Icon name='trash' color='#fff' size={25} />
      </TouchableOpacity>

      <View style={{ paddingRight: 15 }}>
        <TouchableWithoutFeedback  style={{flex:1}} onPress={() => editeItem(data)}>
          <Text style={{ color: '#fff', paddingRight: 10 }}> {data.nome} </Text>
        </TouchableWithoutFeedback>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#121212',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,


  }
})



export default TaskList;