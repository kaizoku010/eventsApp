import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import {
  db,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "../Operations/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataContext } from "../stateManagment/ContextApi";

const Attendees = ({ route }) => {
  const { attendees, events, isLoading, error } = useContext(DataContext);
  const { email, imagePath, userName, uid } = route;
  const [attendeesData, setAttendeesData] = useState([]);
  const [savedKey, setKey] = useState();
  const [newData, setNewData] = useState();
  const [userId, setUserId] = useState();
  const [userPass, setUserPass] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem("EventId");
      const userID = await AsyncStorage.getItem("userID");
      const passID = await AsyncStorage.getItem("passId2");
      const parsedData = JSON.parse(passID);
      const password = parsedData.password;
      setUserPass(password);    

      try {
          const filteredAttendeesData = attendees.filter(
          (attendee) => attendee.email !== email
        );
        const selectedEvent = filteredAttendeesData.filter(
          (event) => event.selectedEvent === savedKey
        );
        setNewData(selectedEvent);
        setAttendeesData(attendeesData);
        await AsyncStorage.setItem("passID", password);
      if (value !== null) {
        // value previously stored
        setUserId(userID);
        setKey(value);
      }

    
      } catch (error) {
        // console.error("Error fetching attendees data: ", error);
      }
    };

    fetchData();
  }, [newData]);

  const sendChatRequest = async (senderId, receiverId) => {
    try {
      // Add a new document to the 'chatRequests' collection
      await addDoc(collection(db, "chatRequests"), {
        senderId: senderId,
        receiverId: receiverId,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      console.log("Chat sent successfully.");
    } catch (error) {
      console.error("Error sending chat request:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{ uri: item.image }} // Replace 'imageUri' with the actual image URL field in your data
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text>{item.name}</Text>
        <Text>{item.email}</Text>
        <Text>{item.office}</Text>
        <Text>{item.occupation}</Text>
      </View>
      {/* Button to send chat request */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => sendChatRequest(userPass, item.password)}
      >
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wide}>
      {/* <Text style={styles.title}>Attendees</Text> */}
      <FlatList
        data={newData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wide:{
    width:"100%",
    backgroundColor:"red"
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

export default Attendees;
