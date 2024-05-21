import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, style } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { DataContext } from "../stateManagment/ContextApi";

const CustomImageCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const { attendees, events, isLoading, error } = useContext(DataContext);

  const renderItem = ({ item }) => {

    const eventDate = moment(item.eventDate);
    const month = eventDate.format('MMM');
    const day = eventDate.date();
  
    return (
      <View style={styles.slideHolder}>
<View style={styles.slide}>

        <View style={styles.imageContainer}>
          <ImageBackground srcSet={item.eventGraphicsURL} style={styles.image}>
            <View style={styles.eventDate}>
            <Text style={styles.dateText}>{month}</Text>
            <Text style={styles.dayText}>{day}</Text>
            </View>
          </ImageBackground>
        </View>
        <Text style={styles.title}>{item.eventName}</Text>
        <Text style={styles.location}>{item.eventLocation}</Text>
      </View>
      </View>
      
    );
  };

  const pagination = (
    <Pagination
      containerStyle={styles.paginationContainer}
    />
  );
  return (
    <View style={styles.container}>
      <Carousel
        autoplay={true}
        loop={true}
        layout={'default'}
        data={events}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * .93}
        sliderHeight={200}
        itemHeight={200}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        onSnapToItem={(index) => setActiveSlide(index)}
        activeSlideAlignment={'start'}
      />
      {pagination}
    </View>
  );
};

const styles = StyleSheet.create({
  slideHolder:{
    // backgroundColor: 'blue',
    paddingHorizontal: 10,

  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    height: 200,
    backgroundColor: '#FFFAF0',
    // borderRadius: 7,
    margin: 5,
    padding:5
    // paddingHorizontal: 10,
  },
  imageContainer: {
    // width: '120%',
    height: '70%',
    marginBottom: 10,
    // borderRadius: 50,
  },
  image: {
    width: "100%",
    height: '100%',
    borderRadius:20
  },
  mayday:{
    marginTop:20,
    fontWeight:"500",
    fontSize:12
  },
  eventDate: {
    margin: 10,
    width: 50,
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 7,
    display: 'flex',
  },
  dateText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    width: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    // marginTop: 5,
  },
  dayText: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    width: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    marginTop: -5,
  },
  title: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 12,
    color:"#0C0404"
  },
  location: {
    textAlign: 'left',
    fontSize: 12,
  },
  paginationContainer: {
    // Add your pagination container styles here
  },
});

export default CustomImageCarousel;