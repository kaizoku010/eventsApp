import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Attendees from "./Attendees";
import AgendaList from "../screens/AgendaList";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { collection, db, getDocs } from "../Operations/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Speakers from "../screens/Speakers";
import ChatScreen from "../screens/Chat";
import HomeScreen from "../screens/HomeScreen";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import NewTabs from "../screens/NewTabs";


const Stack = createStackNavigator();
const Tab = AnimatedTabBarNavigator();

// Tabs component for the Home screen
const MyTabs = ({ route }) => {
  const { user } = route.params;
  const [eventID, setEventID] = useState();
  const [allEvents, setAllEvents] = useState();
  const [allAttendees, setAllAttendees] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const eventsRef = collection(db, "attendees");
        const eventsSnapshot = await getDocs(eventsRef);
        const eventsData = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
setAllAttendees(eventsData)

        const neweventsRef = collection(db, "events");
        // const jobOffice = collection(db, "attendes");
        const neweventsSnapshot = await getDocs(neweventsRef);
        const neweventsData = neweventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllEvents(neweventsData)
      await AsyncStorage.setItem('attendeesList', JSON.stringify(eventsData));
      await AsyncStorage.setItem('allEvents', JSON.stringify(neweventsData));

        const attendeeObject = eventsData.find(
          (event) => event.email === user.email
        );
        const id = attendeeObject.selectedEvent;
        setEventID(id.toString());
      } catch (error) {
        // console.error("Error fetching agenda data: ", error);
      }
    };
    fetchData();
  }, []);

  // console.log("All BI Event: ", allEvents);


  const storeData = async (value) => {
    try {//attendeesLIst
    } catch (e) {
      // saving error
    }
  };

  storeData(eventID)


 const attendeeData={
    userData:user,
    eventID: eventID
 }
  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:false,
        
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Ticket") {
            iconName = "ticket-outline";
          } 
    
          else if (route.name === "Chat") {
            iconName = "chatbubbles-outline";
          }
          else if (route.name === "Home") {
            iconName = "home-outline";
          }
          else if (route.name === "Details") {
            iconName = "reader-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
      tabBarOptions={{
        activeTintColor: "white",
        inactiveTintColor: "gray",
        activeBackgroundColor:"black",
      }}
      appearance={
        {
          floating:"true"

        }
      }
    >
      <Tab.Screen name="Home"     
 component={HomeScreen}
 initialParams={{ route: user }}
 />
      <Tab.Screen
        name="Ticket"
        component={Home}
        options={{ headerShown: false }} // Hide the header for the HomeTabs screen
        initialParams={{ route: user, attended:allAttendees }}
      />

  <Tab.Screen name="Chat"  
              initialParams={{ route: user }}   
 component={ChatScreen} />

 
<Tab.Screen name="Details" 
 initialParams={{ route: user }}

component={NewTabs}/>
    </Tab.Navigator>

    
  );
};

export default MyTabs;
