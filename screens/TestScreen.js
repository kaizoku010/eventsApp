import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  db,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "../Operations/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TestScreen({ route }) {
  const { email, imagePath, userName, uid } = route.params.route;
  const [loading, setLoading] = useState(true); // State variable for loading
  const [attendeesData, setAttendeesData] = useState([]);
  const [savedKey, setKey] = useState();
  const [newData, setNewData] = useState();
  const [userId, setUserId] = useState();
  const [userPass, setUserPass] = useState();
// console.log("Key: ", savedKey)
  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem("newKey");
      const userID = await AsyncStorage.getItem("userID");
      const passID = await AsyncStorage.getItem("passId2");
      // console.log("Key: ", value)


      // console.log("first::", route.params)
      const parsedData = JSON.parse(passID);
      const password = parsedData.password;
      setUserPass(password);

      try {
        const attendeesRef = collection(db, "attendees");
        const attendeesSnapshot = await getDocs(attendeesRef);
        const attendeesData = attendeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        await AsyncStorage.setItem("passID", password);
        if (value !== null) {
          // value previously stored
          setUserId(userID);
          setKey(value);
        }

        const filteredAttendeesData = attendeesData.filter(
          (attendee) => attendee.password !== userPass
        );

        const selectedEvent = filteredAttendeesData.filter(
          (event) => event.selectedEvent === savedKey
        );
        setNewData(selectedEvent);
        setAttendeesData(attendeesData);
        setLoading(false); // Data fetched, set loading to false
      } catch (error) {
        // Handle error
        console.error("Error fetching attendees data: ", error);
        setLoading(false); // Even if error occurs, loading should stop
      }
    };

    fetchData();
  }, [newData]);

  // Function to send chat request
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
        <Text style={styles.smaller2}>{item.name}</Text>
        <Text style={styles.smaller}>{item.email}</Text>
        <Text style={styles.smaller}>{item.office}</Text>
        <Text style={styles.smaller}>{item.occupation}</Text>
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
      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
        
      ) : (
        <FlatList
          data={newData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wide: {
    width: "100%",
  },
  item: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // marginTop:-20

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
    height: 40,
    justifyContent: "center",
    color: "white",
    alignSelf: "center",
    paddingHorizontal: 10,
    borderRadius: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  smaller: {
    fontSize: 12,
  },
  smaller2:{
    // marginTop:-20
  }
});

export default TestScreen;
