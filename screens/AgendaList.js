import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, db, getDocs } from '../Operations/firebaseConfig';
import { useRoute } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


const AgendaList = () => {

  const route = useRoute(); 
  const [agendas, setAgendas] = useState([]);
const [savedKey, setKey] = useState()


useEffect(() => {
    
    const fetchData = async () => {

      try {
        const eventsRef = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsRef);
        const eventsData = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      const value2 = await AsyncStorage.getItem('EventId');

        const selectedEvent = eventsData.find((event) => event.id === value2);
        // console.log('fetching agenda data:', route);

        if (selectedEvent && selectedEvent.agenda) {
          setAgendas(selectedEvent.agenda);
        }

        const value = await AsyncStorage.getItem('EventId');
        if (value !== null) {
          // value previously stored
          setKey(value)
        }
      } catch (error) {
        // console.error('Error fetching agenda data: ', error);
      }
  };
    fetchData();

  // console.log("saved key value: ", savedKey)

  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.wrapperAll}>
      <Text style={{ fontWeight: 'bold' }}>Session: {item.session}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Title: {item.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={agendas}
      renderItem={renderItem}
      keyExtractor={(item) => item.session}
      ListEmptyComponent={<Text>No agenda items found</Text>}
    />
  );
};



const styles = StyleSheet.create({

  
  wrapperAll: {
    flex: 1,
    // backgroundColor:"red",
  //   paddingTop: 40,
width:"100%",
padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  tabSelector: {
    marginTop: 10,
    marginBottom: 20,
  },
  activeTab: {
    backgroundColor:"black"
    // Define styles for active tab
  },
  inactiveTab: {
    // Define styles for inactive tab
  },
  activeText: {
    // Define styles for active text
  },
  inactiveText: {
    // Define styles for inactive text
  },
  text: {
    fontSize: 20,
    marginTop: 20,
  },
});

export default AgendaList;
