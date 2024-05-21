import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, db, getDocs } from "../Operations/firebaseConfig";
import React, { useEffect, useState, useContext } from "react";
import { DataContext } from "../stateManagment/ContextApi";

const Speakers = () => {
  const { events } = useContext(DataContext);
  //  console.log("speaker api event data: ", events)
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true); // State variable for loading
  const [savedKey, setKey] = useState();
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("newKey");
        if (value !== null) {
          // value previously stored
          setKey(value);
        }
        setLoading(false); // Data fetched, set loading to false

      } catch (e) {
        // error reading value
      }
    };

    getData();
    const fetchData = async () => {
      try {
        const selectedEvent = events.find((event) => event.id === savedKey);
        //   console.log('fetching agenda data:', selectedEvent.agenda);
        if (selectedEvent && selectedEvent.agenda) {
          setAgendas(selectedEvent.agenda);
        }
      } catch (error) {
        // console.error('Error fetching agenda data: ', error);
      }
    };
    fetchData();
  });

  const renderItem = ({ item }) => (
    <View
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
    >
      {/* <Text style={{ fontWeight: 'bold' }}>Session: {item.session}</Text> */}
      <Text>Speaker: {item.speaker}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Topic: {item.title}</Text>
    </View>
  );

  return (
    <View style={styles.wide}>
  {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
       <FlatList
      data={agendas}
      renderItem={renderItem}
      keyExtractor={(item) => item.session}
      ListEmptyComponent={<Text>No agenda items found</Text>}/>
    )}

    </View>
   
  );
};
const styles = StyleSheet.create({
  wide:{
    width:"100%",
    // backgroundColor:"red"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    
  },
  avatar: {
    width: 50,
    height: 50,
    alignSelf: "center",
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 5,
    height: "50%",
    justifyContent: "center",
    color: "white",
    alignSelf: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
export default Speakers;
