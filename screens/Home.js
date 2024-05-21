import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  Image}
from "react-native";

import React, { useEffect, useState,useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from 'react-redux';
import { fetchAttendeesAndEvents } from '../stateManagment/actions';
import { DataContext } from "../stateManagment/ContextApi";
import upper from "../assets/upper.png"
import lower from "../assets/lower.png"
import QRCode from "../Operations/QRCode_";

import ZigzagView from "react-native-zigzag-view"



const { height } = Dimensions.get('window');

const Home = ({ route, attended}) => {

  const { email, imagePath, userName } = route.params.route;
  const { attendees, isLoading, error, events } = useContext(DataContext);
// console.log("API data: ", attendees)
  const [eventList, setEventList] = useState([]);
  const [attendeesData, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [eventLoading, setEventLoading] = useState(true);
  // New state for event loading
  const [userData, setUserData] =useState()
  
  // SystemNavigationBar.immersive(); 
  useEffect(() => {
    const fetchData = async () => {
      try {

        setEventList(events);
        const attendeeObject = attendees.find(
          (event) => event.email === email
        );
        AsyncStorage.setItem('passId2', JSON.stringify(attendeeObject));
        setUserData(attendeeObject)
      
        if (attendeeObject) {
          const { selectedEvent } = attendeeObject;
            AsyncStorage.setItem('newKey', selectedEvent);

          const attendeeEventInfo = events.find(
            (event) => event.id === selectedEvent
          );
          setAttendees(attendeeEventInfo);
        }

        setLoading(false);
        setEventLoading(false);
      } catch (error) {
        // console.error("Error fetching data: ", error);
      }

      await AsyncStorage.setItem("eventName", attendeesData.eventName);
      

    };

    fetchData();
  }, [email]);

// console.log("event name and location: ", attendeesData.eventName)

  if (eventLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Please Wait...</Text>
      </View>
    );
  }

    // console.log("Attendence List: ", attended) 

  return (

    
    <View style={styles.container}>
            <View style={styles.paddedView}>

      <ImageBackground
        source={upper}
        style={styles.topView}
        resizeMode="cover"
      >
        {/* Add any content for the top view here */}
{/*      
        <View style={styles.profileContainer}>
          <Image style={styles.profilePhoto} srcSet={imagePath} />
      </View> */}
           <View style={styles.profileContainer}>
           <Text style={styles.statCount}>{attendeesData?.eventName || "loading"}</Text>
           <Text style={styles.sub}>This ticket gives you access to the event amenities, like sessions, etc </Text>
           <View style={styles.duals}>

<View style={styles.ticketElement}>
<Text style={styles.ticketTime}>{attendeesData?.eventTime}</Text>
<Text style={styles.ticketDate}>{attendeesData?.eventDate}</Text>  
</View>
<View style={styles.ticketElement2}>
<Text style={styles.ticketTime}>Location</Text>
<Text style={styles.ticketDate}>{attendeesData?.eventLocation}</Text>  
</View>


           </View>
        </View>      
      </ImageBackground>
      <ImageBackground
        source={lower}
        style={styles.bottomView}
        resizeMode="cover"
      >
        {/* Add any content for the bottom view here */}
    
         <View style={styles.button}>
         <QRCode
           userName={userName}email={email}
          selectedEvent={attendeesData?.eventName |"Loading"}
           image={imagePath}
          
       />
      </View>
          </ImageBackground>
      </View>
    </View>
  );//mushoku tensei
};

const styles = StyleSheet.create({
  ticketElement:{
marginLeft:10
  },
  ticketElement2:{
    marginRight:10
      },
  duals:{
    flexDirection:"row",
    backgroundColor:"white",
    borderRadius:20,
    width:200,
    padding:10,
    alignSelf:"center",
    marginTop:10,
    justifyContent:"space-between",

  },

  ticketTime:{
  },
  ticketDate:{
    color:"gray",
    fontWeight:"300",
  fontSize:12
  },

  sub:{
    fontSize:12,
    fontWeight:"300",
    marginTop:5,
    textAlign:"center",
    width:"50%",
    alignSelf:"center"
  },

  profileContainer:{
    marginTop:"35%",
    // marginLeft:10,
    alignSelf:"center",
    alignItems:"center",
    alignContent:"center"

  },

  newTicket:{
    backgroundColor:"red",
    marginTop:"15%"
  },
  paddedView:{
flex:1,
padding:5
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topView: {
    flex: 1,
    height: height / 1,
  },
  bottomView: {
    marginTop:2,
    flex: 1,
    height: height / 1,
  },
  // coverPhoto
  ticketHolder:{
flex:1
  },
  upperElements:{
// backgroundColor:"red"
paddingBottom:10,
height: "90%",

  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    marginTop:19

  },
  
  coverPhoto2: {
    width: "100%",
    height: "90%",
     marginTop:-29
  },

  upperKololo:{
// backgroundColor:"yellow",
marginLeft:10,
marginRight:10,
marginTop:30,
borderRadius:50,
height:"50%"

},
lowerKololo:{
  // backgroundColor:"green",
  marginLeft:10,
  marginRight:10,
  marginTop:-50,
  borderRadius:50,
  height:"50%"
  },

  desc:{
color:"red"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCont2:{
    flexDirection: "row",
    marginTop: -10,
    justifyContent:"center",
    gap:0,
    marginBottom: 0,
  },

  newCont:{
    flexDirection: "row",
    marginTop: 20,
    // backgroundColor:"red",
    marginBottom: -0,
  },
  image: {
    width: "100%",
    height: "30%",
  },
  container: {

    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
  },

  // profileContainer: {
  //   // alignItems: "center",
  //   marginTop: -10,
  // },

  eventdets:{

  },

  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor:"white"
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  bioContainer: {
    padding: 15,
    // backgroundColor:"blue",

  },
  bioText: {
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 20,
    // backgroundColor:"blue",
    marginBottom: -40,
  },
  statContainer: {
    margin:15,

    alignItems: "left",
    flex: 1,
  },
  statCount: {
    fontSize: 25,
    width:300,
    fontWeight: "400",
    textAlign:"center",
    alignSelf:"center"
  },
  statCount2: {
    fontSize: 13,
    fontWeight: "bold",
    maxWidth:"auto",
    alignItems: "center",

  },
  statLabel: {
    fontSize: 13,
    // backgroundColor:"red",
    textAlign:"left",
    marginTop:-10,
    color: "#999",
  },
  statLabel2: {
    fontSize: 13,
    // backgroundColor:"red",
    textAlign:"left",
    width:"40%",
    marginTop:-10,
    color: "#999",
  },
  button: {
    // backgroundColor: '#0066cc',
    // borderRadius: 5,
    padding: 10,
    marginHorizontal: 120,
    marginTop:"-10%",
    marginTop: "-30%",
    alignSelf:"center"
  },

});

const mapStateToProps = (state) => ({
  attendees: state.attendees,
  events: state.events,
});


export default connect(mapStateToProps, { fetchAttendeesAndEvents })(Home);
