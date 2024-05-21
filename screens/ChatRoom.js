import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ImageBackground, Platform, Image } from 'react-native';
import { doc, onSnapshot, updateDoc, db } from '../Operations/firebaseConfig'; // Import Firebase Firestore functions
import moment from 'moment'; // Import moment.js for date formatting
import * as Notifications from 'expo-notifications';
import ic_placeHolder  from "../assets/receiver_profile_2.png"

// Simple SVG image component
const ProfileImage = ({ source }) => (
  <Image source={{ uri: source }} style={styles.profilePhoto} />
);

const ProfileImage2 = ({ source }) => (
  // <Image source={source} style={styles.profilePhoto} />
  <Image
          style={styles.profilePhoto}
          source={{ uri: source }}
        />
);

const ChatRoom = ({ route, navigation }) => {
  const { roomID, user, image } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: user.name }); // Set the page title to the user's name
  }, [navigation, user]);

  useEffect(() => {
    const fetchMessagesOrSetListeners = async () => {
      try {
        const roomRef = doc(db, 'chatRooms', roomID);
        const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
          const data = docSnapshot.data();
          if (data && data.messages) {
            setMessages(data.messages);
            if (data.messages.length > messages.length) {
              // showNewMessageNotification(data.messages[data.messages.length - 1].content);
            }
          }
        });
        return () => {
          unsubscribe(); // Unsubscribe from the listener when the component unmounts
        };
      } catch (error) {
        console.error('Error fetching messages or setting up listeners:', error);
      }
    };

    fetchMessagesOrSetListeners();
  }, [roomID, messages]);

  const sendMessage = async () => {
    if (messageInput.trim() === '') {
      return; // Don't send empty messages
    }
    
    try {
      const roomRef = doc(db, 'chatRooms', roomID);
      await updateDoc(roomRef, {
        messages: [...messages, { content: messageInput, sender: user.uid, timestamp: new Date() }]
      });
      setMessageInput(''); // Clear the message input field after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
// console.log("first:", messages)

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/chat_bg.png")}
        style={styles.imagebg}
      >
        <ScrollView contentContainerStyle={styles.messagesContainer}>
          {messages.map((message, index) => (
            <View key={index} style={message.sender === user.uid ? styles.sentMessageContainer : styles.receivedMessageContainer}>
              {message.sender !== user.uid && <ProfileImage source={message.image} />}
              <View style={message.sender === user.uid ? styles.sentMessageItem : styles.receivedMessageItem}>
                <Text style={styles.messageContent}>{message.content}</Text>
                <Text style={styles.messageDate}>{message.timestamp.toDate().toDateString()}</Text>
              </View>
              {message.sender === user.uid && <ProfileImage2 source={image} />}
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type a message..."
          multiline
        />
        <Button title="Send" style={styles.sendButton} onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageDate: {
    color: "gray",
    fontSize: 10
  },
  container: {
    flex: 1,
    padding: 10,
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end', // Align messages at the bottom of the container
  },
  sentMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  receivedMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  sentMessageItem: {
    padding: 10,
    backgroundColor: '#DCF8C5',
    alignSelf: 'flex-end',
    borderRadius: 10,
    maxWidth: '80%',
    marginLeft: 10,
  },
  receivedMessageItem: {
    padding: 10,
    backgroundColor: '#d9dbde',
    alignSelf: 'flex-start',
    borderRadius: 10,
    maxWidth: '80%',
    marginRight: 10,
  },
  messageContent: {
    fontSize: 14,
    color: '#000',
  },
  sendButton: {
    backgroundColor: 'black',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  imagebg: {
    flex: 1,
    height: "90%",
    width: "100%"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  profilePhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default ChatRoom;
