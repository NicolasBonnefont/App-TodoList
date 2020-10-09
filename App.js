import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import Icon from '@expo/vector-icons/Feather'
import firebase from './src/firebaseConnection'
import TaskList from './src/components/TaskList'



export default function App() {
  const inputRef = useRef(null)
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([])
  const [key, setKey] = useState('')

  useEffect(() => {
    async function loadTasks() {
      await firebase.database().ref('tarefas').on('value', (e) => {

        setTasks([])

        e.forEach((child) => {
          let data = {
            key: child.key,
            nome: child.val().nome
          }

          setTasks(old => [...old, data])

        })

      })
    }
    loadTasks()
  }, [])


  async function handleAdd() {

    if (newTask !== '') {

      if (key !== '') {
        await firebase.database().ref('tarefas').child(key).update({
          nome: newTask
        })
        Keyboard.dismiss()
        setNewTask('')
        setKey('')
        return
      }

      let tarefas = await firebase.database().ref('tarefas')
      let chave = tarefas.push().key

      tarefas.child(chave).set({
        nome: newTask
      })


      Keyboard.dismiss()
      setNewTask('')
      setKey('')
    }

  }

  async function handleDelete(key) {
    await firebase.database().ref('tarefas').child(key).remove()

  }

  async function handleEdit(data) {
    setNewTask(data.nome)
    inputRef.current.focus()
    setKey(data.key)
  }
  function cancelEdit() {
    setKey('')
    Keyboard.dismiss()
    setNewTask('')

  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />


      {key.length > 0 && (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={cancelEdit}>
            <Icon name='x-circle' size={20} color='#ff0000' />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5, marginBottom: 10, color: '#ff0000' }}>Você esta editando uma tarefa </Text>
        </View>
      )}



      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder='O que vai fazer hoje ?'
          underlineColorAndroid='transparent'
          value={newTask}
          onChangeText={(e) => setNewTask(e)}
          ref={inputRef}
        />

        <TouchableOpacity style={styles.btnAdd} onPress={() => handleAdd()}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TaskList data={item} deleteItem={handleDelete} editeItem={handleEdit} />
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 25,
    marginLeft: 10,
    marginRight: 10,


  },
  containerTask: {
    flexDirection: 'row',

  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#121212',
    height: 40,
    fontSize: 18
  },
  btnAdd: {
    /*     justifyContent:'center',
        alignItems:'center', */
    height: 40,
    backgroundColor: '#121212',
    paddingLeft: 14,
    paddingRight: 14,
    marginLeft: 5,

  },
  btnText: {
    color: '#fff',
    fontSize: 23
  }

});
