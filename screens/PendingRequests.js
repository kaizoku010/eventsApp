import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  db,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  addDoc,
} from "../Operations/firebaseConfig"; // Import Firebase Firestore functions
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataContext } from "../stateManagment/ContextApi";
import { useNavigation } from '@react-navigation/native';


const PendingRequests = ({ route }) => {
  const { requestData } = route.params || {};
  // console.log("request Data: ", requestData)
  const [pendingRequests, setPendingRequests] = useState([]);
  const [savedKey, setKey] = useState();
  const [requests, setRequests] = useState([]);
  const [room, setRoom] = useState();
  const [passId, setPassId] = useState();
  const [userObject, setUserObject] = useState();
  const [match, setMatch] = useState();
  // EventsDataProvider
  const { attendees, events, isLoading, error } = useContext(DataContext);
  //  console.log("passed API Data: ", attendees)
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: "Notifications" }); // Set the page title to the user's name
  }, [navigation]);

  useEffect(() => {
    const fetchRequests = async () => {
      const passID = await AsyncStorage.getItem("passId2");
      const parsedData = JSON.parse(passID);
      setUserObject(parsedData);
      const password = parsedData.password;

      setPassId(password);
      setKey(requestData);

      try {
        const requestsRef = collection(db, "chatRequests");
        const requestsSnapshot = await getDocs(requestsRef);
        const requestsData = requestsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (request) =>
              request.receiverId === password && request.status !== "accepted"
          );

        const roomData = requestsData.filter(
          (attendee) => attendee.status !== "accepted"
        );

        // Find matching attendees
        const matchedAttendees = requestsData
          .map((request) => {
            return attendees.find(
              (attendee) => attendee.password === request.senderId
            );
          })
          .filter(Boolean); // Filter out undefined values if no match is found

        // console.log("New Friend Match 2:", matchedAttendees);
        setMatch(matchedAttendees);

        setPendingRequests(roomData);
        // console.log("senderId: ",idsOnly)
        setRequests(roomData);
    //pass number of request to the homescreen
        // navigation.setParams({ pendingRequestsCount: roomData.length });
    
      } catch (error) {
        // console.error("Error fetching chat requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      // Retrieve the request document
      const requestDocRef = doc(db, "chatRequests", requestId);
      const requestDocSnapshot = await getDoc(requestDocRef);
      const requestData = requestDocSnapshot.data();

      // Create a new chat room document
      const newChatRoomRef = await addDoc(collection(db, "chatRooms"), {
        participants: [requestData.senderId, requestData.receiverId],
        messages: [], // Initialize with an empty array for messages
      });

      // Update the status of the request to 'accepted'
      await updateDoc(requestDocRef, { status: "accepted" });

      console.log("Chat room created successfully:", newChatRoomRef.id);
      const roomId = newChatRoomRef.id;
      setRoom(roomId);

      await AsyncStorage.setItem("roomID:", newChatRoomRef.id);
    } catch (error) {
      console.error("Error accepting chat request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      // Update the status of the request to 'declined' in Firestore
      await updateDoc(doc(db, "chatRequests", requestId), {
        status: "declined",
      });
      console.log("Chat request declined successfully.");
    } catch (error) {
      console.error("Error declining chat request:", error);
    }
  };

  // console.log("roomID: ", room)

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.rowMe}>
        <Image
          source={{ uri: item.image }} // Replace 'imageUri' with the actual image URL field in your data
          style={styles.avatar}
        />
        <View>
          <Text style={styles.senderName}>{item.name}</Text>
          <Text style={styles.senderOffice}>{item.office}</Text>
          <Text style={styles.senderOccup}>{item.occupation}</Text>
        </View>
      </View>

      <View style={styles.rowMe}>
        {/* Accept Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAcceptRequest(item.id)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        {/* Decline Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDeclineRequest(item.id)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={match}
        renderItem={renderItem}
        keyExtractor={(item) => item.password}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  senderOccup: {
    fontWeight: "200",
  },
  senderName: {
    fontWeight: "600",
  },
  senderOffice: {
    fontWeight: "300",
  },

  item: {
    flexDirection: "row",
    width: "100%",
    padding: 5,
    backgroundColor: "#f9f9f9",
    // marginTop:20,
 
  },
  container: {
    flex: 1,
  },

  rowMe: {
    flexDirection: "row",
    // margin:20
    // backgroundColor:"red",
  },
  avatar: {
    width: 50,
    height: 50,
    alignSelf: "center",
    borderRadius: 25,
    marginRight: 10,
  },
  requestItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },

  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    justifyContent: "center",
    color: "white",
    alignSelf: "center",
    paddingHorizontal: 20,
    borderRadius: 50,
    marginLeft: 13,
  },
  buttonText: {
    color: "white",
  },
});

export default PendingRequests;
