import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import TabSelectorAnimation from 'react-native-tab-selector';
import Attendees from './TestScreen';
import AgendaList from './AgendaList';
import Agenda from './Agenda';
import Speakers from './Speakers';

const { width } = Dimensions.get('window');
const TAB_COUNT = 3; // Number of tabs
const TAB_WIDTH = width / TAB_COUNT;

const DATA = [{ title: 'Attendees' }, { title: 'Sessions' }, { title: 'Speakers' }];

const NewTabs = ({ route }) => {
  const { email, imagePath, userName, uid } = route.params.route;
  const [indexTab, setIndexTab] = useState(0);

// console.log(" passed Info: ", route.params)

  return (
    <View style={styles.wrapperAll}>
      <Text style={styles.titleTop}>Event Details</Text>
      <TabSelectorAnimation
        onChangeTab={setIndexTab}
        style={styles.tabSelector}
        tabs={DATA}
        activeTabStyle={styles.activeTab}
        inactiveTabStyle={styles.inactiveTab}
        activeTextStyle={styles.activeText}
        inactiveTextStyle={styles.inactiveText}
        tabContentStyle={{ width: TAB_WIDTH }} // Adjust the width of the tabs
      />
      {/* Render the appropriate component based on the selected tab */}
      {indexTab === 0 && <Attendees route={route} />}
      {indexTab === 1 && <Agenda route={route} />}
      {indexTab === 2 && <Speakers route={route} />}

      {/* Add similar conditions for other tabs */}
    </View>
  );
};

const styles = StyleSheet.create({


  titleTop:{
  fontSize:20,
  fontWeight:"500",
  textAlign:"left",
    marginTop:10,
    marginBottom:10
},
  wrapperAll: {
    flex: 1,
    // backgroundColor:"red",
    paddingTop: 40,
    // alignItems: 'center',
    paddingHorizontal:20,
    textAlign:"left"

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

export default NewTabs;
