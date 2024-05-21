import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { db, collection, getDocs } from "../Operations/firebaseConfig"; // Import Firebase Firestore functions
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataContext } from "../stateManagment/ContextApi";

const ChatScreen = ({ navigation, route }) => {
  const { email, imagePath, userName, uid } = route.params.route;
  const [isLoading, setIsLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const { attendees, chatRooms } = useContext(DataContext);
// console.log("first: ", attendees)
  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        const pass = await AsyncStorage.getItem("passId2");
        const parsedData = JSON.parse(pass);
        const password = parsedData?.password;

        const rooms = collection(db, "chatRooms");
        const roomSnap = await getDocs(rooms);
        const roomData = roomSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userRooms = roomData.filter(room =>
          room.participants.includes(password)
        );

        if (userRooms.length > 0) {
          const allParticipants = [];
          await Promise.all(userRooms.map(async room => {
            const participantIdentifiers = room.participants;
            const roomParticipants = attendees.filter(
              (attendee) =>
                participantIdentifiers.includes(attendee.password) &&
                attendee.password !== password
            );

            // Associate each participant with its corresponding room ID
            roomParticipants.forEach(participant => {
              allParticipants.push({ ...participant, roomId: room.id });
            });
          }));
          setFriendList(allParticipants);
        } else {
          // console.log("No rooms found for the given password");
        }
      } catch (error) {
        console.error("Error fetching accepted users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAcceptedUsers();
  }, []);

  const handleSelectUser = (user) => {
    navigation.navigate("ChatRoom", { user, roomID: user.roomId, image: imagePath });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleSelectUser(item)}
    >
      <View style={styles.friendHolder}>
        <Image
          style={styles.profilePhoto}
          source={{ uri: item.image }}
        />
        <View style={styles.names}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.work}>{item.office}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Please Wait....</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleTop}>Event Chat</Text>
      {friendList.length > 0 ? (
        <FlatList
          data={friendList}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noChats}>Oops! No Active Chat Rooms Found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noChats:{
    marginTop:50,
    textAlign:"center"
  },
  container: {
    flex: 1,
    padding: 10,
  },
  titleTop: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "left",
    marginTop: 50,
  },
  userItem: {
    padding: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  work: {},
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  friendHolder: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
  },
  names: {
    alignContent: "center",
    alignSelf: "center",
    marginLeft: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
