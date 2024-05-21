import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContext } from "../stateManagment/ContextApi";

const Agenda = () => {
  const { events } = useContext(DataContext);
// console.log("api event data: ", events)
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true); // State variable for loading
  const [savedKey, setKey] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const value2 = await AsyncStorage.getItem('newKey');
        const selectedEvent = events.find((event) => event.id === value2);

        if (selectedEvent && selectedEvent.agenda) {
          setAgendas(selectedEvent.agenda);
        }

        const value = await AsyncStorage.getItem('EventId');
        if (value !== null) {
          // value previously stored
          setKey(value)
        }

        setLoading(false); // Data fetched, set loading to false
      } catch (error) {
        // Handle error
        console.error('Error fetching agenda data: ', error);
        setLoading(false); // Even if error occurs, loading should stop
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={{ fontWeight: 'bold' }}>Session: {item.session}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Title: {item.title}</Text>
    </View>
  );

  return (
    <View style={styles.wrapperAll}>
      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={agendas}
          renderItem={renderItem}
          keyExtractor={(item) => item.session}
          ListEmptyComponent={<Text>No agenda items found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperAll: {
    flex: 1,
    width: "100%",
  },
  item: {
    padding: 20,
    display: "flex",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default Agenda;
